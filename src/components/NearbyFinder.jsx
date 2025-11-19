import React, { useEffect, useState } from 'react'

export default function NearbyFinder({ backendUrl }) {
  const [sport, setSport] = useState('')
  const [timeslot, setTimeslot] = useState('')
  const [teams, setTeams] = useState([])
  const [status, setStatus] = useState('')

  const findNearby = async () => {
    setStatus('Locating...')
    let coords
    try {
      coords = await new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
          () => resolve(null),
          { enableHighAccuracy: true, timeout: 5000 }
        )
      })
    } catch {
      coords = null
    }

    if (!coords) {
      setStatus('Location not granted. Showing popular teams nearby center.')
    } else {
      setStatus('Searching nearby teams...')
    }

    const params = new URLSearchParams()
    const lat = coords ? coords.lat : 0
    const lng = coords ? coords.lng : 0
    params.set('lat', String(lat))
    params.set('lng', String(lng))
    params.set('max_km', '25')
    if (sport) params.set('sport', sport)
    if (timeslot) params.set('timeslot', timeslot)

    try {
      const res = await fetch(`${backendUrl}/teams/nearby?${params.toString()}`)
      const data = await res.json()
      setTeams(data)
      setStatus(`Found ${data.length} teams`)
    } catch (e) {
      console.error(e)
      setStatus('Failed to fetch nearby teams')
    }
  }

  useEffect(() => {
    // Optionally auto-find on mount
    // findNearby()
  }, [])

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium">Sport</label>
          <select value={sport} onChange={e=>setSport(e.target.value)} className="mt-1 w-full border rounded-md px-3 py-2">
            <option value="">Any</option>
            {['soccer','basketball','tennis','cricket','volleyball','badminton','rugby','hockey','other'].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Timeslot</label>
          <select value={timeslot} onChange={e=>setTimeslot(e.target.value)} className="mt-1 w-full border rounded-md px-3 py-2">
            <option value="">Any</option>
            {['morning','afternoon','evening'].map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <button onClick={findNearby} className="w-full inline-flex items-center justify-center px-4 py-2 rounded-md bg-black text-white">Find Nearby</button>
        </div>
      </div>

      <div className="text-sm text-gray-600">{status}</div>

      <ul className="divide-y rounded-md border bg-white">
        {teams.map(t => (
          <li key={t.id} className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="font-medium">{t.name}</div>
              <div className="text-sm text-gray-500">{t.sport}</div>
            </div>
            <SendRequest backendUrl={backendUrl} teamId={t.id} />
          </li>
        ))}
        {teams.length === 0 && (
          <li className="p-6 text-center text-sm text-gray-500">No teams yet. Try broadening filters.</li>
        )}
      </ul>
    </div>
  )
}

function SendRequest({ backendUrl, teamId }) {
  const [fromTeamId, setFromTeamId] = useState('')
  const [status, setStatus] = useState('')

  const send = async () => {
    if (!fromTeamId) {
      setStatus('Enter your team ID first (from your created team).')
      return
    }
    setStatus('Sending...')
    try {
      const res = await fetch(`${backendUrl}/match-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from_team_id: fromTeamId, to_team_id: teamId })
      })
      if (!res.ok) throw new Error(await res.text())
      setStatus('Request sent!')
    } catch (e) {
      console.error(e)
      setStatus('Failed to send request')
    }
  }

  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
      <input value={fromTeamId} onChange={e=>setFromTeamId(e.target.value)} className="border rounded-md px-3 py-2" placeholder="Your team ID" />
      <button onClick={send} className="inline-flex items-center px-3 py-2 rounded-md bg-indigo-600 text-white">Send Request</button>
      {status && <span className="text-xs text-gray-600">{status}</span>}
    </div>
  )
}
