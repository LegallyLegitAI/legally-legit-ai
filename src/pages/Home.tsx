import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Legal protection for Aussie small businesses</h1>
        <p className="text-lg text-gray-700">
          Generate core documents, track compliance, and stay ahead of changes — all in one place.
        </p>
        <div className="flex justify-center gap-3">
          <Link to="/auth" className="btn-primary">Get started</Link>
          <Link to="/templates" className="btn-secondary">Browse templates</Link>
        </div>
      </div>
    </div>
  );
}
