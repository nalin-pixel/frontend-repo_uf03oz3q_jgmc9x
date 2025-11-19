import TeamForm from "./components/TeamForm";
import NearbyFinder from "./components/NearbyFinder";
import RequestsPanel from "./components/RequestsPanel";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="max-w-5xl mx-auto px-4 py-8 grid gap-6">
        <header className="text-center">
          <h1 className="text-3xl font-bold">FindRival — MVP v1.0</h1>
          <p className="text-slate-300">Create your team, find nearby opponents, and manage match requests.</p>
        </header>

        <div className="grid md:grid-cols-2 gap-6">
          <TeamForm onCreated={() => {}} />
          <NearbyFinder />
        </div>

        <RequestsPanel />

        <footer className="text-center text-slate-400 text-sm">Built for fast validation. GPS + filters + simple requests.</footer>
      </div>
    </div>
  );
}

export default App;
