"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { PenLine, ArrowLeft, ChevronRight } from "lucide-react";

const sections = [
  {
    id: "overview",
    title: "1. Overview",
    content: `Assignmate ("we", "our", or "us") is committed to protecting your personal information. This Privacy Policy explains what data we collect, how we use it, and the choices you have regarding your information when you use our AI-powered handwriting generation service. By using Assignmate, you agree to the practices described in this Policy.`,
  },
  {
    id: "data-collected",
    title: "2. Data We Collect",
    content: `We collect the following categories of information: (a) Account Data — your name, email address, and hashed password when you register; (b) Handwriting Data — photos of your handwriting that you voluntarily upload, and the AI-extracted style parameters derived from them; (c) Assignment Data — questions, topics, and generated assignment text associated with your account; (d) Usage Data — pages visited, features used, device type, browser type, and approximate geographic location derived from IP address; (e) Payment Data — billing information processed by our secure payment provider; we never store full card numbers.`,
  },
  {
    id: "how-we-use",
    title: "3. How We Use Your Data",
    content: `We use your data solely to provide and improve the Assignmate service. Specifically: to authenticate your account and maintain session security; to process handwriting photos and generate personalized fonts and PDFs; to store and retrieve your assignment history; to improve the accuracy and quality of our AI models using anonymized, aggregated data only; to send transactional emails such as password resets and account confirmations; and to respond to support requests.`,
  },
  {
    id: "data-sharing",
    title: "4. Data Sharing & Third Parties",
    content: `We do not sell your personal data. We share limited data only with trusted service providers necessary to operate the Service: Cloudinary for secure cloud storage of uploaded images and generated PDFs; our AI provider (Anthropic) for text generation and vision analysis — data sent to the AI is processed per Anthropic's API privacy terms and is not used to train their models when accessed via API; our payment processor for billing; and analytics providers on an anonymized, aggregated basis only. All third parties are contractually bound to handle your data securely.`,
  },
  {
    id: "handwriting-data",
    title: "5. Handwriting Data & AI Processing",
    content: `Your handwriting photos are sensitive personal data. They are stored encrypted in Cloudinary and accessible only to you and our backend systems. We use them exclusively to generate your personalized handwriting profile. We do not share your handwriting photos with any other user. If you delete your handwriting profile, all associated photos and style parameters are permanently removed from our systems within 30 days.`,
  },
  {
    id: "retention",
    title: "6. Data Retention",
    content: `We retain account data for as long as your account is active. Generated PDFs are retained for 30 days by default, after which they are automatically deleted unless you mark them as saved. Handwriting profiles are retained until you delete them. If you delete your account, all associated personal data is permanently removed within 30 days, except where retention is required by law.`,
  },
  {
    id: "security",
    title: "7. Security",
    content: `We implement industry-standard security measures to protect your data: all data is encrypted in transit using TLS; passwords are hashed using bcrypt; API keys are stored server-side and never exposed to the frontend; JWT tokens expire after 7 days; rate limiting is applied to all sensitive endpoints; and file uploads are validated for type and size. While we take all reasonable precautions, no system is 100% secure, and we encourage you to use a strong, unique password.`,
  },
  {
    id: "your-rights",
    title: "8. Your Rights",
    content: `Depending on your jurisdiction, you may have the right to: access the personal data we hold about you; correct inaccurate data; request deletion of your data ("right to be forgotten"); restrict or object to certain processing; and data portability. To exercise any of these rights, contact us at privacy@assignmate.app. We will respond within 30 days. Users in the European Economic Area and United Kingdom have rights under GDPR; users in California have rights under CCPA.`,
  },
  {
    id: "cookies",
    title: "9. Cookies",
    content: `We use cookies and similar technologies to maintain your session, remember your preferences, and analyze usage patterns. Please refer to our Cookie Policy for full details on the types of cookies we use and how to manage them. You can control cookie settings through your browser at any time.`,
  },
  {
    id: "children",
    title: "10. Children's Privacy",
    content: `Assignmate is not directed at children under the age of 13. We do not knowingly collect personal data from children under 13. If we become aware that a child under 13 has provided us with personal information, we will take steps to delete that information promptly. If you believe a child has provided us with their data, please contact us immediately.`,
  },
  {
    id: "international",
    title: "11. International Transfers",
    content: `Assignmate is operated from India. If you access the Service from outside India, your data may be transferred to and processed in India and other countries where our service providers operate. We ensure that such transfers are protected by appropriate safeguards in accordance with applicable data protection laws.`,
  },
  {
    id: "changes",
    title: "12. Changes to This Policy",
    content: `We may update this Privacy Policy periodically. We will notify you of significant changes via email or a prominent in-app notice at least 14 days before they take effect. The "Last updated" date at the top of this page reflects the most recent revision. Your continued use of the Service after changes take effect constitutes acceptance of the revised Policy.`,
  },
  {
    id: "contact",
    title: "13. Contact & DPO",
    content: `For privacy-related questions, data requests, or concerns, contact our Privacy team at privacy@assignmate.app. For GDPR-related requests, you may also contact our Data Protection Officer at dpo@assignmate.app. We aim to respond to all requests within 5 business days and resolve them within 30 days.`,
  },
];

export default function PrivacyPage() {
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
          src="https://res.cloudinary.com/dvytvjplt/image/upload/v1777107090/Gemini_Generated_Image_8v5dbn8v5dbn8v5d_ohhe3g.png"
          alt="Privacy Policy"
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
              Privacy Policy
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
                {sections.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="flex items-center gap-2 py-1.5 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors group"
                  >
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-1 transition-all group-hover:translate-x-0.5" />
                    <span style={{ fontFamily: "'Lora', serif" }}>
                      {s.title}
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
                    href="/terms"
                    className="block text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                    style={{ fontFamily: "'Lora', serif" }}
                  >
                    Terms & Conditions →
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
                Your privacy matters to us. This Policy explains exactly what
                data Assignmate collects, why we collect it, and how it is
                protected. We never sell your personal data to third parties.
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
                  href="/terms"
                  className="text-xs text-zinc-400 dark:text-zinc-600 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                >
                  Terms & Conditions
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
