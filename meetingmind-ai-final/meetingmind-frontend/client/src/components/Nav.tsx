import { useState } from "react";
import { Link } from "wouter";
import { Menu, X, Zap } from "lucide-react";

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/features", label: "Features" },
    { href: "/pricing", label: "Pricing" },
    { href: "/demo", label: "Demo" },
    { href: "/meetings", label: "Meetings" },
    { href: "/about", label: "About" },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-lg flex items-center justify-center">
                <Zap className="text-white w-5 h-5" />
              </div>
              <span className="font-bold text-xl text-gray-900">
                MeetingMind<span className="text-indigo-600">.AI</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8 text-sm font-medium">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href}>
                <a className="text-gray-700 hover:text-indigo-600 transition">
                  {link.label}
                </a>
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <Link href="/demo">
              <a className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition shadow-md">
                Try demo
              </a>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <X className="w-6 h-6 text-gray-900" />
            ) : (
              <Menu className="w-6 h-6 text-gray-900" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-200 space-y-3">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href}>
                <a
                  className="block text-gray-700 hover:text-indigo-600 transition py-2 font-medium"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              </Link>
            ))}
            <Link href="/demo">
              <a
                className="block w-full bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition text-center"
                onClick={() => setMobileOpen(false)}
              >
                Try demo
              </a>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
