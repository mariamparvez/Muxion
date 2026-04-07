import { Link } from "react-router";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { motion } from "motion/react";
import { SEO } from "../components/SEO";

export function Disclaimer() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1e] via-[#0f1623] to-[#0a0f1e]">
      <SEO
        title="Disclaimer - MUXION | Legal Notices & Limitations"
        description="Read MUXION's disclaimer to understand limitations, warranties, and legal notices regarding our online courses and services."
        keywords="disclaimer, legal notice, limitations, warranties, MUXION disclaimer"
      />

      <div className="bg-slate-900/90 backdrop-blur-xl border-b border-blue-500/20 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-slate-100 hover:text-blue-400 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
          <AlertTriangle className="w-6 h-6 text-yellow-400" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl md:text-5xl font-black text-white">Disclaimer</h1>
            <p className="text-slate-400 text-lg">Last Updated: April 6, 2026</p>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-blue-500/20 p-8 space-y-8 text-slate-300">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">General Information</h2>
              <p>The information provided on MUXION (muxion.in) is for educational purposes only. While we strive to provide accurate and up-to-date content, we make no representations or warranties of any kind.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">No Professional Advice</h2>
              <p>Content on MUXION does not constitute professional advice. Before making career or business decisions based on our courses:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Consult with qualified professionals</li>
                <li>Conduct your own research</li>
                <li>Verify information independently</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">No Employment Guarantee</h2>
              <p>MUXION courses are designed to provide skills and knowledge. However:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>We do not guarantee job placement</li>
                <li>Results may vary based on individual effort</li>
                <li>Success depends on personal application of learned skills</li>
                <li>Market conditions affect employment opportunities</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Third-Party Links</h2>
              <p>Our platform may contain links to external websites. We are not responsible for:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Content on third-party sites</li>
                <li>Privacy policies of external websites</li>
                <li>Security of linked sites</li>
                <li>Accuracy of external information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Technical Issues</h2>
              <p>We strive for 99.9% uptime but cannot guarantee uninterrupted access. Not liable for:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Service interruptions or downtime</li>
                <li>Data loss due to technical failures</li>
                <li>Compatibility issues with user devices</li>
                <li>Internet connectivity problems</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Content Accuracy</h2>
              <p>While instructors are experienced professionals:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Content may become outdated as technology evolves</li>
                <li>Examples are for educational purposes only</li>
                <li>Real-world applications may vary</li>
                <li>We update content regularly but cannot guarantee real-time accuracy</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Payment Processing</h2>
              <p>Payments are processed through Razorpay. We are not responsible for:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Payment gateway errors or delays</li>
                <li>Bank processing times</li>
                <li>Transaction fees charged by payment providers</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">User-Generated Content</h2>
              <p>If users post comments or reviews:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Views expressed are those of individual users</li>
                <li>We do not endorse user opinions</li>
                <li>We reserve the right to moderate content</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Changes to Content</h2>
              <p>We reserve the right to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Modify or remove course content</li>
                <li>Update curriculum without notice</li>
                <li>Discontinue courses (with advance notice to enrolled students)</li>
                <li>Change pricing for new enrollments</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Limitation of Liability</h2>
              <p>To the maximum extent permitted by law, MUXION shall not be liable for:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Any direct, indirect, incidental damages</li>
                <li>Loss of profits, data, or opportunities</li>
                <li>Consequences of decisions made based on our content</li>
                <li>Actions of third parties</li>
              </ul>
            </section>

            <section className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Important Note</h2>
              <p className="text-white">
                By using MUXION, you acknowledge that you have read and understood this disclaimer and agree to its terms.
                If you do not agree, please discontinue use of our services.
              </p>
            </section>

            <section className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Contact</h2>
              <p>For questions about this disclaimer:</p>
              <p><strong className="text-white">Email:</strong> <a href="mailto:designwithmariam@gmail.com" className="text-blue-400 hover:underline">designwithmariam@gmail.com</a></p>
              <p><strong className="text-white">Phone:</strong> <a href="tel:+918807557977" className="text-blue-400 hover:underline">+91 8807557977</a></p>
            </section>
          </div>

          <div className="flex flex-wrap justify-center gap-6 pt-8 border-t border-blue-500/20">
            <Link to="/privacy" className="text-blue-400 hover:text-blue-300 hover:underline">Privacy Policy</Link>
            <Link to="/terms" className="text-blue-400 hover:text-blue-300 hover:underline">Terms & Conditions</Link>
            <Link to="/csr-policy" className="text-blue-400 hover:text-blue-300 hover:underline">CSR Policy</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
