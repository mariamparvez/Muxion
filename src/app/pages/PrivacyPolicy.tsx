import { Link } from "react-router";
import { ArrowLeft, Shield, Lock, Eye, Database, Mail } from "lucide-react";
import { motion } from "motion/react";
import { SEO } from "../components/SEO";

export function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1e] via-[#0f1623] to-[#0a0f1e]">
      <SEO
        title="Privacy Policy - MUXION | Your Data Protection & Privacy Rights"
        description="Read MUXION's Privacy Policy to understand how we collect, use, and protect your personal information. Learn about your privacy rights and data security measures."
        keywords="privacy policy, data protection, user privacy, MUXION privacy, data security, personal information, privacy rights"
      />

      {/* Header */}
      <div className="bg-slate-900/90 backdrop-blur-xl border-b border-blue-500/20 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-slate-100 hover:text-blue-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
          <Shield className="w-6 h-6 text-blue-400" />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Hero */}
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl md:text-5xl font-black text-white">Privacy Policy</h1>
            <p className="text-slate-400 text-lg">
              Last Updated: April 6, 2026
            </p>
            <p className="text-slate-300 max-w-2xl mx-auto">
              At MUXION, we take your privacy seriously. This policy explains how we collect, use, and protect your personal information.
            </p>
          </div>

          {/* Content Sections */}
          <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-blue-500/20 p-8 space-y-8">
            {/* Section 1 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <Database className="w-6 h-6 text-blue-400" />
                <h2 className="text-2xl font-bold text-white">Information We Collect</h2>
              </div>
              <div className="text-slate-300 space-y-4">
                <p>We collect the following types of information:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong className="text-white">Personal Information:</strong> Name, email address, phone number when you create an account</li>
                  <li><strong className="text-white">Payment Information:</strong> Payment details processed securely through Razorpay</li>
                  <li><strong className="text-white">Usage Data:</strong> Course progress, video completion, time spent on platform</li>
                  <li><strong className="text-white">Technical Data:</strong> IP address, browser type, device information for security</li>
                  <li><strong className="text-white">Cookies:</strong> For authentication and user experience</li>
                </ul>
              </div>
            </section>

            {/* Section 2 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <Eye className="w-6 h-6 text-blue-400" />
                <h2 className="text-2xl font-bold text-white">How We Use Your Information</h2>
              </div>
              <div className="text-slate-300 space-y-4">
                <p>Your information is used for:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Providing access to courses and learning materials</li>
                  <li>Processing payments and managing subscriptions</li>
                  <li>Sending course updates and important notifications</li>
                  <li>Improving our platform and user experience</li>
                  <li>Providing customer support</li>
                  <li>Preventing fraud and ensuring platform security</li>
                </ul>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <Lock className="w-6 h-6 text-blue-400" />
                <h2 className="text-2xl font-bold text-white">Data Protection & Security</h2>
              </div>
              <div className="text-slate-300 space-y-4">
                <p>We implement industry-standard security measures:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong className="text-white">Encryption:</strong> All data transmitted is encrypted using SSL/TLS</li>
                  <li><strong className="text-white">Secure Storage:</strong> Personal data is stored in secure, encrypted databases</li>
                  <li><strong className="text-white">Access Control:</strong> Limited access to personal information by authorized personnel only</li>
                  <li><strong className="text-white">Payment Security:</strong> We never store complete payment card details</li>
                  <li><strong className="text-white">Regular Audits:</strong> Security reviews and updates conducted regularly</li>
                </ul>
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-blue-400" />
                <h2 className="text-2xl font-bold text-white">Your Privacy Rights</h2>
              </div>
              <div className="text-slate-300 space-y-4">
                <p>You have the following rights regarding your data:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong className="text-white">Access:</strong> Request a copy of your personal data</li>
                  <li><strong className="text-white">Correction:</strong> Update or correct inaccurate information</li>
                  <li><strong className="text-white">Deletion:</strong> Request deletion of your account and data</li>
                  <li><strong className="text-white">Data Portability:</strong> Receive your data in a structured format</li>
                  <li><strong className="text-white">Opt-Out:</strong> Unsubscribe from marketing communications</li>
                  <li><strong className="text-white">Withdraw Consent:</strong> Withdraw consent for data processing</li>
                </ul>
              </div>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Information Sharing</h2>
              <div className="text-slate-300 space-y-4">
                <p>We <strong className="text-white">DO NOT</strong> sell your personal information. We may share data with:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong className="text-white">Payment Processors:</strong> Razorpay for secure payment processing</li>
                  <li><strong className="text-white">Service Providers:</strong> Trusted third parties for hosting and analytics</li>
                  <li><strong className="text-white">Legal Requirements:</strong> When required by law or to protect rights</li>
                </ul>
                <p className="pt-4">All third parties are bound by strict confidentiality agreements.</p>
              </div>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Cookies & Tracking</h2>
              <div className="text-slate-300 space-y-4">
                <p>We use cookies for:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Authentication and session management</li>
                  <li>Remembering your preferences</li>
                  <li>Analytics to improve our services</li>
                  <li>Security and fraud prevention</li>
                </ul>
                <p className="pt-4">You can control cookies through your browser settings.</p>
              </div>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Data Retention</h2>
              <div className="text-slate-300 space-y-4">
                <p>We retain your data:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>As long as your account is active</li>
                  <li>For legal, tax, and accounting purposes (typically 7 years)</li>
                  <li>Until you request deletion</li>
                </ul>
                <p className="pt-4">After deletion, some data may be retained in backups for up to 90 days.</p>
              </div>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Children's Privacy</h2>
              <div className="text-slate-300 space-y-4">
                <p>
                  MUXION is intended for users 13 years and older. For users under 18, parental consent is recommended.
                  If you believe a child under 13 has provided personal information, please contact us immediately.
                </p>
              </div>
            </section>

            {/* Section 9 */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">International Data Transfers</h2>
              <div className="text-slate-300 space-y-4">
                <p>
                  Your data may be processed in India or other countries where our service providers operate.
                  We ensure adequate safeguards are in place for international data transfers.
                </p>
              </div>
            </section>

            {/* Section 10 */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Changes to Privacy Policy</h2>
              <div className="text-slate-300 space-y-4">
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of significant changes via email or platform notification.
                  Continued use of MUXION after changes constitutes acceptance of the updated policy.
                </p>
              </div>
            </section>

            {/* Contact Section */}
            <section className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Mail className="w-6 h-6 text-blue-400" />
                <h2 className="text-2xl font-bold text-white">Contact Us</h2>
              </div>
              <div className="text-slate-300 space-y-2">
                <p>For privacy-related questions or to exercise your rights:</p>
                <p><strong className="text-white">Email:</strong> <a href="mailto:designwithmariam@gmail.com" className="text-blue-400 hover:underline">designwithmariam@gmail.com</a></p>
                <p><strong className="text-white">Phone:</strong> <a href="tel:+918807557977" className="text-blue-400 hover:underline">+91 8807557977</a></p>
                <p><strong className="text-white">Website:</strong> <a href="https://muxion.in" className="text-blue-400 hover:underline">muxion.in</a></p>
              </div>
            </section>
          </div>

          {/* Footer Links */}
          <div className="flex flex-wrap justify-center gap-6 pt-8 border-t border-blue-500/20">
            <Link to="/terms" className="text-blue-400 hover:text-blue-300 hover:underline">
              Terms & Conditions
            </Link>
            <Link to="/disclaimer" className="text-blue-400 hover:text-blue-300 hover:underline">
              Disclaimer
            </Link>
            <Link to="/csr-policy" className="text-blue-400 hover:text-blue-300 hover:underline">
              CSR Policy
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
