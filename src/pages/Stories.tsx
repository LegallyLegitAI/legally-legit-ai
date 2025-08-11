import { Link } from "react-router-dom";

const STORIES = [
  { slug: "fair-work-85k", title: "The café owner who lost $85,000 to Fair Work", tag: "Employment" },
  { slug: "tradie-no-contract", title: "How one missing contract cost a tradie his business", tag: "Contracts" },
  { slug: "asic-shutdown", title: "Retail store shut down in an ASIC compliance mess", tag: "ASIC" },
];

export default function Stories() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div className="rounded-xl bg-gray-100">
        <div className="hero-content text-center">
          <div className="max-w-xl p-8">
            <h1 className="text-3xl font-bold">Legal Disaster Stories</h1>
            <p className="py-4">Real, anonymised cautionary tales — and exactly how to avoid them.</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {STORIES.map((s) => (
          <article key={s.slug} className="bg-white rounded shadow">
            <div className="p-5">
              <span className="inline-block mb-2 rounded border border-red-300 px-2 py-0.5 text-xs text-red-700">{s.tag}</span>
              <h3 className="font-semibold">{s.title}</h3>
              <div className="mt-3 text-right">
                <Link to={`/blog`} className="text-blue-700 hover:underline">Read</Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
