import React, { useState } from 'react'

const sports = [
  'soccer','basketball','tennis','cricket','volleyball','badminton','rugby','hockey','other'
]

export default function TeamForm({ backendUrl }) {
  const [form, setForm] = useState({
    owner_uid: 'demo-owner',
    name: '',
    sport: 'soccer',
    address: '',
    playersText: '',
    availability: { days: [], timeslot: 'any' },
    device_tokens: [],
  })
  const [status, setStatus] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('Saving...')

    // Use browser geolocation silently for the location field
    let coords
    try {
      coords = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
          () => resolve(null),
          { enableHighAccuracy: true, timeout: 5000 }
        )
      })
    } catch {
      coords = null
    }

    // Fallback to a neutral coordinate if GPS not granted
    const location = coords
      ? { type: 'Point', coordinates: [coords.lng, coords.lat] }
      : { type: 'Point', coordinates: [0, 0] }

    const payload = {
      owner_uid: form.owner_uid,
      name: form.name.trim(),
      sport: form.sport,
      location,
      address: form.address?.trim() || null,
      players: form.playersText
        .split(',')
        .map(p => p.trim())
        .filter(Boolean),
      availability: form.availability,
      device_tokens: form.device_tokens,
    }

    try {
      const res = await fetch(`${backendUrl}/teams`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error(await res.text())
      setStatus('Team created!')
      setForm({ ...form, name: '', address: '', playersText: '' })
    } catch (err) {
      console.error(err)
      setStatus('Failed to create team')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Team Name</label>
          <input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} className="mt-1 w-full border rounded-md px-3 py-2" placeholder="e.g., Sunset FC" required />
        </div>
        <div>
          <label className="block text-sm font-medium">Sport</label>
          <select value={form.sport} onChange={e=>setForm(f=>({...f,sport:e.target.value}))} className="mt-1 w-full border rounded-md px-3 py-2">
            {sports.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Address (optional)</label>
        <input value={form.address} onChange={e=>setForm(f=>({...f,address:e.target.value}))} className="mt-1 w-full border rounded-md px-3 py-2" placeholder="Neighborhood, field name, or city" />
      </div>

      <div>
        <label className="block text-sm font-medium">Players (comma-separated)</label>
        <input value={form.playersText} onChange={e=>setForm(f=>({...f,playersText:e.target.value}))} className="mt-1 w-full border rounded-md px-3 py-2" placeholder="Alice, Bob, Charlie" />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Availability</label>
          <select value={form.availability.timeslot} onChange={e=>setForm(f=>({...f,availability:{...f.availability,timeslot:e.target.value}}))} className="mt-1 w-full border rounded-md px-3 py-2">
            {['any','morning','afternoon','evening'].map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button type="submit" className="inline-flex items-center px-4 py-2 rounded-md bg-black text-white">
          Create Team
        </button>
        {status && <span className="text-sm text-gray-600">{status}</span>}
      </div>
    </form>
  )
}
