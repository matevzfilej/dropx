import { create } from 'zustand'

export const useStore = create((set, get) => ({
  // Vnesi PRAVE koordinate spodaj po potrebi
  drops: [
    { id:'1', title:'Panda Bar Bonus', subtitle:'@Panda Bar Ruše',
      lat:46.54020, lng:15.51410, status:'ACTIVE', type:'PARTNER', radius:120, color:'green' },
    { id:'2', title:'Free Drink at Dom na Pečkah', subtitle:'@Dom na Pečkah',
      lat:46.54160, lng:15.51280, status:'ACTIVE', type:'PARTNER', radius:120, color:'purple' },
    { id:'3', title:'Mystery Orb', subtitle:'Ambient reward appears…',
      lat:46.53820, lng:15.51730, status:'ACTIVE', type:'AMBIENT', radius:null, color:'default' }, // AMBIENT: radius = null (claim anywhere)
  ],
  wallet: [],
  addToWallet: (drop) => set(s => ({
    wallet: [...s.wallet, { ...drop, code:'DX-'+Math.random().toString(36).substring(2,8).toUpperCase(), ts: Date.now() }]
  })),
  stats: () => {
    const w = get().wallet
    return { claimed: w.length, rion: 5, used: 0 }
  }
}))
