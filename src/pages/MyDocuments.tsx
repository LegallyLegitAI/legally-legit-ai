import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

const badgeClasses: Record<string, string> = {
  low: "bg-green-100 text-green-800",
  medium: "bg-amber-100 text-amber-800",
  high: "bg-red-100 text-red-800",
};

export default function MyDocuments() {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/auth"); return; }
      await refresh();
    })();
  }, [navigate]);

  const refresh = async () => {
    const { data } = await supabase
      .from("documents")
      .select("id,title,content,created_at,updated_at,doc_type,risk_level,is_outdated,rules_version")
      .order("created_at", { ascending: false });
    setDocuments(data || []);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("documents").delete().eq("id", id);
    if (!error) setDocuments(prev => prev.filter(d => d.id !== id));
  };

  const handleDownload = (title: string, content: string) => {
    const blob = new Blob([content], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${title}.html`; a.click();
    URL.revokeObjectURL(url);
  };

  const updateNow = async (doc: any) => {
    setUpdatingId(doc.id);
    const { data: rule } = await supabase
      .from("compliance_rules")
      .select("current_version")
      .eq("doc_type", doc.doc_type)
      .single();
    const nextVersion = rule?.current_version ?? (doc.rules_version || 1);

    const updatedContent = `${doc.content}
      <div style="margin-top:12px;padding:10px;background:#ecfeff;border-left:4px solid #06b6d4">
        Updated to rules v${nextVersion}.
      </div>`;

    await supabase
      .from("documents")
      .update({ is_outdated: false, rules_version: nextVersion, content: updatedContent })
      .eq("id", doc.id);

    await refresh();
    setUpdatingId(null);
  };

  if (loading) return <div className="p-6">Loading your documents…</div>;

  return (
    <div className="mx-auto max-w-5xl p-6">
      <h1 className="mb-4 text-2xl font-bold">My Documents</h1>
      {documents.length === 0 ? (
        <p>You have no saved documents yet. <a className="text-blue-600 underline" href="/templates">Create one now →</a></p>
      ) : (
        <div className="space-y-4">
          {documents.map(doc => (
            <div key={doc.id} className="rounded border p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-semibold">{doc.title}</h2>
                  <p className="text-sm text-gray-500">Created: {new Date(doc.created_at).toLocaleString()}</p>
                  <p className="text-sm text-gray-500">Updated: {new Date(doc.updated_at).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  {doc.risk_level && (
                    <span className={`rounded px-2 py-1 text-xs ${badgeClasses[doc.risk_level] || ""}`}>
                      Risk: {doc.risk_level}
                    </span>
                  )}
                  {doc.is_outdated && (
                    <span className="rounded bg-red-100 px-2 py-1 text-xs text-red-800">Outdated</span>
                  )}
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <button onClick={() => handleDownload(doc.title, doc.content)} className="rounded border px-3 py-1 hover:bg-gray-50">Download</button>
                <button onClick={() => handleDelete(doc.id)} className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700">Delete</button>
                {doc.is_outdated && (
                  <button onClick={() => updateNow(doc)} className="rounded bg-emerald-600 px-3 py-1 text-white hover:bg-emerald-700 disabled:opacity-70" disabled={updatingId === doc.id}>
                    {updatingId === doc.id ? "Updating…" : "Update Now"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
