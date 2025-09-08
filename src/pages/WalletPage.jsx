import React, { useState } from 'react'
import { useStore } from '../store'

function qrUrl(data){
  const d = encodeURIComponent(data)
  // stabilen, brez CORS/CSP težav
  return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=1&data=${d}`
}

export default function WalletPage(){
  const wallet = useStore(s=>s.wallet)
  const [openId, setOpenId] = useState(null)
  const current = wallet.find(w => w.id === openId)

  return (
    <div className="page-wrap">
      <div className="header"><div className="title">DropX Wallet</div></div>

      {wallet.length === 0 && (
        <div className="drop-card" style={{textAlign:'center',color:'var(--muted)'}}>
          No rewards yet. Claim a drop to see it here.
        </div>
      )}

      {wallet.map(w=>(
        <div key={w.code} className="drop-card">
          <div className="row">
            <div style={{fontWeight:900}}>{w.reward} — {w.title}</div>
            <span className="badge ok">CONFIRMED</span>
          </div>
          <div style={{marginTop:8, color:'var(--muted)'}}>Code: <b>{w.code}</b></div>
          <div style={{display:'flex', gap:10, marginTop:10}}>
            <button className="btn neon" onClick={()=>setOpenId(w.id)}>Show QR code</button>
          </div>
        </div>
      ))}

      {current && (
        <div className="modal-backdrop" onClick={()=>setOpenId(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="row">
              <div className="title">Your Reward Code</div>
              <button className="btn ghost" onClick={()=>setOpenId(null)}>✕</button>
            </div>
            <div style={{textAlign:'center',marginTop:6,fontWeight:800}}>{current.title}</div>
            <div style={{display:'grid',placeItems:'center',marginTop:10}}>
              <img src={qrUrl(current.code)} alt="QR code"
                   width="220" height="220"
                   style={{borderRadius:12,background:'#1b2530',border:'1px solid var(--stroke)'}} />
            </div>
            <div className="drop-card" style={{margin:'14px 0 0', textAlign:'center', background:'var(--card2)'}}>
              <div>Code:</div>
              <div style={{fontWeight:900,letterSpacing:1}}>{current.code}</div>
            </div>
          </div>
        </div>
      )}

      <div style={{height:84}}/>
    </div>
  )
}
