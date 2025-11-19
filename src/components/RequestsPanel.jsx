import { useEffect, useState } from "react";

export default function RequestsPanel() {
  const backend = import.meta.env.VITE_BACKEND_URL || "";
  const [items, setItems] = useState([]);

  const refresh = async () => {
    const res = await fetch(`${backend}/match-requests`);
    if (res.ok) setItems(await res.json());
  };

  useEffect(() => { refresh(); }, []);

  const act = async (id, action) => {
    const res = await fetch(`${backend}/match-requests/${id}/${action}`, { method: "POST" });
    if (res.ok) refresh();
  };

  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-semibold">Match Requests</h3>
        <button onClick={refresh} className="text-sm text-blue-300">Refresh</button>
      </div>
      <div className="grid gap-2">
        {items.map(r => (
          <div key={r.id} className="bg-slate-900/60 text-white rounded p-3 flex items-center justify-between">
            <div>
              <div className="font-medium">{r.from_team_id} → {r.to_team_id}</div>
              <div className="text-xs text-slate-300">{r.status}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={()=>act(r.id,"accept")} className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1 rounded">Accept</button>
              <button onClick={()=>act(r.id,"reject")} className="bg-rose-600 hover:bg-rose-500 text-white px-3 py-1 rounded">Reject</button>
              <button onClick={()=>act(r.id,"confirm")} className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded">Confirm</button>
            </div>
          </div>
        ))}
        {items.length===0 && <div className="text-slate-300 text-sm">No requests yet</div>}
      </div>
    </div>
  );
}
