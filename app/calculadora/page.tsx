'use client'
import { useState } from 'react'
import { supabase } from '../lib/supabase'
import Link from 'next/link'

export default function Calculadora() {
  const [precoRolo, setPrecoRolo] = useState(120)
  const [gramas, setGramas] = useState(30)
  const [horas, setHoras] = useState(2)
  const [watts, setWatts] = useState(350)
  const [extra, setExtra] = useState(0)
  const [margem, setMargem] = useState(80)
  const [filMode, setFilMode] = useState<'valor' | 'tipo'>('valor')
  const [produto, setProduto] = useState('')
  const [salvando, setSalvando] = useState(false)
  const [salvoOk, setSalvoOk] = useState(false)

  const custofil = (precoRolo / 1000) * gramas
  const custoEner = (watts / 1000) * horas * 0.74
  const deprec = 5
  const custoTotal = custofil + custoEner + deprec + extra
  const precoFinal = custoTotal * (1 + margem / 100)
  const lucro = precoFinal - custoTotal

  const fmt = (v: number) => 'R$ ' + v.toFixed(2).replace('.', ',')

  const tiposFilamento = [
    { label: 'PLA comum — R$ 80/kg', value: 80 },
    { label: 'PLA+ — R$ 120/kg', value: 120 },
    { label: 'PETG — R$ 160/kg', value: 160 },
    { label: 'ABS — R$ 220/kg', value: 220 },
    { label: 'TPU — R$ 350/kg', value: 350 },
    { label: 'Resina — R$ 500/kg', value: 500 },
  ]

  async function salvarPrecificacao() {
    setSalvando(true)
    await supabase.from('precificacoes').insert({ produto: produto || null, preco_rolo: precoRolo, gramas, horas, watts, custo_total: custoTotal, preco_sugerido: precoFinal, margem })
    setSalvando(false)
    setSalvoOk(true)
    setTimeout(() => setSalvoOk(false), 2500)
  }

  const s: Record<string, React.CSSProperties> = {
    wrap: { background: '#0f0f11', minHeight: '100vh', color: '#f0f0f0', fontFamily: 'sans-serif', padding: '1.25rem 1rem 3rem' },
    maxW: { maxWidth: 640, margin: '0 auto' },
    nav: { fontSize: '.75rem', color: '#6b6b78', marginBottom: '1rem', fontFamily: 'monospace' },
    navLink: { color: '#e8ff47', textDecoration: 'none' },
    h1: { fontSize: '1.4rem', fontWeight: 700, marginBottom: '.3rem' },
    accent: { color: '#e8ff47' },
    sub: { fontSize: '.72rem', color: '#6b6b78', fontFamily: 'monospace', marginBottom: '1.5rem' },
    section: { background: '#18181c', border: '1px solid #2a2a30', borderRadius: 14, padding: '1.25rem', marginBottom: '1rem' },
    sectionTitle: { fontSize: '.65rem', fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase' as const, color: '#6b6b78', fontFamily: 'monospace', marginBottom: '1rem' },
    field: { marginBottom: '.85rem' },
    label: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '.72rem', color: '#6b6b78', fontFamily: 'monospace', marginBottom: '.35rem' },
    labelVal: { color: '#e8ff47', fontWeight: 500 },
    inputRow: { display: 'flex', gap: '.5rem', alignItems: 'center' },
    input: { background: '#0f0f11', border: '1px solid #2a2a30', borderRadius: 8, color: '#f0f0f0', fontFamily: 'monospace', fontSize: '.85rem', padding: '.55rem .75rem', width: '100%', outline: 'none', boxSizing: 'border-box' as const },
    select: { background: '#0f0f11', border: '1px solid #2a2a30', borderRadius: 8, color: '#f0f0f0', fontFamily: 'monospace', fontSize: '.82rem', padding: '.55rem .75rem', width: '100%', outline: 'none' },
    unit: { fontSize: '.7rem', color: '#6b6b78', fontFamily: 'monospace', whiteSpace: 'nowrap' as const, minWidth: '2.5rem' },
    toggleRow: { display: 'flex', gap: '.5rem', marginBottom: '.85rem' },
    toggleBtn: { flex: 1, padding: '.45rem', border: '1px solid #2a2a30', borderRadius: 8, background: 'transparent', color: '#6b6b78', fontFamily: 'monospace', fontSize: '.72rem', cursor: 'pointer' },
    toggleBtnActive: { flex: 1, padding: '.45rem', border: '1px solid #e8ff47', borderRadius: 8, background: '#e8ff47', color: '#0f0f11', fontFamily: 'monospace', fontSize: '.72rem', cursor: 'pointer', fontWeight: 500 },
    autoRow: { display: 'flex', alignItems: 'center', padding: '.6rem .75rem', background: '#0f0f11', border: '1px solid #2a2a30', borderRadius: 8, marginBottom: '.85rem' },
    autoLbl: { fontSize: '.72rem', color: '#6b6b78', fontFamily: 'monospace' },
    autoVal: { fontFamily: 'monospace', fontSize: '.85rem', color: '#47c4ff', marginLeft: 'auto', fontWeight: 500 },
    resultSection: { background: '#18181c', border: '1px solid #e8ff47', borderRadius: 14, padding: '1.25rem', marginBottom: '1rem' },
    resultGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.75rem', marginBottom: '1rem' },
    resultCard: { background: '#0f0f11', borderRadius: 10, padding: '.85rem', border: '1px solid #2a2a30' },
    rcLabel: { fontSize: '.6rem', letterSpacing: '.1em', textTransform: 'uppercase' as const, color: '#6b6b78', fontFamily: 'monospace', marginBottom: '.25rem' },
    rcVal: { fontSize: '1.1rem', fontWeight: 600, fontFamily: 'monospace' },
    priceHero: { textAlign: 'center' as const, margin: '.75rem 0 .5rem' },
    phLabel: { fontSize: '.65rem', letterSpacing: '.12em', textTransform: 'uppercase' as const, color: '#6b6b78', fontFamily: 'monospace' },
    phVal: { fontSize: '2.8rem', fontWeight: 700, color: '#e8ff47', letterSpacing: '-0.02em', lineHeight: 1.1 },
    phSub: { fontSize: '.72rem', color: '#6b6b78', fontFamily: 'monospace', marginTop: '.2rem' },
    bkRow: { display: 'flex', justifyContent: 'space-between', padding: '.35rem 0', borderBottom: '1px solid #2a2a30', fontSize: '.75rem' },
    bkName: { color: '#6b6b78', fontFamily: 'monospace' },
    bkVal: { fontFamily: 'monospace', color: '#f0f0f0' },
    saveArea: { marginTop: '1rem', display: 'flex', gap: '.6rem', flexDirection: 'column' as const },
    saveInput: { background: '#0f0f11', border: '1px solid #2a2a30', borderRadius: 8, color: '#f0f0f0', fontFamily: 'monospace', fontSize: '.82rem', padding: '.55rem .75rem', width: '100%', outline: 'none', boxSizing: 'border-box' as const },
    saveBtn: { width: '100%', padding: '.75rem', background: '#e8ff47', color: '#0f0f11', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: '.85rem', cursor: 'pointer' },
    savedMsg: { textAlign: 'center' as const, color: '#4ade80', fontFamily: 'monospace', fontSize: '.78rem', marginTop: '.5rem' },
  }

  return (
    <div style={s.wrap}>
      <div style={s.maxW}>
        <div style={s.nav}><Link href="/" style={s.navLink}>← início</Link> / calculadora 3D</div>
        <h1 style={s.h1}>Precificador <span style={s.accent}>3D</span></h1>
        <p style={s.sub}>// custo real · margem inteligente · preço justo</p>

        {/* Filamento */}
        <div style={s.section}>
          <div style={s.sectionTitle}>Filamento</div>
          <div style={s.toggleRow}>
            <button style={filMode === 'valor' ? s.toggleBtnActive : s.toggleBtn} onClick={() => setFilMode('valor')}>Informar valor</button>
            <button style={filMode === 'tipo' ? s.toggleBtnActive : s.toggleBtn} onClick={() => setFilMode('tipo')}>Selecionar tipo</button>
          </div>
          {filMode === 'valor' ? (
            <div style={s.field}>
              <div style={s.label}><span>Valor pago pelo rolo (1kg)</span><span style={s.labelVal}>{fmt(precoRolo)}</span></div>
              <div style={s.inputRow}>
                <input style={s.input} type="number" value={precoRolo} onChange={e => setPrecoRolo(Number(e.target.value))} min={0} />
                <span style={s.unit}>R$/kg</span>
              </div>
            </div>
          ) : (
            <div style={s.field}>
              <div style={s.label}><span>Tipo de filamento</span></div>
              <select style={s.select} value={precoRolo} onChange={e => setPrecoRolo(Number(e.target.value))}>
                {tiposFilamento.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
          )}
          <div style={s.field}>
            <div style={s.label}><span>Gramas usadas na peça</span><span style={s.labelVal}>{gramas} g</span></div>
            <div style={s.inputRow}>
              <input style={s.input} type="number" value={gramas} onChange={e => setGramas(Number(e.target.value))} min={0} />
              <span style={s.unit}>g</span>
            </div>
          </div>
          <div style={s.autoRow}>
            <span style={s.autoLbl}>Custo do filamento</span>
            <span style={s.autoVal}>{fmt(custofil)}</span>
          </div>
        </div>

        {/* Impressão */}
        <div style={s.section}>
          <div style={s.sectionTitle}>Impressão</div>
          <div style={s.field}>
            <div style={s.label}><span>Horas de impressão</span><span style={s.labelVal}>{horas} h</span></div>
            <div style={s.inputRow}>
              <input style={s.input} type="number" value={horas} onChange={e => setHoras(Number(e.target.value))} min={0} step={0.5} />
              <span style={s.unit}>h</span>
            </div>
          </div>
          <div style={s.field}>
            <div style={s.label}><span>Consumo da impressora</span><span style={s.labelVal}>{watts} W</span></div>
            <div style={s.inputRow}>
              <input style={s.input} type="number" value={watts} onChange={e => setWatts(Number(e.target.value))} min={1} step={10} />
              <span style={s.unit}>W</span>
            </div>
          </div>
          <div style={s.autoRow}>
            <span style={s.autoLbl}>Energia (R$ 0,74/kWh)</span>
            <span style={s.autoVal}>{fmt(custoEner)}</span>
          </div>
          <div style={{ ...s.autoRow, marginBottom: 0 }}>
            <span style={s.autoLbl}>Depreciação da máquina</span>
            <span style={s.autoVal}>R$ 5,00</span>
          </div>
        </div>

        {/* Extra */}
        <div style={s.section}>
          <div style={s.sectionTitle}>Extras (opcional)</div>
          <div style={s.field}>
            <div style={s.label}><span>Acabamento / pós-processo</span><span style={s.labelVal}>{fmt(extra)}</span></div>
            <div style={s.inputRow}>
              <input style={s.input} type="number" value={extra} onChange={e => setExtra(Number(e.target.value))} min={0} step={0.5} />
              <span style={s.unit}>R$</span>
            </div>
          </div>
        </div>

        {/* Resultado */}
        <div style={s.resultSection}>
          <div style={s.sectionTitle}>Resultado</div>
          <div style={s.resultGrid}>
            <div style={s.resultCard}>
              <div style={s.rcLabel}>Custo total</div>
              <div style={{ ...s.rcVal, color: '#f87171' }}>{fmt(custoTotal)}</div>
            </div>
            <div style={s.resultCard}>
              <div style={s.rcLabel}>Lucro</div>
              <div style={{ ...s.rcVal, color: '#4ade80' }}>{fmt(lucro)}</div>
            </div>
          </div>

          {/* Margem */}
          <div style={{ background: '#0f0f11', border: '1px solid #2a2a30', borderRadius: 10, padding: '.85rem', marginBottom: '1rem' }}>
            <div style={{ fontSize: '.65rem', letterSpacing: '.1em', textTransform: 'uppercase', color: '#6b6b78', fontFamily: 'monospace', marginBottom: '.6rem' }}>Margem de lucro desejada</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
              <input type="range" min={10} max={300} step={5} value={margem} onChange={e => setMargem(Number(e.target.value))} style={{ flex: 1, accentColor: '#e8ff47' }} />
              <span style={{ fontSize: '.9rem', fontWeight: 600, color: '#e8ff47', fontFamily: 'monospace', minWidth: '2.5rem', textAlign: 'right' }}>{margem}%</span>
            </div>
          </div>

          <div style={s.priceHero}>
            <div style={s.phLabel}>Preço sugerido de venda</div>
            <div style={s.phVal}>{fmt(precoFinal)}</div>
            <div style={s.phSub}>— margem de {margem}% sobre o custo —</div>
          </div>

          <div style={{ marginTop: '1rem' }}>
            {[
              { name: 'Filamento', val: custofil },
              { name: 'Energia elétrica', val: custoEner },
              { name: 'Depreciação máquina', val: deprec },
              { name: 'Acabamento / extra', val: extra },
            ].map(b => (
              <div key={b.name} style={s.bkRow}>
                <span style={s.bkName}>{b.name}</span>
                <span style={s.bkVal}>{fmt(b.val)}</span>
              </div>
            ))}
            <div style={{ ...s.bkRow, borderBottom: 'none' }}>
              <span style={{ ...s.bkName, color: '#f0f0f0', fontWeight: 600 }}>Custo total</span>
              <span style={{ ...s.bkVal, color: '#f87171', fontWeight: 600 }}>{fmt(custoTotal)}</span>
            </div>
          </div>

          <div style={s.saveArea}>
            <input style={s.saveInput} placeholder="Nome do produto (opcional, para salvar no histórico)" value={produto} onChange={e => setProduto(e.target.value)} />
            <button style={s.saveBtn} onClick={salvarPrecificacao} disabled={salvando}>
              {salvando ? 'Salvando...' : 'Salvar precificação no histórico'}
            </button>
            {salvoOk && <div style={s.savedMsg}>✓ Precificação salva com sucesso!</div>}
          </div>
        </div>
      </div>
    </div>
  )
}