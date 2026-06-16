'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Link from 'next/link'

type Filamento = {
  id: string
  material: string
  cor: string
  peso_total: number
  peso_restante: number
  valor: number
  data_compra: string
  foto_file_id: string | null
  created_at: string
}

export default function Filamentos() {
  const [filamentos, setFilamentos] = useState<Filamento[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ material: 'PLA', cor: '', peso_total: '', valor: '', data_compra: new Date().toISOString().split('T')[0] })
  const [editando, setEditando] = useState<string | null>(null)
  const [pesoRestante, setPesoRestante] = useState('')

  useEffect(() => { carregar() }, [])

  async function carregar() {
    setLoading(true)
    const { data } = await supabase.from('filamentos').select('*').order('created_at', { ascending: false })
    setFilamentos(data || [])
    setLoading(false)
  }

  async function salvar() {
    if (!form.cor || !form.peso_total || !form.valor) return alert('Preencha cor, peso e valor')
    await supabase.from('filamentos').insert({
      material: form.material,
      cor: form.cor,
      peso_total: Number(form.peso_total),
      peso_restante: Number(form.peso_total),
      valor: Number(form.valor),
      data_compra: form.data_compra,
      foto_file_id: null
    })
    setModal(false)
    setForm({ material: 'PLA', cor: '', peso_total: '', valor: '', data_compra: new Date().toISOString().split('T')[0] })
    carregar()
  }

  async function atualizarPeso(id: string, pesoAtual: number) {
    const novo = parseFloat(pesoRestante)
    if (isNaN(novo) || novo < 0) return alert('Peso inválido')
    await supabase.from('filamentos').update({ peso_restante: novo }).eq('id', id)
    setEditando(null)
    setPesoRestante('')
    carregar()
  }

  async function deletar(id: string) {
    if (!confirm('Remover este filamento?')) return
    await supabase.from('filamentos').delete().eq('id', id)
    carregar()
  }

  const fmt = (v: number) => 'R$ ' + v.toFixed(2).replace('.', ',')
  const fmtData = (d: string) => { const [y, m, dd] = d.split('-'); return `${dd}/${m}/${y}` }

  const cores: Record<string, string> = {
    'PLA': '#47c4ff', 'PLA+': '#e8ff47', 'PETG': '#4ade80',
    'ABS': '#f87171', 'TPU': '#c084fc', 'Resina': '#fb923c'
  }

  const totalGasto = filamentos.reduce((a, f) => a + Number(f.valor), 0)
  const totalPeso = filamentos.reduce((a, f) => a + Number(f.peso_restante), 0)
  const baixoEstoque = filamentos.filter(f => Number(f.peso_restante) < 200).length

  const s: Record<string, React.CSSProperties> = {
    wrap: { background: '#0f0f11', minHeight: '100vh', color: '#f0f0f0', fontFamily: 'sans-serif', padding: '1.25rem 1rem 3rem' },
    maxW: { maxWidth: 680, margin: '0 auto' },
    nav: { fontSize: '.75rem', color: '#6b6b78', marginBottom: '1rem', fontFamily: 'monospace' },
    navLink: { color: '#e8ff47', textDecoration: 'none' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' },
    h1: { fontSize: '1.4rem', fontWeight: 700 },
    accent: { color: '#e8ff47' },
    sub: { fontSize: '.72rem', color: '#6b6b78', fontFamily: 'monospace', marginTop: '.2rem' },
    btnAdd: { background: '#e8ff47', color: '#0f0f11', border: 'none', borderRadius: 10, padding: '.55rem 1rem', fontWeight: 700, fontSize: '.8rem', cursor: 'pointer' },
    kpis: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '.6rem', marginBottom: '1.25rem' },
    kpi: { background: '#18181c', border: '1px solid #2a2a30', borderRadius: 12, padding: '.85rem 1rem' },
    kpiLabel: { fontSize: '.6rem', letterSpacing: '.1em', textTransform: 'uppercase' as const, color: '#6b6b78', fontFamily: 'monospace', marginBottom: '.2rem' },
    kpiVal: { fontSize: '1.1rem', fontWeight: 700, fontFamily: 'monospace' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '.85rem' },
    card: { background: '#18181c', border: '1px solid #2a2a30', borderRadius: 14, overflow: 'hidden' },
    cardTop: { padding: '1rem', borderBottom: '1px solid #2a2a30' },
    cardBody: { padding: '1rem' },
    badge: { display: 'inline-block', fontSize: '.65rem', fontFamily: 'monospace', padding: '.2rem .6rem', borderRadius: 20, fontWeight: 500, marginBottom: '.6rem' },
    cardTitle: { fontSize: '1rem', fontWeight: 700, marginBottom: '.15rem' },
    cardSub: { fontSize: '.72rem', color: '#6b6b78', fontFamily: 'monospace' },
    progressBg: { height: 8, background: '#2a2a30', borderRadius: 4, overflow: 'hidden', margin: '.75rem 0 .35rem' },
    row: { display: 'flex', justifyContent: 'space-between', fontSize: '.72rem', fontFamily: 'monospace', color: '#6b6b78', marginBottom: '.35rem' },
    rowVal: { color: '#f0f0f0' },
    cardFooter: { display: 'flex', gap: '.5rem', padding: '0 1rem 1rem' },
    editBtn: { flex: 1, background: '#2a2a30', border: 'none', color: '#f0f0f0', borderRadius: 8, padding: '.45rem', fontSize: '.72rem', fontFamily: 'monospace', cursor: 'pointer' },
    delBtn: { background: 'none', border: '1px solid #2a2a30', color: '#6b6b78', borderRadius: 8, padding: '.45rem .75rem', fontSize: '.72rem', cursor: 'pointer' },
    alerta: { background: '#2e1a1a', border: '1px solid #502a2a', borderRadius: 10, padding: '.6rem 1rem', marginBottom: '1rem', fontSize: '.75rem', color: '#f87171', fontFamily: 'monospace' },
    empty: { textAlign: 'center' as const, color: '#6b6b78', fontFamily: 'monospace', fontSize: '.8rem', padding: '3rem 0' },
    modalBg: { position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,.75)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' },
    modal: { background: '#18181c', border: '1px solid #2a2a30', borderRadius: 16, padding: '1.5rem', width: '100%', maxWidth: 400 },
    mLabel: { display: 'block', fontSize: '.68rem', color: '#6b6b78', fontFamily: 'monospace', marginBottom: '.3rem' },
    mInput: { width: '100%', background: '#0f0f11', border: '1px solid #2a2a30', borderRadius: 8, color: '#f0f0f0', fontFamily: 'monospace', fontSize: '.82rem', padding: '.5rem .75rem', outline: 'none', marginBottom: '.75rem', boxSizing: 'border-box' as const },
    mRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.6rem' },
    btnCancel: { flex: 1, background: 'transparent', border: '1px solid #2a2a30', color: '#6b6b78', borderRadius: 8, padding: '.6rem', cursor: 'pointer', fontFamily: 'sans-serif' },
    btnSave: { flex: 2, background: '#e8ff47', color: '#0f0f11', border: 'none', borderRadius: 8, padding: '.6rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'sans-serif' },
  }

  return (
    <div style={s.wrap}>
      <div style={s.maxW}>
        <div style={s.nav}><Link href="/" style={s.navLink}>← início</Link> / filamentos</div>
        <div style={s.header}>
          <div>
            <h1 style={s.h1}>Estoque de <span style={s.accent}>Filamentos</span></h1>
            <p style={s.sub}>// material · cor · peso restante</p>
          </div>
          <button style={s.btnAdd} onClick={() => setModal(true)}>+ Novo filamento</button>
        </div>

        <div style={s.kpis}>
          <div style={s.kpi}>
            <div style={s.kpiLabel}>Total investido</div>
            <div style={{ ...s.kpiVal, color: '#e8ff47' }}>{fmt(totalGasto)}</div>
          </div>
          <div style={s.kpi}>
            <div style={s.kpiLabel}>Peso disponível</div>
            <div style={{ ...s.kpiVal, color: '#4ade80' }}>{totalPeso.toFixed(0)}g</div>
          </div>
          <div style={s.kpi}>
            <div style={s.kpiLabel}>Estoque baixo</div>
            <div style={{ ...s.kpiVal, color: baixoEstoque > 0 ? '#f87171' : '#4ade80' }}>{baixoEstoque}</div>
          </div>
        </div>

        {baixoEstoque > 0 && (
          <div style={s.alerta}>
            ⚠️ {baixoEstoque} filamento{baixoEstoque > 1 ? 's' : ''} com menos de 200g restantes — considere repor!
          </div>
        )}

        {loading ? (
          <div style={s.empty}>Carregando...</div>
        ) : filamentos.length === 0 ? (
          <div style={s.empty}>
            <div style={{ fontSize: '2rem', marginBottom: '.5rem' }}>🧵</div>
            Nenhum filamento cadastrado ainda.<br />
            <span style={{ fontSize: '.7rem' }}>Envie uma foto pelo Telegram ou clique em "+ Novo filamento"</span>
          </div>
        ) : (
          <div style={s.grid}>
            {filamentos.map(f => {
              const pct = Math.round((Number(f.peso_restante) / Number(f.peso_total)) * 100)
              const cor = cores[f.material] || '#47c4ff'
              const baixo = Number(f.peso_restante) < 200
              return (
                <div key={f.id} style={{ ...s.card, borderColor: baixo ? '#502a2a' : '#2a2a30' }}>
                  <div style={s.cardTop}>
                    {f.foto_url && (
  <img 
    src={f.foto_url} 
    alt={f.cor}
    style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 8, marginBottom: '.75rem' }}
  />
)}
<span style={{ ...s.badge, background: cor + '22', color: cor, border: `1px solid ${cor}44` }}>{f.material}</span>
<div style={s.cardTitle}>{f.cor}</div>
                    <div style={s.cardSub}>Comprado em {fmtData(f.data_compra)} · {fmt(Number(f.valor))}</div>
                    <div style={s.progressBg}>
                      <div style={{ height: '100%', width: `${pct}%`, background: baixo ? '#f87171' : cor, borderRadius: 4, transition: 'width .3s' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.68rem', fontFamily: 'monospace' }}>
                      <span style={{ color: baixo ? '#f87171' : '#6b6b78' }}>{Number(f.peso_restante).toFixed(0)}g restantes</span>
                      <span style={{ color: '#6b6b78' }}>{pct}% de {Number(f.peso_total).toFixed(0)}g</span>
                    </div>
                  </div>
                  <div style={s.cardBody}>
                    {editando === f.id ? (
                      <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
                        <input
                          style={{ ...s.mInput, marginBottom: 0, flex: 1 }}
                          type="number"
                          placeholder="Novo peso restante (g)"
                          value={pesoRestante}
                          onChange={e => setPesoRestante(e.target.value)}
                        />
                        <button style={{ ...s.btnSave, flex: 'none', padding: '.45rem .85rem' }} onClick={() => atualizarPeso(f.id, Number(f.peso_restante))}>OK</button>
                        <button style={{ ...s.delBtn }} onClick={() => setEditando(null)}>✕</button>
                      </div>
                    ) : (
                      <div style={s.cardFooter}>
                        <button style={s.editBtn} onClick={() => { setEditando(f.id); setPesoRestante(String(f.peso_restante)) }}>✏️ Atualizar peso</button>
                        <button style={s.delBtn} onClick={() => deletar(f.id)}>🗑️</button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {modal && (
        <div style={s.modalBg} onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div style={s.modal}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Novo <span style={s.accent}>filamento</span></h2>
            <label style={s.mLabel}>Material</label>
            <select style={s.mInput} value={form.material} onChange={e => setForm({ ...form, material: e.target.value })}>
              {['PLA', 'PLA+', 'PETG', 'ABS', 'TPU', 'Resina'].map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <label style={s.mLabel}>Cor</label>
            <input style={s.mInput} value={form.cor} onChange={e => setForm({ ...form, cor: e.target.value })} placeholder="Ex: Vermelho, Azul petróleo..." />
            <div style={s.mRow}>
              <div>
                <label style={s.mLabel}>Peso total (g)</label>
                <input style={s.mInput} type="number" value={form.peso_total} onChange={e => setForm({ ...form, peso_total: e.target.value })} placeholder="1000" />
              </div>
              <div>
                <label style={s.mLabel}>Valor pago (R$)</label>
                <input style={s.mInput} type="number" value={form.valor} onChange={e => setForm({ ...form, valor: e.target.value })} placeholder="120" />
              </div>
            </div>
            <label style={s.mLabel}>Data de compra</label>
            <input style={s.mInput} type="date" value={form.data_compra} onChange={e => setForm({ ...form, data_compra: e.target.value })} />
            <div style={{ display: 'flex', gap: '.6rem', marginTop: '.5rem' }}>
              <button style={s.btnCancel} onClick={() => setModal(false)}>Cancelar</button>
              <button style={s.btnSave} onClick={salvar}>Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}