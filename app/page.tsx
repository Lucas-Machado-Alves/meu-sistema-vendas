import Link from 'next/link'

export default function Home() {
  return (
    <main style={{background:'#0f0f11',minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',fontFamily:'sans-serif',color:'#f0f0f0'}}>
      <h1 style={{fontSize:'2rem',fontWeight:700,marginBottom:'0.5rem'}}>
        Sistema de <span style={{color:'#e8ff47'}}>Vendas</span>
      </h1>
      <p style={{color:'#6b6b78',marginBottom:'2rem',fontSize:'0.9rem'}}>Lucas Machado — gestão completa</p>
      <div style={{display:'flex',gap:'1rem',flexWrap:'wrap',justifyContent:'center'}}>
        <Link href="/vendas" style={{background:'#e8ff47',color:'#0f0f11',padding:'0.75rem 1.5rem',borderRadius:'10px',fontWeight:700,textDecoration:'none'}}>Gestão de Vendas</Link>
        <Link href="/dashboard" style={{background:'#18181c',color:'#f0f0f0',padding:'0.75rem 1.5rem',borderRadius:'10px',fontWeight:700,textDecoration:'none',border:'1px solid #2a2a30'}}>Dashboard</Link>
        <Link href="/calculadora" style={{background:'#18181c',color:'#f0f0f0',padding:'0.75rem 1.5rem',borderRadius:'10px',fontWeight:700,textDecoration:'none',border:'1px solid #2a2a30'}}>Calculadora 3D</Link>
      </div>
    </main>
  )
}