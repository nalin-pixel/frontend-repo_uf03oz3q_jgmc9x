import React, { useEffect, useState } from 'react'

export default function RequestsPanel({ backendUrl }) {
  const [teamId, setTeamId] = useState('')
  const [items, setItems] = useState([])
  const [status, setStatus] = useState('')

  const load = async () => {
    if (!teamId) {
      setStatus('Enter your team ID to view requests.')
      return
    }
    setStatus('Loading...')
    try {
      const res = await fetch(`${backendUrl}/match-requests?team_id=${teamId}`)
      const data = await res.json()
      setItems(data)
      setStatus(`Loaded ${data.length} requests`)
    } catch (e) {
      console.error(e)
      setStatus('Failed to load requests')
    }
  }

  useEffect(() => {
    // load()
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex gap-3 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium">Your Team ID</label>
          <input value={teamId} onChange={e=>setTeamId(e.target.value)} className="mt-1 w-full border rounded-md px-3 py-2" placeholder="Paste your team ID" />
        </div>
        <button onClick={load} className="inline-flex items-center px-4 py-2 rounded-md bg-black text-white">Refresh</button>
      </div>

      <ul className="divide-y rounded-md border bg-white">
        {items.map(it => (
          <li key={it.id} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Request from {it.from_team_id} → {it.to_team_id}</div>
                <div className="text-sm text-gray-500">Status: {it.status}</div>
              </div>
              <div className="flex gap-2">
                <ActionButton backendUrl={backendUrl} id={it.id} action="accept" label="Accept" />
                <ActionButton backendUrl={backendUrl} id={it.id} action="reject" label="Reject" variant="secondary" />
                <ActionButton backendUrl={backendUrl} id={it.id} action="confirm" label="Confirm" variant="primary" />
              </div>
            </div>
          </li>
        ))}
        {items.length === 0 && (
          <li className="p-6 text-center text-sm text-gray-500">No requests yet.</li>
        )}
      </ul>
    </div>
  )
}

function ActionButton({ backendUrl, id, action, label, variant='default' }) {
  const [status, setStatus] = useState('')
  const onClick = async () => {
    setStatus('...')
    try {
      const res = await fetch(`${backendUrl}/match-requests/${id}/${action}`, { method: 'POST' })
      if (!res.ok) throw new Error(await res.text())
      setStatus('Done')
    } catch (e) {
      console.error(e)
      setStatus('Error')
    }
  }
  const styles = {
    default: 'bg-indigo-600 text-white',
    secondary: 'bg-gray-200 text-gray-900',
    primary: 'bg-green-600 text-white'
  }
  return (
    <button onClick={onClick} className={`inline-flex items-center px-3 py-2 rounded-md ${styles[variant]}`}>
      {label} {status && <span className="ml-1 text-xs opacity-70">{status}</span>}
    </button>
  )
}
