import { useEffect, useMemo, useState } from "react";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";

type DocRow = {
  id: string;
  title: string;
  created_at: string;
  doc_type?: string | null;
  rules_version?: number | null;
  is_outdated?: boolean | null;
};

const BASE_REQUIREMENTS = [
  { key: "employment_agreement", area: "Fair Work / Employment", weight: 20 },
  { key: "privacy_policy", area: "Privacy Act", weight: 20 },
  { key: "terms_and_conditions", area: "ACL / Consumer", weight: 20 },
  { key: "refunds_policy", area: "ACL / Consumer", weight: 10 },
  { key: "workplace_policy", area: "HR / Safety", weight: 15 },
];

const INDUSTRY_EXTRA: Record<string, { key: string; area: string; weight: number }[]> = {
  restaurant_cafe: [{ key: "subcontractor_agreement", area: "Kitchen/trades contractors", weight: 10 }],
  trades_construction: [{ key: "subcontractor_agreement", area: "Trades / QBCC", weight: 15 }],
  retail: [],
  professional_services: [{ key: "nda", area: "Confidentiality", weight: 10 }],
  other: [],
};

function labelFromType(key: string) {
  switch (key) {
    case "employment_agreement": return "Employment Contract";
    case "privacy_policy": return "Privacy Policy";
    case "terms_and_conditions": return "Website Terms & Conditions";
    case "refunds_policy": return "Refunds & Returns Policy";
    case "subcontractor_agreement": return "Subcontractor Agreement";
    case "workplace_policy": return "Workplace Policy";
    case "nda": return "NDA";
    default: return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  }
}

export default function Dashboard() {
  const [docs, setDocs] = useState<DocRow[]>([]);
  const [industry, setIndustry] = useState<string>("other");
  const [loading, setLoading] = useState(true);
  const [anyOutdated, setAnyOutdated] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: userRes } = await supabase.auth.getUser();
      const uid = userRes.user?.id;
      if (!uid) { setLoading(false); return; }

      const { data: profile } = await supabase
        .from("profiles")
        .select("industry")
        .eq("id", uid)
        .single();

      setIndustry(profile?.industry || "other");

      const { data } = await supabase
        .from("documents")
        .select("id,title,created_at,doc_type,rules_version,is_outdated")
        .order("created_at", { ascending: false });

      const rows = (data as any) || [];
      setDocs(rows);
      setAnyOutdated(rows.some((d: DocRow) => !!d.is_outdated));
      setLoading(false);
    })();
  }, []);

  const { score, missing } = useMemo(() => {
    const req = [...BASE_REQUIREMENTS, ...INDUSTRY_EXTRA[industry]];
    const have = new Set(docs.map((d) => (d.doc_type || "").toString()));
    let total = 0;
    req.forEach((r) => { if (have.has(r.key)) total += r.weight; });
    return { score: Math.min(100, total), missing: req.filter((r) => !have.has(r.key)) };
  }, [docs, industry]);

  return (
    <div className="space-y-6 p-6">
      {anyOutdated && (
        <div className="rounded border-l-4 border-amber-500 bg-amber-50 p-4">
          <p className="text-sm text-amber-800">
            Some of your documents may be outdated due to recent legal changes.
            Visit <Link to="/my-documents" className="underline">My Documents</Link> to update them now.
          </p>
        </div>
      )}

      <div className="rounded bg-white p-6 shadow">
        <h2 className="mb-2 text-2xl font-bold">Legal Protection Score</h2>
        {loading ? (
          <p>Loading…</p>
        ) : (
          <>
            <div className="text-5xl font-bold">{score}%</div>
            <p className="opacity-80">
              Weighted for your industry: <span className="font-medium">{industry.replace(/_/g, " ")}</span>.
            </p>
            {!!missing.length && (
              <div className="mt-4">
                <h3 className="mb-2 font-semibold">Top gaps</h3>
                <ul className="ml-5 list-disc">
                  {missing.map((m) => (
                    <li key={m.key}>
                      Missing <span className="font-medium">{labelFromType(m.key)}</span>{" "}
                      <span className="opacity-70">({m.area})</span>{" "}
                      <Link to="/templates" className="ml-1 text-blue-600 underline">Fix now →</Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>

      <div className="rounded bg-white p-6 shadow">
        <h2 className="mb-2 text-2xl font-bold">Quick actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link to="/templates" className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">Create a document</Link>
          <Link to="/settings" className="rounded border px-4 py-2 hover:bg-gray-50">Update settings</Link>
          <Link to="/my-documents" className="rounded border px-4 py-2 hover:bg-gray-50">Review my documents</Link>
        </div>
      </div>
    </div>
  );
}
