"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { PenLine, ArrowLeft, ChevronRight } from "lucide-react";

const sections = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    content: `By accessing or using Assignmate ("the Service"), you confirm that you are at least 13 years of age and agree to be bound by these Terms and Conditions. If you are using the Service on behalf of an organization, you represent that you have the authority to bind that organization to these Terms. If you do not agree with any part of these Terms, you may not access the Service.`,
  },
  {
    id: "description",
    title: "2. Description of Service",
    content: `Assignmate is an AI-powered platform that converts typed text into realistic handwritten documents matching the user's personal handwriting style. The Service includes handwriting profile creation, AI-generated assignment text, canvas-based rendering, PDF export, and assignment history management. We reserve the right to modify, suspend, or discontinue the Service at any time with reasonable notice.`,
  },
  {
    id: "accounts",
    title: "3. User Accounts",
    content: `You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account. We reserve the right to terminate accounts that violate these Terms, engage in fraudulent activity, or are inactive for extended periods. You may not create multiple accounts to circumvent restrictions.`,
  },
  {
    id: "acceptable-use",
    title: "4. Acceptable Use Policy",
    content: `You agree not to use Assignmate for any unlawful purpose or in any way that could harm the Service or its users. Prohibited uses include: submitting academic work as your own in violation of your institution's honor code or academic integrity policies; uploading malicious files or content; attempting to reverse engineer, scrape, or exploit the Service; impersonating other users or entities; and distributing generated content for commercial resale without authorization.`,
  },
  {
    id: "ip",
    title: "5. Intellectual Property",
    content: `The Assignmate platform, including its design, codebase, AI models, and branding, is owned by Assignmate and protected by applicable intellectual property laws. Content you generate using the Service — including handwriting profiles and exported PDFs — remains your property. However, you grant Assignmate a limited, non-exclusive license to process and store your content solely to provide the Service. You may not copy, modify, or distribute the platform itself.`,
  },
  {
    id: "privacy",
    title: "6. Privacy & Data",
    content: `Your use of the Service is also governed by our Privacy Policy, which is incorporated into these Terms by reference. We collect, store, and process your data as described in the Privacy Policy. Handwriting profiles and generated PDFs are stored securely and are accessible only to you. We do not sell your personal data to third parties.`,
  },
  {
    id: "ai",
    title: "7. AI-Generated Content",
    content: `Assignmate uses AI to generate assignment text and analyze handwriting. AI-generated content may not always be accurate, complete, or appropriate for every context. You are solely responsible for reviewing and verifying any AI-generated content before use. Assignmate makes no warranty that generated content will meet academic requirements or pass any plagiarism or authenticity detection system.`,
  },
  {
    id: "payment",
    title: "8. Payments & Subscriptions",
    content: `Certain features of Assignmate may require a paid subscription. Subscription fees are billed in advance on a monthly or annual basis. All fees are non-refundable except where required by law. We reserve the right to change pricing with 30 days' notice. Your continued use of paid features after a price change constitutes your acceptance of the new pricing.`,
  },
  {
    id: "liability",
    title: "9. Limitation of Liability",
    content: `To the maximum extent permitted by law, Assignmate shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of data, revenue, or academic standing, arising from your use of the Service. Our total liability to you for any claim arising from these Terms shall not exceed the amount you paid us in the 12 months preceding the claim.`,
  },
  {
    id: "termination",
    title: "10. Termination",
    content: `Either party may terminate the agreement at any time. You may delete your account through the dashboard. We may suspend or terminate your access if you violate these Terms, with or without prior notice. Upon termination, your right to use the Service ceases immediately. Data deletion requests will be processed in accordance with our Privacy Policy and applicable law.`,
  },
  {
    id: "changes",
    title: "11. Changes to Terms",
    content: `We may update these Terms from time to time. We will notify you of material changes by email or by displaying a prominent notice in the Service. Your continued use of Assignmate after changes become effective constitutes your acceptance of the updated Terms. We encourage you to review these Terms periodically.`,
  },
  {
    id: "contact",
    title: "12. Contact Us",
    content: `If you have any questions about these Terms and Conditions, please contact us at legal@assignmate.app or write to us at Assignmate Legal, Mumbai, Maharashtra, India. We will respond to all inquiries within 5 business days.`,
  },
];

const tableOfContents = sections.map((s) => ({ id: s.id, title: s.title }));

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded-lg bg-zinc-900 dark:bg-white flex items-center justify-center transition-transform group-hover:rotate-6">
              <PenLine className="w-3.5 h-3.5 text-white dark:text-zinc-900" />
            </div>
            <span
              className="text-sm font-bold tracking-tight text-zinc-900 dark:text-white"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Assignmate
            </span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Back to Home
          </Link>
        </div>
      </header>

      <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden">
        <Image
          src="https://res.cloudinary.com/dvytvjplt/image/upload/v1777107019/Gemini_Generated_Image_6u6xuj6u6xuj6u6x_w73jhv.png"
          alt="Terms and Conditions"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/30 via-zinc-900/40 to-white dark:to-zinc-950" />
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
              Terms & Conditions
            </h1>
            <p
              className="text-sm text-white/70 mt-3"
              style={{ fontFamily: "'Lora', serif" }}
            >
              Last updated: April 25, 2026
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          <aside className="lg:w-64 flex-shrink-0">
            <div className="lg:sticky lg:top-24">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-400 dark:text-zinc-600 mb-4">
                Contents
              </p>
              <nav className="space-y-1">
                {tableOfContents.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="flex items-center gap-2 py-1.5 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors group"
                  >
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-1 transition-all group-hover:translate-x-0.5" />
                    <span style={{ fontFamily: "'Lora', serif" }}>
                      {item.title}
                    </span>
                  </a>
                ))}
              </nav>

              <div className="mt-8 pt-8 border-t border-zinc-100 dark:border-zinc-900">
                <p
                  className="text-xs text-zinc-400 dark:text-zinc-600 mb-3"
                  style={{ fontFamily: "'Lora', serif" }}
                >
                  Related policies
                </p>
                <div className="space-y-1.5">
                  <Link
                    href="/privacy"
                    className="block text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                    style={{ fontFamily: "'Lora', serif" }}
                  >
                    Privacy Policy →
                  </Link>
                  <Link
                    href="/cookies"
                    className="block text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                    style={{ fontFamily: "'Lora', serif" }}
                  >
                    Cookie Policy →
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
              <p
                className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed"
                style={{ fontFamily: "'Lora', serif" }}
              >
                Please read these Terms and Conditions carefully before using
                Assignmate. These Terms govern your access to and use of our
                AI-powered handwriting generation service. By using the Service,
                you agree to be bound by these Terms.
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
                  <p
                    className="text-base text-zinc-600 dark:text-zinc-400 leading-relaxed"
                    style={{ fontFamily: "'Lora', serif" }}
                  >
                    {section.content}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="mt-16 pt-10 border-t border-zinc-100 dark:border-zinc-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <p
                className="text-xs text-zinc-400 dark:text-zinc-600"
                style={{ fontFamily: "'Lora', serif" }}
              >
                © {new Date().getFullYear()} Assignmate. All rights reserved.
              </p>
              <div className="flex items-center gap-4">
                <Link
                  href="/privacy"
                  className="text-xs text-zinc-400 dark:text-zinc-600 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/cookies"
                  className="text-xs text-zinc-400 dark:text-zinc-600 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                >
                  Cookie Policy
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
