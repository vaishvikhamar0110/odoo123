import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: '/', label: 'Dashboard' },
    { path: '/vehicles', label: 'Vehicles' },
    { path: '/trips', label: 'Trips' },
    { path: '/drivers', label: 'Drivers' },
    { path: '/maintenance', label: 'Maintenance' },
    { path: '/expenses', label: 'Expenses' },
    { path: '/analytics', label: 'Analytics' },
    { path: '/contact', label: 'Contact' }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="w-full bg-background border-b border-muted-accent/30 sticky top-0 z-50">
      <div className="max-w-[100rem] mx-auto px-8 py-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="font-heading text-3xl text-foreground">
              FleetFlow
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-paragraph text-base transition-colors duration-300 ${
                  isActive(link.path)
                    ? 'text-primary font-medium'
                    : 'text-secondary hover:text-primary'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-secondary hover:text-primary transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="lg:hidden mt-6 pb-4 flex flex-col gap-4">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`font-paragraph text-base transition-colors duration-300 ${
                  isActive(link.path)
                    ? 'text-primary font-medium'
                    : 'text-secondary hover:text-primary'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
