import { Link } from "react-router";
import { ArrowLeft, FileText, Shield, AlertTriangle } from "lucide-react";
import { motion } from "motion/react";
import { SEO } from "../components/SEO";

export function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1e] via-[#0f1623] to-[#0a0f1e]">
      <SEO
        title="Terms & Conditions - MUXION | User Agreement & Guidelines"
        description="Read MUXION's Terms and Conditions. Understand the rules, guidelines, and legal agreements for using our online learning platform."
        keywords="terms and conditions, user agreement, terms of service, MUXION terms, user guidelines, legal terms"
      />

      <div className="bg-slate-900/90 backdrop-blur-xl border-b border-blue-500/20 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-slate-100 hover:text-blue-400 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
          <FileText className="w-6 h-6 text-blue-400" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl md:text-5xl font-black text-white">Terms & Conditions</h1>
            <p className="text-slate-400 text-lg">Last Updated: April 6, 2026</p>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-blue-500/20 p-8 space-y-8 text-slate-300">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
              <p>By accessing and using MUXION (muxion.in), you accept and agree to be bound by these Terms and Conditions. If you do not agree, please do not use our services.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Service Description</h2>
              <p>MUXION provides online courses in UI/UX Design, Figma, Adobe Creative Suite, and academic subjects (Maths, Physics, Chemistry). Courses include video lessons, resources, and lifetime access upon purchase.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. User Accounts</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>You must be 13+ to create an account (parental consent required under 18)</li>
                <li>Provide accurate, current information</li>
                <li>Keep your password secure</li>
                <li>You are responsible for all activity under your account</li>
                <li>One account per user; sharing accounts is prohibited</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Payments & Pricing</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>All prices are in Indian Rupees (₹)</li>
                <li>Payment via Razorpay gateway</li>
                <li>One-time payment for lifetime access (unless specified as subscription)</li>
                <li>Prices may change; existing purchases unaffected</li>
                <li>No automatic renewals unless explicitly agreed</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Refund Policy</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>7-day money-back guarantee if unsatisfied</li>
                <li>Must not have completed more than 20% of course</li>
                <li>Refunds processed within 7-10 business days</li>
                <li>Contact: designwithmariam@gmail.com</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. Intellectual Property</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>All content is owned by MUXION or licensors</li>
                <li>Personal, non-commercial use only</li>
                <li>No downloading, copying, or redistributing</li>
                <li>No recording or screenshotting videos</li>
                <li>Violation may result in account termination</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. User Conduct</h2>
              <p>You agree NOT to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Share account credentials</li>
                <li>Upload malicious content</li>
                <li>Attempt to hack or disrupt services</li>
                <li>Use content for commercial purposes</li>
                <li>Harass other users or instructors</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">8. Content Disclaimer</h2>
              <p>Courses are provided "as is". While we strive for accuracy, we don't guarantee:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Specific learning outcomes or job placement</li>
                <li>Error-free or uninterrupted access</li>
                <li>Complete accuracy of all content</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">9. Limitation of Liability</h2>
              <p>MUXION shall not be liable for:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Indirect, incidental, or consequential damages</li>
                <li>Loss of profits or data</li>
                <li>Service interruptions</li>
                <li>Third-party actions</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">10. Termination</h2>
              <p>We may suspend or terminate your account if you:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Violate these Terms</li>
                <li>Engage in fraudulent activity</li>
                <li>Abuse the platform</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">11. Governing Law</h2>
              <p>These Terms are governed by the laws of India. Disputes shall be resolved in Indian courts.</p>
            </section>

            <section className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Contact</h2>
              <p><strong className="text-white">Email:</strong> <a href="mailto:designwithmariam@gmail.com" className="text-blue-400 hover:underline">designwithmariam@gmail.com</a></p>
              <p><strong className="text-white">Phone:</strong> <a href="tel:+918807557977" className="text-blue-400 hover:underline">+91 8807557977</a></p>
            </section>
          </div>

          <div className="flex flex-wrap justify-center gap-6 pt-8 border-t border-blue-500/20">
            <Link to="/privacy" className="text-blue-400 hover:text-blue-300 hover:underline">Privacy Policy</Link>
            <Link to="/disclaimer" className="text-blue-400 hover:text-blue-300 hover:underline">Disclaimer</Link>
            <Link to="/csr-policy" className="text-blue-400 hover:text-blue-300 hover:underline">CSR Policy</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
