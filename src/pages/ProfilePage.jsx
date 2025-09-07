import React from 'react'
import { useStore } from '../store'

export default function ProfilePage(){
  const { claimed, rion, used } = useStore.getState().stats()
  return (
    <div className="screen">
      <div className="h2">Profile</div>

      <div className="card" style={{display:'grid', gap:6}}>
        <div style={{fontWeight:800}}>matevz@realdrophunt.com</div>
        <div style={{color:'#9FB3C8'}}>Allow DropX to access your location for nearby drops</div>
      </div>

      <div className="card" style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12, textAlign:'center'}}>
        <div><div style={{fontWeight:900, fontSize:18}}>{claimed}</div><div style={{color:'#9FB3C8'}}>Drops Claimed</div></div>
        <div><div style={{fontWeight:900, fontSize:18}}>{rion}</div><div style={{color:'#9FB3C8'}}>RION Earned</div></div>
        <div><div style={{fontWeight:900, fontSize:18}}>{used}</div><div style={{color:'#9FB3C8'}}>Rewards Used</div></div>
      </div>

      <button className="btn grad">Logout</button>
    </div>
  )
}
