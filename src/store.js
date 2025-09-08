import { create } from 'zustand'

export const useStore = create((set, get) => ({
  drops: [
    { id:'mc-ruse', title:'Mercator Center Ruše -10%', subtitle:'Falska cesta 18',
      lat:46.53909994987996, lng:15.511317510902673, status:'ACTIVE',
      type:'PARTNER', reward:'10% popusta na celotni nakup', radius:120, color:'green' },

    { id:'pecke-iso', title:'Free Isotonic', subtitle:'Dom na Pečkah',
      lat:46.52294326740665, lng:15.540875155081894, status:'ACTIVE',
      type:'PARTNER', reward:'1 brezplačni Isotonic', radius:120, color:'purple' },

    // AMBIENT: marker = na tvoji lokaciji, claim anywhere (radius null)
    { id:'ambient-anywhere', title:'Mystery Orb', subtitle:'Ambient reward appears…',
      lat:null, lng:null, status:'ACTIVE', type:'AMBIENT', reward:'3 RION', radius:null, color:'default' },

    // CRYPTO: tudi brez radija (dosegljivo vsem)
    { id:'rion-starter', title:'3 RION — Starter Pack', subtitle:'Crypto',
      lat:46.0569, lng:14.5058, status:'ACTIVE', type:'CRYPTO', reward:'3 RION', radius:null, color:'default' },

    { id:'mb-center', title:'Maribor Special', subtitle:'Glavni trg',
      lat:46.5547, lng:15.6459, status:'ACTIVE', type:'PARTNER', reward:'Kava -50%', radius:150, color:'green' },

    { id:'lj-btc', title:'BTC City Bonus', subtitle:'Ljubljana',
      lat:46.0718, lng:14.5410, status:'ACTIVE', type:'PARTNER', reward:'Popust 5€', radius:200, color:'green' },
  ],

  wallet: [],
  addToWallet: (drop) => set(s => ({
    wallet: [...s.wallet, {
      ...drop,
      code: 'DX-' + Math.random().toString(36).substring(2,8).toUpperCase(),
      ts: Date.now()
    }]
  })),

  stats: () => {
    const w = get().wallet
    return { claimed: w.length, rion: 5, used: 0 }
  }
}))
