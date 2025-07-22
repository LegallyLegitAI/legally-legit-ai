import { Link } from 'react-router-dom'
import { Menu, X, Scale } from 'lucide-react'
import { useState } from 'react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Scale className="h-8 w-8 text-[--color-navy]" />
              <span className="font-bold text-xl text-[--color-navy]">
                Legally Legit AI
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/quiz" className="text-gray-700 hover:text-[--color-navy] font-medium">
              Quick Quiz
            </Link>
            <Link to="/templates" className="text-gray-700 hover:text-[--color-navy] font-medium">
              Templates
            </Link>
            <Link to="/blog" className="text-gray-700 hover:text-[--color-navy] font-medium">
              Blog
            </Link>
            <Link to="/templates" className="btn-primary">
              Get Started
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-[--color-navy] p-2"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/quiz"
                className="block px-3 py-2 text-gray-700 hover:text-[--color-navy] font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Quick Quiz
              </Link>
              <Link
                to="/templates"
                className="block px-3 py-2 text-gray-700 hover:text-[--color-navy] font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Templates
              </Link>
              <Link
                to="/blog"
                className="block px-3 py-2 text-gray-700 hover:text-[--color-navy] font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
              <Link
                to="/templates"
                className="block w-full text-center btn-primary mt-4"
                onClick={() => setIsMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}