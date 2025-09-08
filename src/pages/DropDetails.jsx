import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useStore } from '../store'
import { distanceMeters } from '../utils/geo'

export default function DropDetails(){
  const { id } = useParams()
  const navigate = useNavigate()
  const drop = useStore(s=>s.drops.find(d=>d.id===id))
  const addToWallet = useStore(s=>s.addToWallet)

  const [myPos, setMyPos] = useState(null)
  const [dist, setDist] = useState(null)

  useEffect(()=>{
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      pos => setMyPos([pos.coords.latitude,pos.coords.longitude]),
      ()=>{},
      { enableHighAccuracy:true, timeout:10000 }
    )
  }, [])

  useEffect(()=>{
    if (drop && myPos){
      setDist(Math.round(distanceMeters(myPos[0], myPos[1], drop.lat ?? myPos[0], drop.lng ?? myPos[1])))
    }
  }, [drop, myPos])

  if (!drop) return <div className="screen">Not found</div>

  const isAlwaysClaimable = drop.type==='AMBIENT' || drop.radius===null || drop.type==='CRYPTO'
  const claimable = isAlwaysClaimable || (dist!=null && drop.radius!=null && dist<=drop.radius)

  function claim(){
    if (!claimable){
      showToast(`Too far – get within ${drop.radius} m to claim`)
      return
    }
    addToWallet(drop)
    showToast('Drop Claimed')
  }

  function showOnMap(){
    navigate(`/?focus=${drop.id}#map`)
  }

  return (
    <div className="screen" style={{maxWidth:720, margin:'0 auto'}}>
      <div className="row" style={{marginBottom:12}}>
        <button className="btn ghost" onClick={()=>navigate(-1)}>← Back</button>
        <div style={{fontWeight:900, fontSize:18}}>{drop.title}</div>
        <div style={{width:44}}/>
      </div>

      <div className="drop-card">
        <div className="row">
          <span className={`badge ${drop.type.toLowerCase()}`}>{drop.type}</span>
          <span className="badge ok">ACTIVE</span>
        </div>

        <div style={{marginTop:10, color:'#9FB3C8'}}>{drop.reward}</div>
        <div style={{marginTop:6, color:'#9FB3C8'}}>Location: {drop.subtitle}</div>

        <div style={{display:'grid', gap:8, fontSize:12, marginTop:12}}>
          <div className="row"><div>Distance:</div><div>{isAlwaysClaimable ? '—' : (dist!=null? `${dist} m` : 'locating…')}</div></div>
          <div className="row"><div>Radius:</div><div>{drop.radius ?? '∞'} m</div></div>
        </div>

        <div style={{display:'flex', gap:10, marginTop:14}}>
          <button className="btn neon" onClick={claim} disabled={!claimable} style={{opacity:claimable?1:.6}}>
            {claimable ? 'Claim' : 'Too far'}
          </button>
          <button className="btn ghost" onClick={showOnMap}>Show on map</button>
        </div>

        {!isAlwaysClaimable && !claimable && dist!=null &&
          <div style={{color:'#FFD166', fontSize:12, marginTop:10}}>
            Too far – get within {drop.radius} m to claim
          </div>
        }
      </div>
    </div>
  )
}

function showToast(msg){
  const t=document.createElement('div'); t.className='toast'; t.textContent=msg;
  document.body.appendChild(t); setTimeout(()=>t.remove(),2000)
}
