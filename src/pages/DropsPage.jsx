import React from 'react'
import { useStore } from '../store'
import { useNavigate } from 'react-router-dom'

export default function DropsPage(){
  const drops = useStore(s=>s.drops)
  const navigate = useNavigate()
  const showOnMap = (id)=> navigate(`/?focus=${id}#map`)

  return (
    <div className="page-wrap">
      <div className="header"><div className="title">All Drops</div></div>

      {drops.map(d=>(
        <div key={d.id} className="drop-card">
          <div className="row">
            <div style={{flex:1}}>
              <div className="row">
                <div style={{fontWeight:900}}>{d.title}</div>
                <span className="badge ok">ACTIVE</span>
              </div>
              <div style={{display:'flex',gap:8,marginTop:6}}>
                <span className={`badge ${d.type.toLowerCase()}`}>{d.type}</span>
                <span className="badge">{d.subtitle}</span>
              </div>
              <div style={{color:'#9FB3C8',fontSize:12,marginTop:8}}>
                📍 radius {d.radius ?? '∞'} m • {d.reward || ''}
              </div>
            </div>
            <div style={{display:'flex', gap:8}}>
              <button className="btn neon" onClick={()=>navigate(`/drop/${d.id}`)}>View</button>
              <button className="btn ghost" onClick={()=>showOnMap(d.id)}>Show on map</button>
            </div>
          </div>
        </div>
      ))}
      <div style={{height:84}}/>
    </div>
  )
}
