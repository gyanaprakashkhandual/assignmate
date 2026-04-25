"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const cookieTypes = [
  {
    name: "Strictly Necessary",
    required: true,
    description: "Essential for the Service to function. Cannot be disabled.",
    examples: [
      "Authentication tokens (JWT)",
      "Session identifiers",
      "CSRF protection tokens",
      "Load balancer cookies",
    ],
  },
  {
    name: "Functional",
    required: false,
    description: "Remember your preferences and personalize your experience.",
    examples: [
      "Theme preference (light/dark)",
      "Language settings",
      "Last selected paper style",
      "Dashboard layout preferences",
    ],
  },
  {
    name: "Analytics",
    required: false,
    description:
      "Help us understand how you use the Service so we can improve it.",
    examples: [
      "Page view counts",
      "Feature usage patterns",
      "Error reporting",
      "Performance metrics",
    ],
  },
  {
    name: "Marketing",
    required: false,
    description:
      "Used to show relevant content and measure campaign effectiveness.",
    examples: [
      "Referral source tracking",
      "Conversion tracking",
      "Ad frequency capping",
    ],
  },
];

const sections = [
  {
    id: "what-are-cookies",
    title: "1. What Are Cookies?",
    content: `Cookies are small text files placed on your device when you visit a website. They are widely used to make websites work efficiently and to provide information to website owners. Cookies allow the website to recognize your device on subsequent visits and remember your preferences and actions over time.`,
  },
  {
    id: "how-we-use",
    title: "2. How We Use Cookies",
    content: `Assignmate uses cookies and similar tracking technologies (such as local storage and session storage) to operate our Service, maintain your logged-in session, remember your preferences (such as dark mode), and analyze how our Service is used. We use this information to improve the platform experience for all users.`,
  },
  {
    id: "types",
    title: "3. Types of Cookies We Use",
    content: `We use four categories of cookies: Strictly Necessary cookies that are required for the Service to function; Functional cookies that remember your choices and preferences; Analytics cookies that help us understand usage patterns and improve the Service; and Marketing cookies used to measure the effectiveness of our campaigns. See the table below for specific examples.`,
  },
  {
    id: "third-party",
    title: "4. Third-Party Cookies",
    content: `Some cookies on Assignmate are set by third-party services we use, including: our analytics provider for aggregated, anonymized usage data; our payment processor for secure billing sessions; and our cloud infrastructure provider for performance and security. These third parties have their own privacy policies governing the use of cookies they set.`,
  },
  {
    id: "duration",
    title: "5. Cookie Duration",
    content: `Cookies can be either session cookies, which are deleted when you close your browser, or persistent cookies, which remain on your device for a specified period. Session cookies are used for authentication and form submissions. Persistent cookies are used for preference storage (up to 1 year) and analytics (up to 13 months). All cookie durations are set in accordance with applicable privacy regulations.`,
  },
  {
    id: "managing",
    title: "6. Managing Your Cookie Preferences",
    content: `You can control and manage cookies in several ways: through the Assignmate cookie preference center (accessible via the cookie banner or your account settings); through your browser settings, where you can block, delete, or restrict cookies for all websites; and by opting out of third-party analytics via your browser's privacy settings or via opt-out tools provided by those third parties. Note that disabling strictly necessary cookies will prevent the Service from functioning correctly.`,
  },
  {
    id: "browser-controls",
    title: "7. Browser-Level Cookie Controls",
    content: `Most browsers allow you to view, manage, block, and delete cookies through their settings menus. Here are links to instructions for common browsers: Chrome (Settings → Privacy and security → Cookies); Firefox (Preferences → Privacy & Security); Safari (Preferences → Privacy); Edge (Settings → Cookies and site permissions). Clearing cookies will log you out of Assignmate and reset your preferences.`,
  },
  {
    id: "consent",
    title: "8. Your Consent",
    content: `When you first visit Assignmate, we display a cookie consent banner that allows you to accept all cookies, reject non-essential cookies, or customize your preferences by category. Your choices are stored and respected on all subsequent visits. You may update your preferences at any time through your account settings. Strictly necessary cookies do not require your consent as they are essential for the Service to function.`,
  },
  {
    id: "changes",
    title: "9. Changes to This Policy",
    content: `We may update this Cookie Policy from time to time to reflect changes in technology, regulation, or our business practices. When we make significant changes, we will update the "Last updated" date and notify you via a prominent notice on the Service. We encourage you to review this Policy periodically to stay informed about how we use cookies.`,
  },
  {
    id: "contact",
    title: "10. Contact Us",
    content: `If you have questions about our use of cookies or this Cookie Policy, please contact us at privacy@assignmate.app. We welcome all questions and will respond within 5 business days.`,
  },
];

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden">
        <Image
          src="https://res.cloudinary.com/dvytvjplt/image/upload/v1777107090/Gemini_Generated_Image_8v5dbn8v5dbn8v5d_ohhe3g.png"
          alt="Cookie Policy"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-b from-zinc-900/30 via-zinc-900/40 to-white dark:to-zinc-950" />
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-10 px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/70 mb-3">
              Legal
            </p>
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight drop-shadow-sm"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Cookie Policy
            </h1>
            <p className="text-sm text-white/70 mt-3">
              Last updated: April 25, 2026
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          <aside className="lg:w-64 shrink-0">
            <div className="lg:sticky lg:top-24">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-400 dark:text-zinc-600 mb-4">
                Contents
              </p>
              <nav className="space-y-1">
                {sections.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="flex items-center gap-2 py-1.5 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors group"
                  >
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-1 transition-all group-hover:translate-x-0.5" />
                    <span>{s.title}</span>
                  </a>
                ))}
              </nav>

              <div className="mt-8 pt-8 border-t border-zinc-100 dark:border-zinc-900">
                <p className="text-xs text-zinc-400 dark:text-zinc-600 mb-3">
                  Related policies
                </p>
                <div className="space-y-1.5">
                  <Link
                    href="/terms-and-conditions"
                    className="block text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                  >
                    Terms & Conditions →
                  </Link>
                  <Link
                    href="/privacy-policy"
                    className="block text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                  >
                    Privacy Policy →
                  </Link>
                </div>
              </div>
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-10 p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800"
            >
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                This Cookie Policy explains how Assignmate uses cookies and
                similar tracking technologies when you use our Service. We
                respect your right to privacy and give you control over the
                cookies we place on your device.
              </p>
            </motion.div>

            <div className="space-y-12">
              {sections.map((section, i) => (
                <motion.div
                  key={section.id}
                  id={section.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: i * 0.04 }}
                  className="scroll-mt-24"
                >
                  <h2
                    className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white mb-4"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {section.title}
                  </h2>
                  <div className="h-px bg-zinc-100 dark:bg-zinc-800 mb-5" />
                  <p className="text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {section.content}
                  </p>

                  {section.id === "types" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="mt-6 space-y-4"
                    >
                      {cookieTypes.map((ct) => (
                        <div
                          key={ct.name}
                          className="rounded-xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h3
                              className="text-sm font-bold text-zinc-900 dark:text-white"
                              style={{
                                fontFamily: "'Playfair Display', serif",
                              }}
                            >
                              {ct.name}
                            </h3>
                            <span
                              className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${
                                ct.required
                                  ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900"
                                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
                              }`}
                            >
                              {ct.required ? "Required" : "Optional"}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3">
                            {ct.description}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {ct.examples.map((ex) => (
                              <span
                                key={ex}
                                className="text-xs px-2.5 py-1 rounded-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400"
                              >
                                {ex}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mt-12 p-6 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900"
            >
              <h3
                className="text-base font-bold mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Manage Your Preferences
              </h3>
              <p className="text-sm text-zinc-400 dark:text-zinc-600 mb-4">
                You can update your cookie preferences at any time from your
                account settings or by clicking below.
              </p>
              <button className="px-5 py-2.5 rounded-full bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-xs font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                Open Cookie Preferences
              </button>
            </motion.div>

            <div className="mt-16 pt-10 border-t border-zinc-100 dark:border-zinc-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <p className="text-xs text-zinc-400 dark:text-zinc-600">
                © {new Date().getFullYear()} Assignmate. All rights reserved.
              </p>
              <div className="flex items-center gap-4">
                <Link
                  href="/terms-and-conditions"
                  className="text-xs text-zinc-400 dark:text-zinc-600 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                >
                  Terms & Conditions
                </Link>
                <Link
                  href="/privacy-policy"
                  className="text-xs text-zinc-400 dark:text-zinc-600 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                >
                  Privacy Policy
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
