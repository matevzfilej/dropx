import React, { useState } from 'react'
import { useStore } from '../store'
import QRCode from 'qrcode.react'

export default function WalletPage(){
  const wallet = useStore(s=>s.wallet)
  const [tab, setTab] = useState('Active') // demo

  const list = wallet // (filteraj po tab-u po želji)

  return (
    <div className="screen">
      <div className="h2">DropX Wallet</div>

      <div className="tabbar">
        {['Active','Used','All'].map(t=>(
          <div key={t} className={`tab ${tab===t?'active':''}`} onClick={()=>setTab(t)}>{t}</div>
        ))}
      </div>

      {list.length===0 && <div className="card" style={{color:'#9FB3C8'}}>No rewards yet.</div>}

      {list.map(w=>(
        <div key={w.code} className="card" style={{display:'grid', gap:'8px'}}>
          <div className="row">
            <div style={{fontWeight:900}}>{w.title}</div>
            <span className="badge ok">CONFIRMED</span>
          </div>
          <div>Code: <span style={{color:'var(--accent)'}}>{w.code}</span></div>
          <div style={{justifySelf:'center'}}><QRCode value={w.code} size={140}/></div>
          <div style={{color:'#9FB3C8', fontSize:12}}>Added: {new Date(w.ts).toLocaleString()}</div>
        </div>
      ))}
    </div>
  )
}
