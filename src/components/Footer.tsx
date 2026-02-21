import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-soft-gray-section border-t border-muted-accent/30">
      <div className="max-w-[100rem] mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3 className="font-heading text-2xl text-foreground mb-4">
              FleetFlow
            </h3>
            <p className="font-paragraph text-base text-secondary">
              Enterprise-grade fleet and logistics management for modern businesses.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-paragraph text-lg font-medium text-foreground mb-4">
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="font-paragraph text-base text-secondary hover:text-primary transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/vehicles" className="font-paragraph text-base text-secondary hover:text-primary transition-colors">
                  Vehicles
                </Link>
              </li>
              <li>
                <Link to="/trips" className="font-paragraph text-base text-secondary hover:text-primary transition-colors">
                  Trips
                </Link>
              </li>
              <li>
                <Link to="/drivers" className="font-paragraph text-base text-secondary hover:text-primary transition-colors">
                  Drivers
                </Link>
              </li>
            </ul>
          </div>

          {/* Management */}
          <div>
            <h4 className="font-paragraph text-lg font-medium text-foreground mb-4">
              Management
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/maintenance" className="font-paragraph text-base text-secondary hover:text-primary transition-colors">
                  Maintenance
                </Link>
              </li>
              <li>
                <Link to="/expenses" className="font-paragraph text-base text-secondary hover:text-primary transition-colors">
                  Expenses
                </Link>
              </li>
              <li>
                <Link to="/analytics" className="font-paragraph text-base text-secondary hover:text-primary transition-colors">
                  Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-paragraph text-lg font-medium text-foreground mb-4">
              Support
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/contact" className="font-paragraph text-base text-secondary hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-muted-accent/30">
          <p className="font-paragraph text-sm text-secondary text-center">
            © {currentYear} FleetFlow. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
