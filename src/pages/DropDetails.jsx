import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useStore } from '../store'
import { distanceMeters } from '../utils/geo'

export default function DropDetails(){
  const { id } = useParams()
  const navigate = useNavigate()
  const drop = useStore(s=> s.drops.find(d=>d.id===id))
  const addToWallet = useStore(s=>s.addToWallet)

  const [myPos, setMyPos] = useState(null)
  const [dist, setDist] = useState(null)

  useEffect(()=>{
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(pos=>{
      setMyPos([pos.coords.latitude, pos.coords.longitude])
    })
  }, [])

  useEffect(()=>{
    if (drop && myPos){
      setDist(Math.round(distanceMeters(myPos[0], myPos[1], drop.lat, drop.lng)))
    }
  }, [drop, myPos])

  if (!drop){
    return (
      <div className="screen">
        <button className="btn ghost" onClick={()=>navigate(-1)}>← Back</button>
        <div className="card">Drop not found.</div>
      </div>
    )
  }

  // Claim pravilo: AMBIENT = vedno dovoljen; drugače znotraj radiusa
  let claimable = false
  if (drop.type === 'AMBIENT') claimable = true
  else claimable = dist !== null && dist <= (drop.radius ?? 500)

  return (
    <div className="screen" style={{maxWidth:720, margin:'0 auto'}}>
      <div className="row" style={{marginBottom:12}}>
        <button className="btn ghost" onClick={()=>navigate(-1)}>←</button>
        <div style={{fontWeight:900, fontSize:16}}>Drop Details</div>
        <div style={{width:44}}/>
      </div>

      <div className="card" style={{display:'grid', gap:10}}>
        <div className="row">
          <div style={{fontWeight:900, fontSize:18}}>{drop.title}</div>
          <span className="badge ok">ACTIVE</span>
        </div>

        <div style={{display:'flex', gap:8}}>
          <span className="badge">{drop.type}</span>
          <span className="badge">{drop.subtitle}</span>
        </div>

        <div style={{background:'#0F1720', border:'1px solid #1b2b3a', borderRadius:12, padding:12}}>
          <div style={{color:'#9FB3C8', fontSize:12}}>Reward Amount:</div>
          <div style={{fontWeight:900, color:'var(--accent)', fontSize:18}}>3 RION</div>
        </div>

        <div style={{display:'grid', gap:8, fontSize:12}}>
          <div className="row"><div>Distance:</div><div>{dist!=null ? `${dist} m` : 'locating...'}</div></div>
          <div className="row"><div>Time Left:</div><div>19h</div></div>
          <div className="row"><div>Claims:</div><div>1/1000</div></div>
          <div className="row"><div>Radius:</div><div>{drop.radius ?? '∞'} m</div></div>
        </div>

        <button
          className="btn grad"
          disabled={!claimable}
          style={{opacity: claimable? 1 : .5, cursor: claimable? 'pointer':'not-allowed'}}
          onClick={()=>{ if (claimable){ addToWallet(drop); alert('Claim successful'); } }}
        >
          CLAIM DROP
        </button>

        <button className="btn ghost" onClick={()=>navigate(`/?focus=${drop.id}#map`)}>SHOW ON MAP</button>

        {drop.type !== 'AMBIENT' && !claimable && dist!=null &&
          <div style={{color:'var(--warn)', fontSize:12, textAlign:'center'}}>
            Predaleč – približaj se &lt;= {drop.radius} m za claim
          </div>
        }
      </div>
    </div>
  )
}
