import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import MapPage from './pages/MapPage.jsx'
import DropsPage from './pages/DropsPage.jsx'
import WalletPage from './pages/WalletPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import DropDetails from './pages/DropDetails.jsx'

function Layout(){
  return (
    <div style={{flex:1, display:'flex', flexDirection:'column'}}>
      <div style={{flex:1}}>
        <Routes>
          <Route path="/" element={<MapPage/>} />
          <Route path="/drops" element={<DropsPage/>} />
          <Route path="/wallet" element={<WalletPage/>} />
          <Route path="/profile" element={<ProfilePage/>} />
          <Route path="/drop/:id" element={<DropDetails/>} />
        </Routes>
      </div>
      <nav className="nav">
        <NavLink to="/" end>Map</NavLink>
        <NavLink to="/drops">Drops</NavLink>
        <NavLink to="/wallet">Wallet</NavLink>
        <NavLink to="/profile">Profile</NavLink>
      </nav>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Layout/>
    </BrowserRouter>
  </React.StrictMode>
)
