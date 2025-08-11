// minimal example templates; replace with your real ones anytime.
type Template = {
  id: string;
  title: string;
  description: string;
  generateContent: (data: Record<string,string>) => string;
};

export const templates: Template[] = [
  {
    id: "employment-agreement",
    title: "Employment Agreement",
    description: "Core Fair Work compliant starter agreement.",
    generateContent: (d) => `
      <h1>${d.title || "Employment Agreement"}</h1>
      <p>Employer: ${d.businessName || "Your Business"}</p>
      <p>Employee: ${d.partyName || "Employee Name"}</p>
      <p>Notes: ${d.extra || ""}</p>
      <h2>Terms</h2>
      <p>…</p>
    `,
  },
  {
    id: "privacy-policy",
    title: "Privacy Policy",
    description: "Australian Privacy Act aligned template.",
    generateContent: (d) => `
      <h1>${d.title || "Privacy Policy"}</h1>
      <p>Business: ${d.businessName || "Your Business"}</p>
      <h2>Collection & Use</h2>
      <p>…</p>
    `,
  },
  {
    id: "terms-conditions",
    title: "Website Terms & Conditions",
    description: "Australian Consumer Law oriented website terms.",
    generateContent: (d) => `
      <h1>${d.title || "Terms & Conditions"}</h1>
      <p>Business: ${d.businessName || "Your Business"}</p>
      <h2>Use of Site</h2>
      <p>…</p>
    `,
  },
  {
    id: "nda",
    title: "Non-Disclosure Agreement (NDA)",
    description: "Mutual confidentiality agreement.",
    generateContent: (d) => `
      <h1>${d.title || "NDA"}</h1>
      <p>Party A: ${d.businessName || "Your Business"}</p>
      <p>Party B: ${d.partyName || "Other Party"}</p>
      <h2>Confidentiality</h2>
      <p>…</p>
    `,
  },
  {
    id: "refunds-policy",
    title: "Refunds & Returns Policy",
    description: "ACL-friendly refunds & returns.",
    generateContent: (d) => `
      <h1>${d.title || "Refunds & Returns Policy"}</h1>
      <p>Business: ${d.businessName || "Your Business"}</p>
      <h2>Returns</h2>
      <p>…</p>
    `,
  },
  {
    id: "contractor-agreement",
    title: "Subcontractor Agreement",
    description: "Work with subcontractors safely.",
    generateContent: (d) => `
      <h1>${d.title || "Subcontractor Agreement"}</h1>
      <p>Principal: ${d.businessName || "Your Business"}</p>
      <p>Subcontractor: ${d.partyName || "Subbie"}</p>
      <h2>Scope</h2>
      <p>…</p>
    `,
  },
];
