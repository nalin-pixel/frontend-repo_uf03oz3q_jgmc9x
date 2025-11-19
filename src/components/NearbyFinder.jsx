import { useEffect, useState } from "react";

export default function NearbyFinder() {
  const [coords, setCoords] = useState({ lat: null, lng: null });
  const [sport, setSport] = useState("");
  const [timeslot, setTimeslot] = useState("");
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const backend = import.meta.env.VITE_BACKEND_URL || "";

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        () => setError("Location permission denied"),
        { enableHighAccuracy: true }
      );
    } else {
      setError("Geolocation not supported");
    }
  }, []);

  const search = async () => {
    if (!coords.lat || !coords.lng) return;
    setLoading(true);
    setError("");
    try {
      const p = new URLSearchParams({
        lat: String(coords.lat),
        lng: String(coords.lng),
        max_km: "25",
      });
      if (sport) p.append("sport", sport);
      if (timeslot) p.append("timeslot", timeslot);
      const res = await fetch(`${backend}/teams/nearby?${p.toString()}`);
      if (!res.ok) throw new Error(await res.text());
      setTeams(await res.json());
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
      <div className="flex flex-wrap gap-2 items-end">
        <select value={sport} onChange={(e)=>setSport(e.target.value)} className="bg-slate-900/60 text-white px-3 py-2 rounded">
          <option value="">All sports</option>
          {["soccer","basketball","tennis","cricket","volleyball","badminton","rugby","hockey","other"].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={timeslot} onChange={(e)=>setTimeslot(e.target.value)} className="bg-slate-900/60 text-white px-3 py-2 rounded">
          <option value="">Any time</option>
          {["morning","afternoon","evening"].map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <button onClick={search} className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded">Find Nearby</button>
        <div className="text-blue-300 text-sm ml-auto">{coords.lat && coords.lng ? `📍 ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}` : "Waiting for GPS..."}</div>
      </div>

      <div className="mt-4 grid gap-3">
        {loading && <div className="text-blue-300">Loading...</div>}
        {error && <div className="text-red-300">{error}</div>}
        {teams.map(t => (
          <div key={t.id} className="bg-slate-900/60 text-white rounded p-3 flex items-center justify-between">
            <div>
              <div className="font-semibold">{t.name}</div>
              <div className="text-sm text-slate-300">{t.sport} • {t.address || "Unknown"}</div>
            </div>
            <MatchRequestButton toTeamId={t.id} />
          </div>
        ))}
      </div>
    </div>
  );
}

function MatchRequestButton({ toTeamId }) {
  const backend = import.meta.env.VITE_BACKEND_URL || "";
  const [status, setStatus] = useState("idle");

  const send = async () => {
    setStatus("sending");
    try {
      const payload = { from_team_id: "demo-from", to_team_id: toTeamId, status: "pending" };
      const res = await fetch(`${backend}/match-requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text());
      await res.json();
      setStatus("sent");
    } catch (e) {
      setStatus("error");
    }
  };

  return (
    <button onClick={send} disabled={status!=="idle" && status!=="error"} className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded">
      {status === "idle" && "Send Request"}
      {status === "sending" && "Sending..."}
      {status === "sent" && "Sent ✓"}
      {status === "error" && "Retry"}
    </button>
  );
}
