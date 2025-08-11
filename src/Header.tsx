import { Link } from "react-router-dom";
import { useSession } from "./hooks/useSession";
import { supabase } from "./supabaseClient";

export default function Header() {
  const { session } = useSession();

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        <Link to="/" className="text-2xl font-bold text-gray-900">
          Legally Legit AI
        </Link>

        <nav className="flex items-center gap-4">
          <Link to="/blog" className="text-gray-700 hover:text-gray-900">Blog</Link>
          <Link to="/stories" className="text-gray-700 hover:text-gray-900">Stories</Link>
          <Link to="/templates" className="text-gray-700 hover:text-gray-900">Templates</Link>

          {session ? (
            <>
              <Link to="/dashboard" className="rounded bg-gray-900 px-3 py-2 text-white hover:bg-black">Dashboard</Link>
              <Link to="/my-documents" className="rounded border px-3 py-2 hover:bg-gray-50">My Documents</Link>
              <Link to="/settings" className="rounded border px-3 py-2 hover:bg-gray-50">Settings</Link>
              <button onClick={() => supabase.auth.signOut()} className="px-3 py-2 text-gray-700 hover:text-gray-900">
                Logout
              </button>
            </>
          ) : (
            <Link to="/auth" className="rounded bg-blue-600 px-3 py-2 text-white hover:bg-blue-700">Sign in</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
