export default function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="container mx-auto px-6 py-6 text-sm text-gray-600 flex flex-wrap gap-4 justify-between">
        <p>© {new Date().getFullYear()} Legally Legit AI</p>
        <nav className="flex gap-4">
          <a className="hover:underline" href="/terms">Terms</a>
          <a className="hover:underline" href="/privacy">Privacy</a>
          <a className="hover:underline" href="/disclaimer">Disclaimer</a>
        </nav>
      </div>
    </footer>
  );
}
