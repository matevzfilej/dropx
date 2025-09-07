import React, { useEffect, useMemo, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { useStore } from '../store'
import { useNavigate, useLocation } from 'react-router-dom'
import L from 'leaflet'

// Dark tiles (brez API ključa)
const TILE_DARK = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
const ATTR = '&copy; OpenStreetMap contributors &copy; CARTO'

export default function MapPage() {
  const drops = useStore(s => s.drops)
  const navigate = useNavigate()
  const location = useLocation()

  const [expanded, setExpanded] = useState(false)
  const [showLegend, setShowLegend] = useState(false)
  const [myPos, setMyPos] = useState(null)
  const mapRef = useRef(null)

  // Neon CSS markerji
  const neonIcon = useMemo(() => (color='default') => L.divIcon({
    className: 'neon-pin ' + (color==='purple'?'purple': color==='green'?'green':''),
    html:'<div></div>', iconSize:[14,14], iconAnchor:[7,7]
  }),[])
  const myIcon = useMemo(() => L.divIcon({
    className:'my-pos', html:'<div></div>', iconSize:[14,14], iconAnchor:[7,7]
  }),[])

  useEffect(()=>{ // moja lokacija
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      pos => setMyPos([pos.coords.latitude, pos.coords.longitude]),
      ()=>{}, { enableHighAccuracy:true, maximumAge:15000 }
    )
  },[])

  useEffect(()=>{ // podpora za ?focus=<id>
    const p = new URLSearchParams(location.search)
    const focus = p.get('focus')
    if (focus && mapRef.current){
      const d = drops.find(x=>x.id===focus)
      if (d){ mapRef.current.setView([d.lat,d.lng], 15, {animate:true}); setExpanded(true) }
    }
  },[location.search, drops])

  function centerMe(){
    if (myPos && mapRef.current) mapRef.current.setView(myPos, 15, {animate:true})
    else alert('Location unavailable yet')
  }
  const openDetails = (d)=> navigate(`/drop/${d.id}`)

  return (
    <div className={`page-wrap ${expanded ? 'map-expanded' : ''}`}>
      <div className="header">
        <div className="title">DropX Map</div>
        <div className="subtitle">Find rewards near you</div>
        <input className="search" placeholder="Search places, rewards, categories"/>
      </div>

      <div className="map-card">
        <div className="map-wrap" id="map">
          <MapContainer center={[46.54,15.51]} zoom={13} whenCreated={m=>mapRef.current=m}
                        style={{height:'100%', width:'100%'}}>
            <TileLayer url={TILE_DARK} attribution={ATTR}/>
            {drops.map(d=>(
              <Marker key={d.id} position={[d.lat,d.lng]} icon={neonIcon(d.color)}>
                <Popup>
                  <b>{d.title}</b><br/>
                  {d.subtitle}<br/>
                  {d.lat.toFixed(4)}, {d.lng.toFixed(4)}<br/>
                  <span style={{textDecoration:'underline',cursor:'pointer'}} onClick={()=>openDetails(d)}>View</span>
                </Popup>
              </Marker>
            ))}
            {myPos && <Marker position={myPos} icon={myIcon}><Popup>You are here</Popup></Marker>}
          </MapContainer>

          <div className="map-controls" style={{position:'absolute',right:8,bottom:8,display:'flex',gap:8}}>
            <button className="pill" onClick={()=>setShowLegend(v=>!v)}>{showLegend?'Hide legend':'Legend'}</button>
            <button className="pill" onClick={()=>setExpanded(v=>!v)}>{expanded?'Collapse Map':'Expand Map'}</button>
            <button className="pill" onClick={centerMe}>Center me</button>
          </div>

          {showLegend && (
            <div style={{position:'absolute',right:8,top:8,background:'rgba(16,24,33,.92)',
                         border:'1px solid #1b2b3a',borderRadius:12,padding:'8px 10px',color:'#9FB3C8'}}>
              Legend: <span style={{color:'#2DEE6F'}}>●</span> Partner •
              <span style={{color:'#8F6AFF'}}> ●</span> Sponsored •
              <span style={{color:'#3AF2E2'}}> ●</span> Ambient •
              <span style={{color:'#3AF2E2'}}> ◎</span> You
            </div>
          )}
        </div>
      </div>

      <div className="section-title">Nearby Drops</div>
      {drops.map(d=>(
        <div key={d.id} className="drop-card">
          <div className="row">
            <div style={{flex:1}}>
              <div className="row">
                <div style={{fontWeight:900}}>{d.title}</div>
                <span className="badge ok">ACTIVE</span>
              </div>
              <div style={{display:'flex',gap:8,marginTop:6}}>
                <span className="badge">{d.type}</span>
                <span className="badge">{d.subtitle}</span>
              </div>
              <div style={{color:'#9FB3C8',fontSize:12,marginTop:8}}>
                📍 radius {d.radius ?? '∞'} m
              </div>
            </div>
            <button className="btn ghost" onClick={()=>openDetails(d)}>View</button>
          </div>
        </div>
      ))}
      <div style={{height:8}}/>
    </div>
  )
}
