import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useStore } from '../store'

export default function DropDetails(){
  const { id } = useParams()
  const navigate = useNavigate()
  const drop = useStore(s=>s.drops.find(d=>d.id===id))
  const addToWallet = useStore(s=>s.addToWallet)

  if (!drop) return <div className="screen">Not found</div>

  const claim = ()=>{
    if (drop.radius && drop.radius!==null){
      alert("Too far – get within 120 m to claim")
      return
    }
    addToWallet(drop)
    const toast=document.createElement('div')
    toast.className='toast'
    toast.innerText='Drop Claimed'
    document.body.appendChild(toast)
    setTimeout(()=>toast.remove(),2000)
  }

  const showOnMap = ()=>{
    navigate('/?focus='+drop.id)
  }

  return (
    <div className="screen">
      <button className="btn ghost" onClick={()=>navigate(-1)}>← Back</button>
      <h2>{drop.title}</h2>
      <div className={`badge ${drop.type.toLowerCase()}`}>{drop.type}</div>
      <p>{drop.reward}</p>
      <p>Location: {drop.subtitle}</p>
      <button className="btn neon" onClick={claim}>Claim</button>
      <button className="btn ghost" onClick={showOnMap}>Show on map</button>
    </div>
  )
}
