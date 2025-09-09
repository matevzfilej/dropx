import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useStore, haversine } from '../store'

export default function DropDetails(){
  const { id } = useParams()
  const navigate = useNavigate()
  const drop = useStore(s=>s.drops.find(d=>d.id===id))
  const addToWallet = useStore(s=>s.addToWallet)
  const setFocus = useStore(s=>s.setFocus)

  const [myPos, setMyPos] = useState(null)
  const [dist, setDist] = useState(null)

  // enkratno branje lokacije
  useEffect(()=>{
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      pos => setMyPos([pos.coords.latitude,pos.coords.longitude]),
      ()=>{},
      { enableHighAccuracy:true, timeout:10000 }
    )
  }, [])

  // izračun razdalje (če ima drop veljavne koordinate)
  useEffect(()=>{
    if (!drop || !myPos) return
    const hasLL = Number.isFinite(drop.lat) && Number.isFinite(drop.lng)
    if (!hasLL) { setDist(null); return }
    setDist(haversine(myPos[0], myPos[1], drop.lat, drop.lng))
  }, [drop, myPos])

  if (!drop) return <div className="page-wrap">Not found</div>

  // 🔧 NOVA LOGIKA:
  // "Anywhere" samo, če radius NI določen (== null). Ne glede na tip (CRYPTO/AMBIENT/…)
  const isAnywhere = drop.radius == null
  const canClaim = isAnywhere || (dist != null && drop.radius != null && dist <= drop.radius)

  function claim(){
    if (!canClaim){
      toast(`Too far – get within ${drop.radius} m to claim`)
      return
    }
    addToWallet(drop)
    toast('Drop Claimed')
    setTimeout(()=>navigate('/'), 600)
  }

  function showOnMap(){
    setFocus(drop.id)
    navigate('/')
  }

  return (
    <div className="page-wrap" style={{padding:'16px'}}>
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
          <div className="row">
            <div>Distance:</div>
            <div>{isAnywhere ? '—' : (dist!=null ? `${dist} m` : 'locating…')}</div>
          </div>
          <div className="row"><div>Radius:</div><div>{drop.radius ?? '∞'} m</div></div>
          <div className="row"><div>Claims:</div><div>{drop.claims}/{drop.cap}</div></div>
        </div>

        <div style={{display:'flex', gap:10, marginTop:14, flexWrap:'wrap'}}>
          <button className="btn neon" onClick={claim} disabled={!canClaim} style={{opacity:canClaim?1:.6}}>
            {canClaim ? 'Claim' : 'Too far'}
          </button>
          <button className="btn ghost" onClick={showOnMap}>Show on map</button>
        </div>

        {!isAnywhere && !canClaim && dist!=null &&
          <div style={{color:'var(--yellow)', fontSize:12, marginTop:10}}>
            Too far – get within {drop.radius} m to claim
          </div>
        }
      </div>
    </div>
  )
}

function toast(msg){
  const t=document.createElement('div'); t.className='toast'; t.textContent=msg;
  document.body.appendChild(t); setTimeout(()=>t.remove(),2000)
}
