// api/risk-alerts.ts
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

const resend = new Resend(process.env.RESEND_API_KEY!);
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // service key for server-side
);

const REQUIREMENTS = [
  { key: "employment_agreement", weight: 20 },
  { key: "privacy_policy", weight: 20 },
  { key: "terms_and_conditions", weight: 20 },
  { key: "refunds_policy", weight: 10 },
  { key: "workplace_policy", weight: 15 },
  { key: "subcontractor_agreement", weight: 15 }, // industry-specific max
  { key: "nda", weight: 10 },
];

function scoreFor(docTypes: string[]) {
  const have = new Set(docTypes);
  let total = 0;
  REQUIREMENTS.forEach(r => { if (have.has(r.key)) total += r.weight; });
  return Math.min(100, total);
}

export default async function handler(req, res) {
  try {
    // Pull all opted-in users
    const { data: profiles, error: pErr } = await supabase
      .from('profiles')
      .select('id, full_name, business_name, industry, alerts_opt_in, auth:auth.users(email)')
      .eq('alerts_opt_in', true);

    if (pErr) throw pErr;

    for (const profile of profiles || []) {
      const email = profile.auth?.email;
      if (!email) continue;

      // Read user docs
      const { data: docs } = await supabase
        .from('documents')
        .select('doc_type')
        .eq('user_id', profile.id);

      const docTypes = (docs || []).map(d => d.doc_type).filter(Boolean) as string[];
      const score = scoreFor(docTypes);

      // Simple top gaps list (three items)
      const have = new Set(docTypes);
      const gaps = REQUIREMENTS
        .filter(r => !have.has(r.key))
        .slice(0, 3)
        .map(g => g.key.replaceAll('_',' '));

      const subject = `Weekly Risk Alert: Your Protection Score is ${score}%`;
      const bodyLines = [
        `Hi ${profile.full_name || 'there'},`,
        ``,
        `Your current Legal Protection Score: ${score}%.`,
        gaps.length ? `Top gaps: ${gaps.join(', ')}.` : `Great job — no obvious gaps detected this week!`,
        ``,
        `→ Improve your score now: https://${req.headers.host}/templates`,
        `→ Review your docs: https://${req.headers.host}/my-documents`,
      ];

      await resend.emails.send({
        from: process.env.ALERTS_FROM_EMAIL!,
        to: email,
        subject,
        text: bodyLines.join('\n'),
      });
    }

    res.status(200).json({ ok: true });
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
}
