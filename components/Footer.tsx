import Link from "next/link";
import { Ticket, Mail, Twitter, Instagram, Facebook } from "lucide-react";

const links = {
  platform: [
    { label: "Browse Events", href: "/" },
    { label: "My Tickets", href: "/dashboard" },
    { label: "Sell Tickets", href: "/seller/dashboard" },
    { label: "Resale Market", href: "/search" },
  ],
  support: [
    { label: "Help Center", href: "#" },
    { label: "Contact Us", href: "#" },
    { label: "Report an Issue", href: "#" },
    { label: "Refund Policy", href: "#" },
  ],
  legal: [
    { label: "Terms of Service", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Cookie Policy", href: "#" },
  ],
};

const socials = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Mail, href: "#", label: "Email" },
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <Ticket className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-bold text-lg">Ticket</span>
            </div>
            <p className="text-sm leading-relaxed mb-5">
              Ethiopia&apos;s premier event ticketing platform. Buy, sell, and
              resell tickets with ease. Pay via Chapa or Stripe.
            </p>
            <div className="flex items-center gap-3">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 hover:text-white transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Platform</h3>
            <ul className="space-y-2.5">
              {links.platform.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Support</h3>
            <ul className="space-y-2.5">
              {links.support.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Legal</h3>
            <ul className="space-y-2.5">
              {links.legal.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
            {/* Payment badges */}
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="px-2.5 py-1 bg-gray-800 rounded text-xs font-medium text-gray-300">
                Chapa
              </span>
              <span className="px-2.5 py-1 bg-gray-800 rounded text-xs font-medium text-gray-300">
                Stripe
              </span>
              <span className="px-2.5 py-1 bg-gray-800 rounded text-xs font-medium text-gray-300">
                Telebirr
              </span>
              <span className="px-2.5 py-1 bg-gray-800 rounded text-xs font-medium text-gray-300">
                CBE Birr
              </span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs">
            © {new Date().getFullYear()} Ticket. All rights reserved.
          </p>
          <p className="text-xs">
            Made with ❤️ in Ethiopia
          </p>
        </div>
      </div>
    </footer>
  );
}
