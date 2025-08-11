import { useEffect, useState } from "react";
import { FileText, Download, AlertCircle } from "lucide-react";
import DocumentForm from "../DocumentForm";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import { templates } from "../legalTemplates"; // adjust if needed

const STATE_DISCLAIMERS: Record<string, string> = {
  NSW: "⚠️ NSW: Check applicable modern awards and state‑based OHS obligations.",
  VIC: "⚠️ VIC: Ensure compliance with the Victorian OHS Act & local consumer law.",
  QLD: "⚠️ QLD: QBCC/licensing implications may apply for construction/trades.",
  WA: "⚠️ WA: Industrial relations laws may differ from national system—review.",
  SA: "⚠️ SA: Confirm state licensing/permit requirements relevant to your industry.",
  TAS: "⚠️ TAS: Include hazard management under Tasmanian WHS rules where relevant.",
  ACT: "⚠️ ACT: Certain consumer protections apply—ensure terms are fair and clear.",
  NT: "⚠️ NT: Employment and licensing rules may require extra steps; verify."
};

type TemplateDef = {
  id: string;
  title: string;
  description: string;
  generateContent: (data: Record<string, string>) => string;
};

const TEMPLATE_META: Record<string, { doc_type: string; risk_level: "low" | "medium" | "high" }> = {
  "employment-agreement": { doc_type: "employment_agreement", risk_level: "high" },
  "contractor-agreement": { doc_type: "subcontractor_agreement", risk_level: "high" },
  "privacy-policy": { doc_type: "privacy_policy", risk_level: "medium" },
  "terms-conditions": { doc_type: "terms_and_conditions", risk_level: "medium" },
  "refunds-policy": { doc_type: "refunds_policy", risk_level: "medium" },
  "nda": { doc_type: "nda", risk_level: "low" }
};

export default function Templates() {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateDef | null>(null);
  const [generatedDocument, setGeneratedDocument] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userState, setUserState] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/auth"); return; }
      setUserId(user.id);
      const { data: profile } = await supabase.from("profiles").select("state").eq("id", user.id).single();
      setUserState(profile?.state ?? null);
    })();
  }, [navigate]);

  const handleGenerateDocument = async (data: Record<string, string>) => {
    if (!selectedTemplate) return;
    const baseHtml = selectedTemplate.generateContent(data);
    const stateWarning = userState ? STATE_DISCLAIMERS[userState] : "";
    const disclaimerBlock = `
      <div style="padding:12px;border-left:4px solid #f59e0b;background:#fff7ed;margin-bottom:16px">
        <strong>Important:</strong> Templates are general only. Have a qualified Australian lawyer review before use.
        ${stateWarning ? `<div style="margin-top:6px">${stateWarning}</div>` : ""}
      </div>`;
    setGeneratedDocument(`${disclaimerBlock}${baseHtml}`);
  };

  const handleSaveToSupabase = async () => {
    if (!selectedTemplate || !generatedDocument || !userId) return;

    const meta = TEMPLATE_META[selectedTemplate.id] ?? { doc_type: selectedTemplate.id, risk_level: "medium" as const };

    const { error } = await supabase.from("documents").insert({
      user_id: userId,
      title: selectedTemplate.title,
      content: generatedDocument,
      classification: "confidential",
      doc_type: meta.doc_type,
      risk_level: meta.risk_level,
      rules_version: 1
    });

    if (error) {
      console.error("Error saving document:", error.message);
      alert("Sorry, we couldn’t save your document. Please try again.");
    } else {
      alert("Document saved to your account.");
    }
  };

  const handleDownload = () => {
    const blob = new Blob([generatedDocument || ""], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${selectedTemplate?.title || "document"}.html`; a.click();
    URL.revokeObjectURL(url);
  };

  if (selectedTemplate && !generatedDocument) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <button onClick={() => setSelectedTemplate(null)} className="mb-6 text-blue-700 hover:underline">← Back to Templates</button>
        <div className="rounded-xl bg-white p-8 shadow-lg">
          <h2 className="mb-6 text-2xl font-bold">{selectedTemplate.title}</h2>
          <DocumentForm template={selectedTemplate} onSubmit={handleGenerateDocument} />
        </div>
      </div>
    );
  }

  if (generatedDocument) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="rounded-xl bg-white p-8 shadow-lg">
          <div className="mb-6 flex items-start justify-between">
            <h2 className="text-2xl font-bold">Your document is ready!</h2>
            <div className="flex gap-2">
              <button onClick={handleSaveToSupabase} className="rounded bg-blue-600 px-3 py-2 text-white hover:bg-blue-700">Save to My Account</button>
              <button onClick={handleDownload} className="rounded border px-3 py-2 hover:bg-gray-50">
                <Download className="mr-2 inline h-4 w-4" /> Download
              </button>
            </div>
          </div>
          <div className="mb-6 border-l-4 border-amber-400 bg-amber-50 p-4">
            <div className="flex items-start">
              <AlertCircle className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
              <p className="text-sm text-amber-800">
                <strong>Reminder:</strong> This is a template only. Get a qualified Australian lawyer to review before use.
              </p>
            </div>
          </div>
          <div className="prose max-w-none rounded bg-gray-50 p-8" dangerouslySetInnerHTML={{ __html: generatedDocument }} />
          <div className="mt-8 flex gap-4">
            <button onClick={() => { setGeneratedDocument(null); setSelectedTemplate(null); }} className="rounded border px-3 py-2 hover:bg-gray-50">
              Create another document
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-3xl font-bold md:text-4xl">Legal Document Templates</h1>
        <p className="text-xl text-gray-600">Choose from our Australian law‑focused templates</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((t: TemplateDef) => (
          <div key={t.id} className="cursor-pointer rounded-xl bg-white p-6 shadow-lg transition-shadow hover:shadow-xl"
               onClick={() => setSelectedTemplate(t)}>
            <div className="mb-4 flex items-start justify-between">
              <FileText className="h-8 w-8 text-gray-900" />
              <span className="text-sm font-semibold text-green-700">Popular</span>
            </div>
            <h3 className="mb-2 text-xl font-semibold">{t.title}</h3>
            <p className="mb-4 text-sm text-gray-600">{t.description}</p>
            <button className="font-semibold text-blue-700 hover:underline">Create now →</button>
          </div>
        ))}
      </div>
    </div>
  );
}