import React from 'react'
import { useStore } from '../store'
import { useNavigate } from 'react-router-dom'

export default function DropsPage(){
  const drops = useStore(s=>s.drops)
  const navigate = useNavigate()

  const showOnMap = (id)=> { navigate(`/?focus=${id}#map`) }

  return (
    <div className="screen">
      <div className="h2">All Drops</div>

      <div className="tabbar">
        <div className="tab active">All</div>
        <div className="tab">Crypto</div>
        <div className="tab">Partner</div>
        <div className="tab">Ambient</div>
      </div>

      {drops.map(d=>(
        <div key={d.id} className="card">
          <div className="row">
            <div>
              <div style={{fontWeight:900}}>{d.title}</div>
              <div style={{color:'#9FB3C8', fontSize:12}}>
                {d.subtitle} • radius {d.radius ?? '∞'} m
              </div>
            </div>
            <div style={{display:'flex', gap:8}}>
              <button className="btn ghost" onClick={()=>navigate(`/drop/${d.id}`)}>View</button>
              <button className="btn ghost" onClick={()=>showOnMap(d.id)}>Show on map</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
