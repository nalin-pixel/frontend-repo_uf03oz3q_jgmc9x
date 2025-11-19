import { useState } from "react";

const initial = {
  owner_uid: "demo-owner",
  name: "",
  sport: "soccer",
  address: "",
  players: "",
  availability_timeslot: "any",
  lat: "",
  lng: "",
};

export default function TeamForm({ onCreated }) {
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const backend = import.meta.env.VITE_BACKEND_URL || "";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      const payload = {
        owner_uid: form.owner_uid,
        name: form.name,
        sport: form.sport,
        location: { type: "Point", coordinates: [Number(form.lng), Number(form.lat)] },
        address: form.address || null,
        players: form.players ? form.players.split(",").map((s) => s.trim()).filter(Boolean) : [],
        availability: { days: [], timeslot: form.availability_timeslot },
        device_tokens: [],
      };
      const res = await fetch(`${backend}/teams`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setMsg("Team created");
      setForm(initial);
      onCreated && onCreated(data);
    } catch (err) {
      setMsg(`Error: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
      <h3 className="text-white font-semibold mb-3">Create Team</h3>
      <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Team name" className="bg-slate-900/60 text-white px-3 py-2 rounded" required />
        <select name="sport" value={form.sport} onChange={handleChange} className="bg-slate-900/60 text-white px-3 py-2 rounded">
          {[
            "soccer","basketball","tennis","cricket","volleyball","badminton","rugby","hockey","other"
          ].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <input name="address" value={form.address} onChange={handleChange} placeholder="Address (optional)" className="bg-slate-900/60 text-white px-3 py-2 rounded md:col-span-2" />
        <div className="flex gap-3">
          <input name="lat" value={form.lat} onChange={handleChange} placeholder="Latitude" className="bg-slate-900/60 text-white px-3 py-2 rounded w-1/2" required />
          <input name="lng" value={form.lng} onChange={handleChange} placeholder="Longitude" className="bg-slate-900/60 text-white px-3 py-2 rounded w-1/2" required />
        </div>
        <select name="availability_timeslot" value={form.availability_timeslot} onChange={handleChange} className="bg-slate-900/60 text-white px-3 py-2 rounded">
          {["any","morning","afternoon","evening"].map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <input name="players" value={form.players} onChange={handleChange} placeholder="Players (comma separated)" className="bg-slate-900/60 text-white px-3 py-2 rounded" />
        <button disabled={loading} className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-4 py-2 rounded md:col-span-2">{loading ? "Creating..." : "Create Team"}</button>
      </form>
      {msg && <p className="text-blue-300 text-sm mt-2">{msg}</p>}
    </div>
  );
}
