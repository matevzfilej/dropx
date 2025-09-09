import { create } from 'zustand'

// Haversine (m)
export function haversine(lat1, lon1, lat2, lon2) {
  const toRad = d => d * Math.PI / 180
  const R = 6371000
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLon/2)**2
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)))
}

// ZAČETNI DROPS (Ruše + Maribor + Ljubljana + global)
const initialDrops = [
  // RUŠE
  { id:'mercator', title:'Mercator Center Ruše -10%', type:'PARTNER', color:'green',
    lat:46.53909994987996, lng:15.511317510902673, radius:120, cap:1000, claims:7,
    subtitle:'Falska cesta 18', reward:'10% popusta na celotni nakup' },
  { id:'peckah', title:'Free Isotonic', type:'PARTNER', color:'green',
    lat:46.52294326740665, lng:15.540875155081894, radius:120, cap:1000, claims:7,
    subtitle:'Dom na Pečkah', reward:'1 brezplačni Isotonic' },

  // AMBIENT “anywhere”
  { id:'mystery', title:'Mystery Orb', type:'AMBIENT', color:'pink',
    lat:null, lng:null, radius:null, cap:1000, claims:7,
    subtitle:'Ambient reward appears…', reward:'3 RION' },

  // GLOBAL CRYPTO “anywhere”
  { id:'starter', title:'3 RION — Starter Pack', type:'CRYPTO', color:'yellow',
    lat:null, lng:null, radius:null, cap:1000, claims:7,
    subtitle:'Crypto', reward:'3 RION' },

  // MARIBOR
  { id:'mb-coffee', title:'Maribor Special', type:'PARTNER', color:'green',
    lat:46.557, lng:15.645, radius:150, cap:1000, claims:7,
    subtitle:'Glavni trg', reward:'Kava -50%' },

  // LJUBLJANA
  { id:'btc-bonus', title:'BTC City Bonus', type:'PARTNER', color:'green',
    lat:46.065, lng:14.542, radius:200, cap:1000, claims:7,
    subtitle:'Ljubljana', reward:'Popust 5€' },

{
  id: 'gf-premium',
  title: 'G.F. premium RION drop',
  type: 'CRYPTO',           // barva: rumena (v UI je mapirano na 'crypto')
  color: 'yellow',
  lat: 46.07109308048376,
  lng: 14.480521283899263,
  radius: 120,              // zahtevaj približanje (po potrebi spremeni na null za “anywhere”)
  cap: 1000,
  claims: 0,
  subtitle: 'Ljubljana',
  reward: '10 $RION'
},


]

export const useStore = create((set, get) => ({
  drops: initialDrops,

  // Wallet + stats
  wallet: [],
  stats: { dropsClaimed: 0, rionEarned: 5, rewardsUsed: 0 },

  addToWallet: (drop) => set((s) => {
    const code = `DX-${Math.random().toString(36).slice(2,7).toUpperCase()}`
    const entry = { id:`${drop.id}-${Date.now()}`, dropId:drop.id, title:drop.title, reward:drop.reward||'', code }
    const addRion = /(\d+)\s*RION/i.exec(drop.reward || '')
    const rion = addRion ? parseInt(addRion[1],10) : 0
    return {
      wallet: [entry, ...s.wallet],
      stats: { ...s.stats, dropsClaimed: s.stats.dropsClaimed + 1, rionEarned: s.stats.rionEarned + rion }
    }
  }),

  // fokus za mapo
  focusTargetId: null,
  setFocus: (id) => set({ focusTargetId: id }),
  clearFocus: () => set({ focusTargetId: null }),
}))
