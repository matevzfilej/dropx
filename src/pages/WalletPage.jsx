import React, { useState } from 'react'
import { useStore } from '../store'

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

      {/* MODAL */}
      {current && (
        <div className="modal-backdrop" onClick={()=>setOpenId(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="row">
              <div className="title">Your Reward Code</div>
              <button className="btn ghost" onClick={()=>setOpenId(null)}>✕</button>
            </div>
            <div style={{textAlign:'center',marginTop:6,fontWeight:800}}>{current.title}</div>
            <div style={{height:12}}></div>
            <div style={{height:180, borderRadius:14, background:'#1b2530', border:'1px solid var(--stroke)', marginTop:10, display:'grid',placeItems:'center', color:'var(--muted)'}}>
              QR PREVIEW
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
