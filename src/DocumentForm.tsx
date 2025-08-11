import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "./supabaseClient";

export default function DocumentForm({
  template,
  onSubmit,
}: {
  template: { id: string; title: string; description: string; generateContent: (data: Record<string, string>) => string };
  onSubmit: (data: Record<string, string>) => void;
}) {
  const [title, setTitle] = useState(template.title);
  const [businessName, setBusinessName] = useState("");
  const [partyName, setPartyName] = useState("");
  const [extra, setExtra] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { navigate("/auth"); return; }
    onSubmit({ title, businessName, partyName, extra });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block">
        <span className="mb-1 block text-sm">Document Title</span>
        <input className="w-full rounded border p-2" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm">Your Business Name</span>
        <input className="w-full rounded border p-2" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Example Pty Ltd" required />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm">Other Party (if any)</span>
        <input className="w-full rounded border p-2" value={partyName} onChange={(e) => setPartyName(e.target.value)} placeholder="Contractor / Employee / Client" />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm">Anything specific to include?</span>
        <textarea className="w-full rounded border p-2" rows={4} value={extra} onChange={(e) => setExtra(e.target.value)} placeholder="Special clauses, terms, dates, etc." />
      </label>
      <button className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">Generate Document</button>
    </form>
  );
}
