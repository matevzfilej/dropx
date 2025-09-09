import React from 'react'
import { useStore } from '../store'

export default function ProfilePage(){
  const stats = useStore(s=>s.stats)

  return (
    <div className="page-wrap">
      <div className="header">
        <div className="title">Profile</div>
        <div className="subtitle">matevz@realdrophunt.com</div>
      </div>

      <div className="drop-card" style={{gap:12}}>
        <div className="row" style={{justifyContent:'space-between'}}>
          <div>
            <div style={{fontWeight:900}}>DropX</div>
            <div style={{color:'#7F93A8', fontSize:12}}>Powered by RealDropHunt</div>
          </div>
          <button className="btn neon">Logout</button>
        </div>

        <div className="row" style={{gap:12, marginTop:8}}>
          <div className="stat">
            <div className="stat-value">{stats.dropsClaimed}</div>
            <div className="stat-label">Drops Claimed</div>
          </div>
          <div className="stat">
            <div className="stat-value">{stats.rionEarned}</div>
            <div className="stat-label">RION Earned</div>
          </div>
          <div className="stat">
            <div className="stat-value">{stats.rewardsUsed}</div>
            <div className="stat-label">Rewards Used</div>
          </div>
        </div>
      </div>
    </div>
  )
}
