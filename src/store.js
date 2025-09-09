import { create } from 'zustand'

// helper: izračun distance (m) – če ga že imaš v utils, lahko pustiš svojega
export function haversine(lat1, lon1, lat2, lon2) {
  const toRad = d => d * Math.PI / 180
  const R = 6371000
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLon/2)**2
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)))
}

const initialDrops = [
  // Partner
  { id:'mercator',  title:'Mercator Center Ruše -10%', type:'PARTNER', color:'green',
    lat:46.53909994987996, lng:15.511317510902673, radius:120, cap:1000, claims:7,
    subtitle:'Falska cesta 18', reward:'10% popusta na celotni nakup' },
  // Partner
  { id:'peckah', title:'Free Isotonic', type:'PARTNER', color:'green',
    lat:46.52294326740665, lng:15.540875155081894, radius:120, cap:1000, claims:7,
    subtitle:'Dom na Pečkah', reward:'1 brezplačni Isotonic' },
  // Ambient – “anywhere” (prikažemo malo vstran od userja)
  { id:'mystery', title:'Mystery Orb', type:'AMBIENT', color:'pink',
    lat:null, lng:null, radius:null, cap:1000, claims:7,
    subtitle:'Ambient reward appears…', reward:'3 RION' },
  // Crypto global
  { id:'starter', title:'3 RION — Starter Pack', type:'CRYPTO', color:'yellow',
    lat:null, lng:null, radius:null, cap:1000, claims:7,
    subtitle:'Crypto', reward:'3 RION' },
]

export const useStore = create((set, get) => ({
  drops: initialDrops,

  // Wallet (preprost mock)
  wallet: [],
  addToWallet: (drop) => set(s => ({
    wallet: [
      ...s.wallet,
      { id: `${drop.id}-${Date.now()}`, title: drop.title, reward: drop.reward || '', code: `DX-${Math.random().toString(36).slice(2,7).toUpperCase()}` }
    ]
  })),

  // 🔥 Fokus cilj na mapi (namesto URL parametrov)
  focusTargetId: null,
  setFocus: (id) => set({ focusTargetId: id }),
  clearFocus: () => set({ focusTargetId: null }),
}))
