'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Link from 'next/link'

type Venda = { id: string; produto: string; cliente: string; categoria: string; valor: number; custo: number; data: string }
type Insumo = { id: string; nome: string; valor: number; data: string }

const MESES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']

export default function Dashboard() {
  const [vendas, setVendas] = useState<Venda[]>([])
  const [insumos, setInsumos] = useState<Insumo[]>([])
  const [loading, setLoading] = useState(true)
  const [mes, setMes] = useState(new Date().getMonth())
  const [ano, setAno] = useState(new Date().getFullYear())

  useEffect(() => { carregar() }, [mes, ano])

  async function carregar() {
    setLoading(true)
    const inicio = `${ano}-${String(mes + 1).padStart(2, '0')}-01`
    const proximoMes = mes === 11 ? `${ano + 1}-01-01` : `${ano}-${String(mes + 2).padStart(2, '0')}-01`
    const [{ data: v }, { data: i }] = await Promise.all([
      supabase.from('vendas').select('*').gte('data', inicio).lt('data', proximoMes),
      supabase.from('insumos').select('*').gte('data', inicio).lt('data', proximoMes)
    ])
    setVendas(v || [])
    setInsumos(i || [])
    setLoading(false)
  }

  function navMes(d: number) {
    let m = mes + d, a = ano
    if (m > 11) { m = 0; a++ }
    if (m < 0) { m = 11; a-- }
    setMes(m); setAno(a)
  }

  const fat = vendas.reduce((a, v) => a + Number(v.valor), 0)
  const custoV = vendas.reduce((a, v) => a + Number(v.custo), 0)
  const custoI = insumos.reduce((a, i) => a + Number(i.valor), 0)
  const lucro = fat - custoV - custoI
  const margem = fat > 0 ? Math.round((lucro / fat) * 100) : 0
  const ticket = vendas.length > 0 ? fat / vendas.length : 0

  const fat3d = vendas.filter(v => v.categoria === '3d').reduce((a, v) => a + Number(v.valor), 0)
  const fatElet = vendas.filter(v => v.categoria === 'eletronico').reduce((a, v) => a + Number(v.valor), 0)

  // Semanas
  const semanas = [0, 0, 0, 0]
  vendas.forEach(v => { const d = parseInt(v.data.split('-')[2]); semanas[Math.min(3, Math.floor((d - 1) / 7))] += Number(v.valor) })
  const maxSem = Math.max(...semanas, 1)

  // Top clientes
  const clientes: Record<string, { val: number; qtd: number }> = {}
  vendas.forEach(v => { if (!clientes[v.cliente]) clientes[v.cliente] = { val: 0, qtd: 0 }; clientes[v.cliente].val += Number(v.valor); clientes[v.cliente].qtd++ })
  const topCli = Object.entries(clientes).sort((a, b) => b[1].val - a[1].val).slice(0, 5)

  const fmt = (v: number) => 'R$ ' + v.toFixed(2).replace('.', ',')
  const fmtData = (d: string) => { const [y, m, dd] = d.split('-'); return `${dd}/${m}` }

  const s: Record<string, React.CSSProperties> = {
    wrap: { background: '#0f0f11', minHeight: '100vh', color: '#f0f0f0', fontFamily: 'sans-serif', padding: '1.25rem 1rem 3rem' },
    maxW: { maxWidth: 680, margin: '0 auto' },
    nav: { fontSize: '.75rem', color: '#6b6b78', marginBottom: '1rem', fontFamily: 'monospace' },
    navLink: { color: '#e8ff47', textDecoration: 'none' },
    h1: { fontSize: '1.4rem', fontWeight: 700, marginBottom: '1rem' },
    accent: { color: '#e8ff47' },
    mesNav: { display: 'flex', alignItems: 'center', gap: '.75rem', marginBottom: '1.25rem' },
    mesBtn: { background: '#18181c', border: '1px solid #2a2a30', color: '#6b6b78', borderRadius: 8, padding: '.35rem .75rem', fontFamily: 'monospace', fontSize: '.75rem', cursor: 'pointer' },
    mesLabel: { fontFamily: 'monospace', fontSize: '.85rem', flex: 1, textAlign: 'center' as const },
    kpis: { display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '.6rem', marginBottom: '1rem' },
    kpi: { background: '#18181c', border: '1px solid #2a2a30', borderRadius: 12, padding: '.9rem 1rem' },
    kpiLabel: { fontSize: '.6rem', letterSpacing: '.1em', textTransform: 'uppercase' as const, color: '#6b6b78', fontFamily: 'monospace', marginBottom: '.2rem' },
    kpiVal: { fontSize: '1.3rem', fontWeight: 700, fontFamily: 'monospace' },
    kpiSub: { fontSize: '.65rem', color: '#6b6b78', fontFamily: 'monospace', marginTop: '.15rem' },
    card: { background: '#18181c', border: '1px solid #2a2a30', borderRadius: 14, padding: '1.1rem', marginBottom: '.85rem' },
    cardTitle: { fontSize: '.65rem', letterSpacing: '.1em', textTransform: 'uppercase' as const, color: '#6b6b78', fontFamily: 'monospace', marginBottom: '1rem' },
    row2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.85rem', marginBottom: '.85rem' },
    empty: { color: '#6b6b78', fontFamily: 'monospace', fontSize: '.78rem', padding: '.5rem 0' },
  }

  if (loading) return <div style={{ ...s.wrap, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p style={{ color: '#6b6b78', fontFamily: 'monospace' }}>Carregando...</p></div>

  return (
    <div style={s.wrap}>
      <div style={s.maxW}>
        <div style={s.nav}><Link href="/" style={s.navLink}>← início</Link> / dashboard</div>
        <h1 style={s.h1}>Dashboard <span style={s.accent}>de Vendas</span></h1>

        <div style={s.mesNav}>
          <button style={s.mesBtn} onClick={() => navMes(-1)}>← anterior</button>
          <span style={s.mesLabel}>{MESES[mes]} {ano}</span>
          <button style={s.mesBtn} onClick={() => navMes(1)}>próximo →</button>
        </div>

        <div style={s.kpis}>
          <div style={s.kpi}>
            <div style={s.kpiLabel}>Faturamento</div>
            <div style={{ ...s.kpiVal, color: '#e8ff47' }}>{fmt(fat)}</div>
            <div style={s.kpiSub}>{vendas.length} vendas no mês</div>
          </div>
          <div style={s.kpi}>
            <div style={s.kpiLabel}>Lucro líquido</div>
            <div style={{ ...s.kpiVal, color: '#4ade80' }}>{fmt(lucro)}</div>
            <div style={s.kpiSub}>margem: {margem}%</div>
          </div>
          <div style={s.kpi}>
            <div style={s.kpiLabel}>Total insumos</div>
            <div style={{ ...s.kpiVal, color: '#fb923c' }}>{fmt(custoI)}</div>
            <div style={s.kpiSub}>gastos do mês</div>
          </div>
          <div style={s.kpi}>
            <div style={s.kpiLabel}>Ticket médio</div>
            <div style={{ ...s.kpiVal, color: '#47c4ff' }}>{fmt(ticket)}</div>
            <div style={s.kpiSub}>{vendas.length} vendas</div>
          </div>
        </div>

        {/* Barras semanais */}
        <div style={s.card}>
          <div style={s.cardTitle}>Faturamento por semana</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 120, paddingBottom: 24, position: 'relative' }}>
            {['S1','S2','S3','S4'].map((sem, i) => {
              const h = Math.round((semanas[i] / maxSem) * 100)
              const cores = ['#e8ff47','#47c4ff','#c084fc','#4ade80']
              return (
                <div key={sem} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
                  <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end', position: 'relative' }}>
                    <div style={{ width: '100%', height: `${h}%`, background: cores[i], borderRadius: '5px 5px 0 0', minHeight: 2, position: 'relative' }}>
                      {semanas[i] > 0 && <span style={{ position: 'absolute', top: -18, left: '50%', transform: 'translateX(-50%)', fontSize: '.58rem', fontFamily: 'monospace', color: '#f0f0f0', whiteSpace: 'nowrap' }}>{fmt(semanas[i])}</span>}
                    </div>
                    <span style={{ position: 'absolute', bottom: -20, left: '50%', transform: 'translateX(-50%)', fontSize: '.6rem', fontFamily: 'monospace', color: '#6b6b78' }}>{sem}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div style={s.row2}>
          {/* Categorias */}
          <div style={{ ...s.card, marginBottom: 0 }}>
            <div style={s.cardTitle}>Por categoria</div>
            {[{ label: '3D', val: fat3d, cor: '#47c4ff' }, { label: 'Eletrônico', val: fatElet, cor: '#4ade80' }].map(c => (
              <div key={c.label} style={{ marginBottom: '.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.72rem', fontFamily: 'monospace', marginBottom: '.3rem' }}>
                  <span style={{ color: '#6b6b78' }}>{c.label}</span>
                  <span style={{ color: c.cor, fontWeight: 500 }}>{fmt(c.val)}</span>
                </div>
                <div style={{ height: 8, background: '#1e1e22', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${fat > 0 ? Math.round((c.val / fat) * 100) : 0}%`, background: c.cor, borderRadius: 4 }} />
                </div>
              </div>
            ))}
          </div>

          {/* Custo vs Receita */}
          <div style={{ ...s.card, marginBottom: 0 }}>
            <div style={s.cardTitle}>Custo vs receita</div>
            {[
              { label: 'Receita', val: fat, cor: '#e8ff47' },
              { label: 'Custo vendas', val: custoV, cor: '#f87171' },
              { label: 'Insumos', val: custoI, cor: '#fb923c' },
            ].map(c => {
              const max = Math.max(fat, custoV, custoI, 1)
              return (
                <div key={c.label} style={{ marginBottom: '.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.7rem', fontFamily: 'monospace', marginBottom: '.3rem' }}>
                    <span style={{ color: '#6b6b78' }}>{c.label}</span>
                    <span style={{ color: c.cor }}>{fmt(c.val)}</span>
                  </div>
                  <div style={{ height: 8, background: '#1e1e22', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.round((c.val / max) * 100)}%`, background: c.cor, borderRadius: 4 }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Insumos */}
        <div style={{ ...s.card, marginTop: '.85rem' }}>
          <div style={s.cardTitle}>Insumos do mês</div>
          {insumos.length === 0 ? <p style={s.empty}>Nenhum insumo registrado.</p> :
            insumos.map(i => (
              <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '.4rem 0', borderBottom: '1px solid #2a2a30', fontSize: '.78rem' }}>
                <div>
                  <span style={{ fontFamily: 'monospace' }}>{i.nome}</span>
                  <span style={{ color: '#6b6b78', fontSize: '.65rem', fontFamily: 'monospace', marginLeft: '.5rem' }}>dia {i.data.split('-')[2]}</span>
                </div>
                <span style={{ color: '#fb923c', fontFamily: 'monospace', fontWeight: 500 }}>{fmt(Number(i.valor))}</span>
              </div>
            ))}
        </div>

        {/* Top clientes */}
        <div style={s.card}>
          <div style={s.cardTitle}>Top clientes</div>
          {topCli.length === 0 ? <p style={s.empty}>Sem vendas no mês.</p> :
            topCli.map(([nome, d], i) => (
              <div key={nome} style={{ display: 'flex', alignItems: 'center', gap: '.75rem', padding: '.45rem 0', borderBottom: '1px solid #2a2a30' }}>
                <span style={{ fontSize: '.7rem', fontFamily: 'monospace', color: '#6b6b78', minWidth: 16 }}>{i + 1}</span>
                <span style={{ fontSize: '.8rem', flex: 1 }}>{nome}</span>
                <span style={{ fontSize: '.65rem', color: '#6b6b78', fontFamily: 'monospace' }}>{d.qtd} venda{d.qtd > 1 ? 's' : ''}</span>
                <span style={{ fontSize: '.78rem', fontFamily: 'monospace', color: '#4ade80', fontWeight: 500 }}>{fmt(d.val)}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}