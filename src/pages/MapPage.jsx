import React, { useEffect, useMemo, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { useStore } from '../store'
import { useNavigate, useLocation } from 'react-router-dom'
import L from 'leaflet'

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

  const neonIcon = useMemo(() => (color='default') => L.divIcon({
    className: 'neon-pin ' + (color==='purple'?'purple': color==='green'?'green':''),
    html:'<div></div>', iconSize:[14,14], iconAnchor:[7,7]
  }),[])
  const myIcon = useMemo(() => L.divIcon({
    className:'my-pos', html:'<div></div>', iconSize:[14,14], iconAnchor:[7,7]
  }),[])

  // Lokacija + prvi auto center
  useEffect(()=>{
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      pos => {
        const p = [pos.coords.latitude, pos.coords.longitude]
        setMyPos(p)
        if (mapRef.current) mapRef.current.flyTo(p, 14, { animate:true })
      },
      ()=>{}, { enableHighAccuracy:true, maximumAge:15000 }
    )
  },[])

  // Podpora za ?focus=<id>
  useEffect(()=>{
    const p = new URLSearchParams(location.search)
    const focus = p.get('focus')
    if (focus && mapRef.current){
      const d = drops.find(x=>x.id===focus)
      if (d){
        const lat = d.type==='AMBIENT' && myPos ? myPos[0] : d.lat
        const lng = d.type==='AMBIENT' && myPos ? myPos[1] : d.lng
        if (lat!=null && lng!=null){
          mapRef.current.flyTo([lat,lng], 15, {animate:true})
          setExpanded(true)
        }
      }
    }
  },[location.search, drops, myPos])

  const centerMe = () => {
    if (myPos && mapRef.current) mapRef.current.flyTo(myPos, 15, {animate:true})
    else alert('Location unavailable yet')
  }

  const openDetails = (d)=> navigate(`/drop/${d.id}`)

  // AMBIENT marker = moja lokacija
  const getMarkerLatLng = (d) => (d.type==='AMBIENT' ? (myPos||null) : [d.lat, d.lng])

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
              const ll = getMarkerLatLng(d)
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

          {/* TOP-RIGHT FABs (nad mapo) */}
          <div className="map-top-right">
            <button className="fab-round" title="Legend" onClick={()=>setShowLegend(v=>!v)}>ℹ</button>
            <button className="fab-round" title="Center me" onClick={centerMe}>◎</button>
          </div>

          {/* Bottom-right pill */}
          <div className="map-controls" style={{position:'absolute',right:8,bottom:8,display:'flex',gap:8,zIndex:1000}}>
            <button className="pill" onClick={()=>setExpanded(v=>!v)}>
              {expanded?'Collapse Map':'Expand Map'}
            </button>
          </div>

          {/* Legend */}
          {showLegend && (
            <div style={{position:'absolute',right:8,top:56,background:'rgba(16,24,33,.92)',
                         border:'1px solid #1b2b3a',borderRadius:12,padding:'8px 10px',color:'#9FB3C8',zIndex:1000}}>
              Legend:&nbsp;
              <span style={{color:'#2DEE6F'}}>●</span> Partner&nbsp;•&nbsp;
              <span style={{color:'#8F6AFF'}}>●</span> Sponsored&nbsp;•&nbsp;
              <span style={{color:'#3AF2E2'}}>●</span> Ambient&nbsp;•&nbsp;
              <span style={{color:'#3AF2E2'}}>◎</span> You
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
                📍 radius {d.radius ?? '∞'} m • {d.reward || ''}
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
