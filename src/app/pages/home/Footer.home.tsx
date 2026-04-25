import Link from "next/link";
import { PenLine, Mail } from "lucide-react";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

const footerLinks = {
  Product: [
    { label: "Caffetest", href: "https://caffetest.vercel.app" },
    { label: "Fetch", href: "https://fectch.vercel.app" },
    { label: "Feel", href: "https://feel.vercel.app" },
    { label: "Todo", href: "https://toodoooo.vercel.app" },
  ],
  Resources: [
    { label: "Documentation", href: "https://www.docs.metronique.com" },
    { label: "API Reference", href: "https://www.apis.metronique.com" },
    { label: "Blog", href: "https://www.blogs.metronique.com" },
    { label: "Support", href: "https://www.support.metronique.com" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

const socials = [
  { icon: FaTwitter, href: "https://twitter.com", label: "Twitter" },
  {
    icon: FaGithub,
    href: "https://github.com/gyanaprakashkhandual",
    label: "GitHub",
  },
  {
    icon: FaLinkedin,
    href: "https://linkedin.com/in/gyanaprakashkhandual",
    label: "LinkedIn",
  },
  { icon: Mail, href: "mailto:gyanaprakashkhnadual@gmail.com", label: "Email" },
];

export default function Footer() {
  return (
    <footer className="bg-zinc-950 dark:bg-zinc-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16 lg:py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                <PenLine className="w-4 h-4 text-zinc-900" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                Assignmate
              </span>
            </Link>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-xs mb-6">
              Convert typed text into realistic handwritten documents that match
              your own writing style. Powered by AI.
            </p>
            <div className="flex items-center gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white hover:border-zinc-600 transition-all duration-200"
                >
                  <s.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500 mb-5">
                {section}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-zinc-400 hover:text-white transition-colors duration-150"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="py-6 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} Assignmate. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link
              href="/privacy-policy"
              className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms-and-conditions"
              className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/cookies-policy"
              className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
