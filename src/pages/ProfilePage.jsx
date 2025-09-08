import React from 'react'
import { useStore } from '../store'

export default function ProfilePage(){
  const { claimed, rion, used } = useStore.getState().stats()
  return (
    <div className="page-wrap">
      <div className="header"><div className="title">Profile</div></div>

      <div className="drop-card" style={{display:'grid', gap:6}}>
        <div style={{fontWeight:900, fontSize:18}}>Matevz</div>
        <div style={{color:'var(--muted)'}}>matevz@realdrophunt.com</div>
      </div>

      <div className="drop-card" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,textAlign:'center'}}>
        <div><div style={{fontWeight:900,fontSize:18}}>{claimed}</div><div style={{color:'var(--muted)'}}>Drops Claimed</div></div>
        <div><div style={{fontWeight:900,fontSize:18}}>{rion}</div><div style={{color:'var(--muted)'}}>RION Earned</div></div>
        <div><div style={{fontWeight:900,fontSize:18}}>{used}</div><div style={{color:'var(--muted)'}}>Rewards Used</div></div>
      </div>

      <div className="drop-card">
        <div className="row"><div>Location Services</div><div><span className="badge ok">ON</span></div></div>
      </div>

      <div style={{padding:'0 16px 100px'}}>
        <button className="btn neon" style={{width:'100%'}}>Logout</button>
      </div>
    </div>
  )
}
