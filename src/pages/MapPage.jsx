import React, { useEffect, useMemo, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { useStore } from '../store'
import { useNavigate, useLocation } from 'react-router-dom'
import L from 'leaflet'

const TILE_DARK = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
const ATTR = '&copy; OpenStreetMap contributors &copy; CARTO'

const ambientOffset = (pos) => pos ? [pos[0] + 0.0006, pos[1] + 0.0006] : null

export default function MapPage() {
  const drops = useStore(s => s.drops)
  const navigate = useNavigate()
  const location = useLocation()

  const [expanded, setExpanded] = useState(false)
  const [showLegend, setShowLegend] = useState(false)
  const [myPos, setMyPos] = useState(null)
  const mapRef = useRef(null)

  const neonIcon = useMemo(() => (color='default') => L.divIcon({
    className: 'neon-pin ' + (color==='purple'?'purple': color==='green'?'green': color==='pink'?'pink': color==='yellow'?'yellow':''),
    html:'<div></div>', iconSize:[14,14], iconAnchor:[7,7]
  }),[])
  const myIcon = useMemo(() => L.divIcon({
    className:'my-pos', html:'<div></div>', iconSize:[14,14], iconAnchor:[7,7]
  }),[])

  useEffect(()=>{
    if (!navigator.geolocation) return
    const id = navigator.geolocation.watchPosition(
      pos => setMyPos([pos.coords.latitude, pos.coords.longitude]),
      ()=>{}, { enableHighAccuracy:true, maximumAge:5000 }
    )
    return ()=> navigator.geolocation.clearWatch(id)
  },[])

  useEffect(()=>{
    if (!mapRef.current) return
    setTimeout(()=> mapRef.current.invalidateSize(), 220)
  }, [expanded])

  // Show on map (?focus=id)
  useEffect(()=>{
    const p = new URLSearchParams(location.search)
    const focus = p.get('focus')
    if (focus && mapRef.current){
      const d = drops.find(x=>x.id===focus)
      if (!d) return
      const ll = d.type==='AMBIENT' ? ambientOffset(myPos) : [d.lat, d.lng]
      if (ll && ll[0]!=null){
        mapRef.current.flyTo(ll, 16, {animate:true})
        setExpanded(true)
      }
    }
  },[location.search, drops, myPos])

  function centerMe(){
    if (myPos && mapRef.current) { mapRef.current.flyTo(myPos, 15, {animate:true}); return }
    if (navigator.geolocation){
      navigator.geolocation.getCurrentPosition(
        pos => { const p=[pos.coords.latitude,pos.coords.longitude]; setMyPos(p); mapRef.current?.flyTo(p, 15, {animate:true}) },
        ()=> showToast('Enable location to use Center me'),
        { enableHighAccuracy:true, timeout:10000 }
      )
    }
  }

  const openDetails = (d)=> navigate(`/drop/${d.id}`)
  const latlngFor = (d) => d.type==='AMBIENT' ? ambientOffset(myPos) : [d.lat, d.lng]

  return (
    <div className={`page-wrap ${expanded ? 'map-expanded' : ''}`}>
      <div className="header">
        <div className="title">DropX Map</div>
        <div className="subtitle">Find rewards near you</div>
        <input className="search" placeholder="Search places, rewards, categories"/>
      </div>

      <div className="map-card">
        <div className="map-wrap" id="map">
          <MapContainer center={[46.54,15.51]} zoom={13}
                        whenCreated={m=>mapRef.current=m}
                        style={{height:'100%', width:'100%'}}>
            <TileLayer url={TILE_DARK} attribution={ATTR}/>

            {drops.map(d=>{
              const ll = latlngFor(d)
              if (!ll) return null
              return (
                <Marker key={d.id} position={ll} icon={neonIcon(d.color)}>
                  <Popup>
                    <b>{d.title}</b><br/>
                    {d.subtitle}<br/>
                    {ll[0].toFixed(4)}, {ll[1].toFixed(4)}<br/>
                    <span style={{textDecoration:'underline',cursor:'pointer'}}
                          onClick={()=>openDetails(d)}>View</span>
                  </Popup>
                </Marker>
              )
            })}
            {myPos && <Marker position={myPos} icon={myIcon}><Popup>You are here</Popup></Marker>}
          </MapContainer>

          {/* Top-right controls */}
          <div className="map-top-right">
            <button className="fab-round" title="Legend" onClick={()=>setShowLegend(v=>!v)}>i</button>
            <button className="fab-round" title="Center me" onClick={centerMe}>◎</button>
            <button className="pill-top" onClick={()=>setExpanded(v=>!v)}>{expanded?'Collapse':'Expand'}</button>
          </div>

          {showLegend && (
            <div style={{position:'absolute',right:8,top:62,background:'rgba(16,24,33,.92)',
                         border:'1px solid #1b2b3a',borderRadius:12,padding:'8px 10px',color:'#9FB3C8',zIndex:5000}}>
              Legend:&nbsp;
              <span className="badge partner">Partner</span>&nbsp;
              <span className="badge ambient">Ambient</span>&nbsp;
              <span className="badge crypto">Crypto</span>&nbsp;•&nbsp;
              <span style={{color:'var(--cyan)'}}>◎ You</span>
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
                <span className={`badge ${d.type.toLowerCase()}`}>{d.type}</span>
                <span className="badge">{d.subtitle}</span>
              </div>
              <div style={{color:'#9FB3C8',fontSize:12,marginTop:8}}>
                📍 radius {d.radius ?? '∞'} m • {d.reward || ''} • {d.claims}/{d.cap}
              </div>
            </div>
            <button className="btn neon" onClick={()=>openDetails(d)}>View</button>
          </div>
        </div>
      ))}
      <div style={{height:84}}/>
    </div>
  )
}

function showToast(msg){
  const t=document.createElement('div'); t.className='toast'; t.textContent=msg;
  document.body.appendChild(t); setTimeout(()=>t.remove(),2000)
}
