'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Link from 'next/link'

type Venda = {
  id: string
  produto: string
  cliente: string
  categoria: string
  valor: number
  custo: number
  data: string
}

type Insumo = {
  id: string
  nome: string
  valor: number
  data: string
}

export default function Vendas() {
  const [vendas, setVendas] = useState<Venda[]>([])
  const [insumos, setInsumos] = useState<Insumo[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [tipo, setTipo] = useState<'venda' | 'insumo'>('venda')
  const [form, setForm] = useState({ produto: '', cliente: '', categoria: '3d', valor: '', custo: '', nome: '', data: new Date().toISOString().split('T')[0] })

  useEffect(() => { carregar() }, [])

  async function carregar() {
    setLoading(true)
    const [{ data: v }, { data: i }] = await Promise.all([
      supabase.from('vendas').select('*').order('data', { ascending: false }),
      supabase.from('insumos').select('*').order('data', { ascending: false })
    ])
    setVendas(v || [])
    setInsumos(i || [])
    setLoading(false)
  }

  async function salvar() {
    if (tipo === 'venda') {
      if (!form.produto || !form.cliente || !form.data) return alert('Preencha produto, cliente e data')
      await supabase.from('vendas').insert({ produto: form.produto, cliente: form.cliente, categoria: form.categoria, valor: Number(form.valor), custo: Number(form.custo), data: form.data })
    } else {
      if (!form.nome || !form.data) return alert('Preencha nome e data')
      await supabase.from('insumos').insert({ nome: form.nome, valor: Number(form.custo), data: form.data })
    }
    setModal(false)
    setForm({ produto: '', cliente: '', categoria: '3d', valor: '', custo: '', nome: '', data: new Date().toISOString().split('T')[0] })
    carregar()
  }

  async function deletarVenda(id: string) {
    if (!confirm('Remover esta venda?')) return
    await supabase.from('vendas').delete().eq('id', id)
    carregar()
  }

  async function deletarInsumo(id: string) {
    if (!confirm('Remover este insumo?')) return
    await supabase.from('insumos').delete().eq('id', id)
    carregar()
  }

  const fat = vendas.reduce((a, v) => a + Number(v.valor), 0)
  const custoV = vendas.reduce((a, v) => a + Number(v.custo), 0)
  const custoI = insumos.reduce((a, i) => a + Number(i.valor), 0)
  const lucro = fat - custoV - custoI

  const fmt = (v: number) => 'R$ ' + v.toFixed(2).replace('.', ',')
  const fmtData = (d: string) => { const [y, m, dd] = d.split('-'); return `${dd}/${m}/${y}` }

  const s: Record<string, React.CSSProperties> = {
    wrap: { background: '#0f0f11', minHeight: '100vh', color: '#f0f0f0', fontFamily: 'sans-serif', padding: '1.25rem 1rem 3rem' },
    maxW: { maxWidth: 680, margin: '0 auto' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' },
    h1: { fontSize: '1.4rem', fontWeight: 700 },
    accent: { color: '#e8ff47' },
    sub: { fontSize: '.72rem', color: '#6b6b78', fontFamily: 'monospace', marginTop: '.2rem' },
    btnAdd: { background: '#e8ff47', color: '#0f0f11', border: 'none', borderRadius: 10, padding: '.55rem 1rem', fontWeight: 700, fontSize: '.8rem', cursor: 'pointer' },
    kpis: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '.6rem', marginBottom: '1rem' },
    kpi: { background: '#18181c', border: '1px solid #2a2a30', borderRadius: 12, padding: '.85rem 1rem' },
    kpiLabel: { fontSize: '.6rem', letterSpacing: '.1em', textTransform: 'uppercase' as const, color: '#6b6b78', fontFamily: 'monospace', marginBottom: '.2rem' },
    kpiVal: { fontSize: '1.2rem', fontWeight: 700, fontFamily: 'monospace' },
    tableWrap: { background: '#18181c', border: '1px solid #2a2a30', borderRadius: 14, overflow: 'hidden', marginBottom: '1rem' },
    tHead: { display: 'grid', gridTemplateColumns: '1fr 80px 70px 70px 36px', padding: '.6rem 1rem', borderBottom: '1px solid #2a2a30' },
    tHCell: { fontSize: '.6rem', letterSpacing: '.1em', textTransform: 'uppercase' as const, color: '#6b6b78', fontFamily: 'monospace' },
    row: { display: 'grid', gridTemplateColumns: '1fr 80px 70px 70px 36px', padding: '.65rem 1rem', borderBottom: '1px solid #1e1e22', alignItems: 'center' },
    prodName: { fontSize: '.8rem', fontWeight: 600 },
    cli: { fontSize: '.68rem', color: '#6b6b78', fontFamily: 'monospace', marginTop: '.1rem' },
    badge: { display: 'inline-block', fontSize: '.58rem', fontFamily: 'monospace', padding: '.15rem .45rem', borderRadius: 20, marginTop: '.2rem' },
    dataCell: { fontSize: '.7rem', color: '#6b6b78', fontFamily: 'monospace', textAlign: 'right' as const },
    valCell: { fontSize: '.82rem', fontWeight: 600, fontFamily: 'monospace', textAlign: 'right' as const, color: '#4ade80' },
    custoCell: { fontSize: '.75rem', fontFamily: 'monospace', textAlign: 'right' as const, color: '#f87171' },
    delBtn: { background: 'none', border: 'none', color: '#6b6b78', cursor: 'pointer', fontSize: '.85rem', borderRadius: 4 },
    sectionTitle: { fontSize: '.65rem', letterSpacing: '.12em', textTransform: 'uppercase' as const, color: '#6b6b78', fontFamily: 'monospace', margin: '1.25rem 0 .6rem' },
    iRow: { display: 'grid', gridTemplateColumns: '1fr 80px 70px 36px', padding: '.65rem 1rem', borderBottom: '1px solid #1e1e22', alignItems: 'center' },
    empty: { padding: '1.5rem', textAlign: 'center' as const, color: '#6b6b78', fontFamily: 'monospace', fontSize: '.8rem' },
    nav: { fontSize: '.75rem', color: '#6b6b78', marginBottom: '1rem', fontFamily: 'monospace' },
    navLink: { color: '#e8ff47', textDecoration: 'none' },
    // Modal
    modalBg: { position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,.75)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' },
    modal: { background: '#18181c', border: '1px solid #2a2a30', borderRadius: 16, padding: '1.5rem', width: '100%', maxWidth: 400 },
    mLabel: { display: 'block', fontSize: '.68rem', color: '#6b6b78', fontFamily: 'monospace', marginBottom: '.3rem' },
    mInput: { width: '100%', background: '#0f0f11', border: '1px solid #2a2a30', borderRadius: 8, color: '#f0f0f0', fontFamily: 'monospace', fontSize: '.82rem', padding: '.5rem .75rem', outline: 'none', marginBottom: '.75rem', boxSizing: 'border-box' as const },
    mRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.6rem' },
    btnCancel: { flex: 1, background: 'transparent', border: '1px solid #2a2a30', color: '#6b6b78', borderRadius: 8, padding: '.6rem', cursor: 'pointer' },
    btnSave: { flex: 2, background: '#e8ff47', color: '#0f0f11', border: 'none', borderRadius: 8, padding: '.6rem', fontWeight: 700, cursor: 'pointer' },
    tipoRow: { display: 'flex', gap: '.5rem', marginBottom: '.85rem' },
    tipoBtn: { flex: 1, padding: '.45rem', border: '1px solid #2a2a30', borderRadius: 8, background: 'transparent', color: '#6b6b78', fontFamily: 'monospace', fontSize: '.72rem', cursor: 'pointer' },
    tipoBtnActive: { flex: 1, padding: '.45rem', border: '1px solid #e8ff47', borderRadius: 8, background: '#e8ff47', color: '#0f0f11', fontFamily: 'monospace', fontSize: '.72rem', cursor: 'pointer', fontWeight: 500 },
  }

  const badgeStyle = (cat: string): React.CSSProperties => ({
    ...s.badge,
    background: cat === '3d' ? '#1a1a2e' : '#1a2e1a',
    color: cat === '3d' ? '#47c4ff' : '#4ade80',
    border: `1px solid ${cat === '3d' ? '#2a2a50' : '#2a502a'}`
  })

  return (
    <div style={s.wrap}>
      <div style={s.maxW}>
        <div style={s.nav}>
          <Link href="/" style={s.navLink}>← início</Link>
          {' '} / vendas
        </div>
        <div style={s.header}>
          <div>
            <h1 style={s.h1}>Gestão de <span style={s.accent}>Vendas</span></h1>
            <p style={s.sub}>// {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</p>
          </div>
          <button style={s.btnAdd} onClick={() => setModal(true)}>+ Novo registro</button>
        </div>

        <div style={s.kpis}>
          <div style={s.kpi}>
            <div style={s.kpiLabel}>Faturamento</div>
            <div style={{ ...s.kpiVal, color: '#e8ff47' }}>{fmt(fat)}</div>
          </div>
          <div style={s.kpi}>
            <div style={s.kpiLabel}>Lucro líquido</div>
            <div style={{ ...s.kpiVal, color: '#4ade80' }}>{fmt(lucro)}</div>
          </div>
          <div style={s.kpi}>
            <div style={s.kpiLabel}>Vendas</div>
            <div style={{ ...s.kpiVal, color: '#47c4ff' }}>{vendas.length}</div>
          </div>
        </div>

        <div style={s.sectionTitle}>Vendas realizadas</div>
        <div style={s.tableWrap}>
          <div style={s.tHead}>
            <span style={s.tHCell}>Produto / cliente</span>
            <span style={{ ...s.tHCell, textAlign: 'right' }}>Data</span>
            <span style={{ ...s.tHCell, textAlign: 'right' }}>Custo</span>
            <span style={{ ...s.tHCell, textAlign: 'right' }}>Valor</span>
            <span style={s.tHCell}></span>
          </div>
          {loading ? <div style={s.empty}>Carregando...</div> : vendas.length === 0 ? <div style={s.empty}>Nenhuma venda registrada.</div> :
            vendas.map(v => (
              <div key={v.id} style={s.row}>
                <div>
                  <div style={s.prodName}>{v.produto}</div>
                  <div style={s.cli}>{v.cliente}</div>
                  <span style={badgeStyle(v.categoria)}>{v.categoria === '3d' ? 'Impressão 3D' : 'Eletrônico'}</span>
                </div>
                <div style={s.dataCell}>{fmtData(v.data)}</div>
                <div style={s.custoCell}>{fmt(Number(v.custo))}</div>
                <div style={s.valCell}>{fmt(Number(v.valor))}</div>
                <div><button style={s.delBtn} onClick={() => deletarVenda(v.id)}>✕</button></div>
              </div>
            ))}
        </div>

        <div style={s.sectionTitle}>Insumos e compras</div>
        <div style={s.tableWrap}>
          <div style={{ ...s.tHead, gridTemplateColumns: '1fr 80px 70px 36px' }}>
            <span style={s.tHCell}>Item</span>
            <span style={{ ...s.tHCell, textAlign: 'right' }}>Data</span>
            <span style={{ ...s.tHCell, textAlign: 'right' }}>Valor</span>
            <span style={s.tHCell}></span>
          </div>
          {loading ? <div style={s.empty}>Carregando...</div> : insumos.length === 0 ? <div style={s.empty}>Nenhum insumo registrado.</div> :
            insumos.map(i => (
              <div key={i.id} style={s.iRow}>
                <div style={s.prodName}>{i.nome}</div>
                <div style={s.dataCell}>{fmtData(i.data)}</div>
                <div style={s.custoCell}>{fmt(Number(i.valor))}</div>
                <div><button style={s.delBtn} onClick={() => deletarInsumo(i.id)}>✕</button></div>
              </div>
            ))}
        </div>
      </div>

      {modal && (
        <div style={s.modalBg} onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div style={s.modal}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>
              Novo <span style={s.accent}>registro</span>
            </h2>
            <div style={s.tipoRow}>
              <button style={tipo === 'venda' ? s.tipoBtnActive : s.tipoBtn} onClick={() => setTipo('venda')}>Venda</button>
              <button style={tipo === 'insumo' ? s.tipoBtnActive : s.tipoBtn} onClick={() => setTipo('insumo')}>Insumo / compra</button>
            </div>
            {tipo === 'venda' ? (
              <>
                <label style={s.mLabel}>Categoria</label>
                <select style={s.mInput} value={form.categoria} onChange={e => setForm({ ...form, categoria: e.target.value })}>
                  <option value="3d">Produto 3D</option>
                  <option value="eletronico">Eletrônico</option>
                </select>
                <label style={s.mLabel}>Produto</label>
                <input style={s.mInput} value={form.produto} onChange={e => setForm({ ...form, produto: e.target.value })} placeholder="Ex: Chaveiro Capitão América" />
                <label style={s.mLabel}>Cliente</label>
                <input style={s.mInput} value={form.cliente} onChange={e => setForm({ ...form, cliente: e.target.value })} placeholder="Ex: Eduarda" />
                <div style={s.mRow}>
                  <div>
                    <label style={s.mLabel}>Valor de venda (R$)</label>
                    <input style={s.mInput} type="number" value={form.valor} onChange={e => setForm({ ...form, valor: e.target.value })} placeholder="0,00" />
                  </div>
                  <div>
                    <label style={s.mLabel}>Custo (R$)</label>
                    <input style={s.mInput} type="number" value={form.custo} onChange={e => setForm({ ...form, custo: e.target.value })} placeholder="0,00" />
                  </div>
                </div>
              </>
            ) : (
              <>
                <label style={s.mLabel}>Descrição do insumo</label>
                <input style={s.mInput} value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} placeholder="Ex: Filamento PLA+ 1kg" />
                <label style={s.mLabel}>Valor gasto (R$)</label>
                <input style={s.mInput} type="number" value={form.custo} onChange={e => setForm({ ...form, custo: e.target.value })} placeholder="0,00" />
              </>
            )}
            <label style={s.mLabel}>Data</label>
            <input style={s.mInput} type="date" value={form.data} onChange={e => setForm({ ...form, data: e.target.value })} />
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