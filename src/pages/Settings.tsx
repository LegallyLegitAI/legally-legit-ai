import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const INDUSTRIES = [
  { value: "restaurant_cafe", label: "Restaurant / Café" },
  { value: "trades_construction", label: "Trades / Construction" },
  { value: "retail", label: "Retail" },
  { value: "professional_services", label: "Professional Services" },
  { value: "other", label: "Other" },
];

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [industry, setIndustry] = useState<string>("other");
  const [alertsOptIn, setAlertsOptIn] = useState<boolean>(true);
  const [msg, setMsg] = useState<string>("");

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      const { data, error } = await supabase.from("profiles").select("industry, alerts_opt_in").eq("id", user.id).single();
      if (!error && data) { setIndustry(data.industry || "other"); setAlertsOptIn(data.alerts_opt_in ?? true); }
      setLoading(false);
    })();
  }, []);

  const save = async () => {
    setMsg("");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from("profiles").update({ industry, alerts_opt_in: alertsOptIn }).eq("id", user.id);
    setMsg(error ? "Could not save settings." : "Saved.");
  };

  if (loading) return <div className="p-6">Loading settings…</div>;

  return (
    <div className="mx-auto max-w-2xl p-6 space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      <div className="rounded bg-white p-6 shadow space-y-4">
        <div>
          <label className="block text-sm mb-1">Industry</label>
          <select className="w-full rounded border p-2" value={industry} onChange={(e) => setIndustry(e.target.value)}>
            {INDUSTRIES.map((i) => <option value={i.value} key={i.value}>{i.label}</option>)}
          </select>
        </div>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={alertsOptIn} onChange={(e) => setAlertsOptIn(e.target.checked)} />
          Receive weekly Risk Alerts email
        </label>
        <button onClick={save} className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">Save changes</button>
        {!!msg && <p className="text-sm opacity-80">{msg}</p>}
      </div>
    </div>
  );
}
