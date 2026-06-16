'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'

export default function Home() {
  const [fat, setFat] = useState(0)
  const [vendas, setVendas] = useState(0)
  const [filamentos, setFilamentos] = useState(0)
  const [baixoEstoque, setBaixoEstoque] = useState(0)

  useEffect(() => {
    async function carregar() {
      const inicio = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]
      const [{ data: v }, { data: f }] = await Promise.all([
        supabase.from('vendas').select('valor').gte('data', inicio),
        supabase.from('filamentos').select('peso_restante')
      ])
      const totalFat = (v || []).reduce((a, i) => a + Number(i.valor), 0)
      setFat(totalFat)
      setVendas((v || []).length)
      setFilamentos((f || []).length)
      setBaixoEstoque((f || []).filter(i => Number(i.peso_restante) < 200).length)
    }
    carregar()
  }, [])

  const fmt = (v: number) => 'R$ ' + v.toFixed(2).replace('.', ',')
  const mes = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'][new Date().getMonth()]

  const s: Record<string, React.CSSProperties> = {
    wrap: { background: '#0f0f11', minHeight: '100vh', color: '#f0f0f0', fontFamily: 'sans-serif', padding: '2rem 1rem 3rem' },
    maxW: { maxWidth: 480, margin: '0 auto' },
    logo: { marginBottom: '2rem', textAlign: 'center' as const },
    h1: { fontSize: '1.8rem', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1 },
    accent: { color: '#e8ff47' },
    sub: { fontSize: '.75rem', color: '#6b6b78', fontFamily: 'monospace', marginTop: '.4rem' },
    kpis: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.6rem', marginBottom: '1.5rem' },
    kpi: { background: '#18181c', border: '1px solid #2a2a30', borderRadius: 12, padding: '.9rem 1rem' },
    kpiLabel: { fontSize: '.6rem', letterSpacing: '.1em', textTransform: 'uppercase' as const, color: '#6b6b78', fontFamily: 'monospace', marginBottom: '.2rem' },
    kpiVal: { fontSize: '1.2rem', fontWeight: 700, fontFamily: 'monospace' },
    kpiSub: { fontSize: '.62rem', color: '#6b6b78', fontFamily: 'monospace', marginTop: '.15rem' },
    nav: { display: 'flex', flexDirection: 'column' as const, gap: '.6rem' },
    navItem: { display: 'flex', alignItems: 'center', gap: '1rem', background: '#18181c', border: '1px solid #2a2a30', borderRadius: 14, padding: '1rem 1.25rem', textDecoration: 'none', color: '#f0f0f0', transition: 'border-color .15s' },
    navIcon: { fontSize: '1.4rem', width: 40, height: 40, background: '#0f0f11', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    navInfo: { flex: 1 },
    navTitle: { fontSize: '.9rem', fontWeight: 600, marginBottom: '.15rem' },
    navDesc: { fontSize: '.68rem', color: '#6b6b78', fontFamily: 'monospace' },
    navArrow: { color: '#2a2a30', fontSize: '1rem' },
    alerta: { background: '#2e1a1a', border: '1px solid #502a2a', borderRadius: 10, padding: '.6rem 1rem', marginBottom: '1rem', fontSize: '.72rem', color: '#f87171', fontFamily: 'monospace' },
    sectionTitle: { fontSize: '.6rem', letterSpacing: '.12em', textTransform: 'uppercase' as const, color: '#6b6b78', fontFamily: 'monospace', marginBottom: '.75rem', marginTop: '1.25rem' },
  }

  return (
    <div style={s.wrap}>
      <div style={s.maxW}>
        <div style={s.logo}>
          <h1 style={s.h1}>Sistema de <span style={s.accent}>Vendas</span></h1>
          <p style={s.sub}>// Lucas Machado · {mes} {new Date().getFullYear()}</p>
        </div>

        <div style={s.kpis}>
          <div style={s.kpi}>
            <div style={s.kpiLabel}>Faturamento</div>
            <div style={{ ...s.kpiVal, color: '#e8ff47' }}>{fmt(fat)}</div>
            <div style={s.kpiSub}>{mes}</div>
          </div>
          <div style={s.kpi}>
            <div style={s.kpiLabel}>Vendas</div>
            <div style={{ ...s.kpiVal, color: '#47c4ff' }}>{vendas}</div>
            <div style={s.kpiSub}>no mês</div>
          </div>
          <div style={s.kpi}>
            <div style={s.kpiLabel}>Filamentos</div>
            <div style={{ ...s.kpiVal, color: '#4ade80' }}>{filamentos}</div>
            <div style={s.kpiSub}>em estoque</div>
          </div>
          <div style={s.kpi}>
            <div style={s.kpiLabel}>Estoque baixo</div>
            <div style={{ ...s.kpiVal, color: baixoEstoque > 0 ? '#f87171' : '#4ade80' }}>{baixoEstoque}</div>
            <div style={s.kpiSub}>abaixo de 200g</div>
          </div>
        </div>

        {baixoEstoque > 0 && (
          <div style={s.alerta}>
            ⚠️ {baixoEstoque} filamento{baixoEstoque > 1 ? 's' : ''} com estoque baixo — verifique!
          </div>
        )}

        <div style={s.sectionTitle}>Módulos</div>
        <div style={s.nav}>
          <Link href="/vendas" style={s.navItem}>
            <div style={s.navIcon}>💰</div>
            <div style={s.navInfo}>
              <div style={s.navTitle}>Gestão de Vendas</div>
              <div style={s.navDesc}>Registrar e visualizar vendas do mês</div>
            </div>
            <span style={s.navArrow}>›</span>
          </Link>

          <Link href="/dashboard" style={s.navItem}>
            <div style={s.navIcon}>📊</div>
            <div style={s.navInfo}>
              <div style={s.navTitle}>Dashboard</div>
              <div style={s.navDesc}>Relatório mensal · lucro · categorias</div>
            </div>
            <span style={s.navArrow}>›</span>
          </Link>

          <Link href="/filamentos" style={s.navItem}>
            <div style={s.navIcon}>🧵</div>
            <div style={s.navInfo}>
              <div style={s.navTitle}>Estoque de Filamentos</div>
              <div style={s.navDesc}>Material · cor · peso restante · alerta</div>
            </div>
            <span style={s.navArrow}>›</span>
          </Link>

          <Link href="/calculadora" style={s.navItem}>
            <div style={s.navIcon}>🧮</div>
            <div style={s.navInfo}>
              <div style={s.navTitle}>Calculadora 3D</div>
              <div style={s.navDesc}>Precificar peças com custo real</div>
            </div>
            <span style={s.navArrow}>›</span>
          </Link>
        </div>

        <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '.65rem', color: '#2a2a30', fontFamily: 'monospace' }}>
          @sistemalucas_bot · Telegram
        </div>
      </div>
    </div>
  )
}