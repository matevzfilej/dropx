export function distanceMeters(aLat, aLng, bLat, bLng) {
  const toRad = d => (d * Math.PI) / 180
  const R = 6371000
  const dLat = toRad(bLat - aLat)
  const dLng = toRad(bLng - aLng)
  const lat1 = toRad(aLat)
  const lat2 = toRad(bLat)
  const h = Math.sin(dLat/2)**2 + Math.cos(lat1)*Math.cos(lat2)*Math.sin(dLng/2)**2
  return 2 * R * Math.asin(Math.sqrt(h))
}
