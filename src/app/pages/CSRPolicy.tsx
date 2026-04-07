import { Link } from "react-router";
import { ArrowLeft, Heart, Users, GraduationCap, Globe } from "lucide-react";
import { motion } from "motion/react";
import { SEO } from "../components/SEO";

export function CSRPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1e] via-[#0f1623] to-[#0a0f1e]">
      <SEO
        title="CSR Policy - MUXION | Corporate Social Responsibility & Community Impact"
        description="Learn about MUXION's Corporate Social Responsibility initiatives, community programs, and commitment to accessible education in India and Pakistan."
        keywords="CSR policy, corporate social responsibility, community programs, MUXION CSR, social impact, education accessibility"
      />

      <div className="bg-slate-900/90 backdrop-blur-xl border-b border-blue-500/20 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-slate-100 hover:text-blue-400 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
          <Heart className="w-6 h-6 text-pink-400" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl md:text-5xl font-black text-white">CSR Policy</h1>
            <p className="text-slate-400 text-lg">Corporate Social Responsibility</p>
            <p className="text-slate-300 max-w-2xl mx-auto">
              At MUXION, we believe in giving back to society and making quality education accessible to all.
            </p>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-blue-500/20 p-8 space-y-8 text-slate-300">
            <section>
              <div className="flex items-center gap-3 mb-4">
                <Globe className="w-6 h-6 text-blue-400" />
                <h2 className="text-2xl font-bold text-white">Our Vision</h2>
              </div>
              <p>
                To democratize design education and empower individuals across India with skills that transform careers and lives.
                We strive to bridge the digital divide and create opportunities for underserved communities.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <GraduationCap className="w-6 h-6 text-blue-400" />
                <h2 className="text-2xl font-bold text-white">Education Accessibility</h2>
              </div>
              <p className="mb-4">MUXION is committed to making education accessible through:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong className="text-white">Affordable Pricing:</strong> Courses starting at ₹299, significantly lower than industry standards</li>
                <li><strong className="text-white">Free Preview Lessons:</strong> First lesson free for every course to help students make informed decisions</li>
                <li><strong className="text-white">Lifetime Access:</strong> No recurring fees - one payment, forever access</li>
                <li><strong className="text-white">Regional Language Support:</strong> Content available in English with Hindi/Urdu support where applicable</li>
                <li><strong className="text-white">Mobile-Friendly Platform:</strong> Learn from any device, even with limited internet</li>
              </ul>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-6 h-6 text-blue-400" />
                <h2 className="text-2xl font-bold text-white">Scholarship Programs</h2>
              </div>
              <p className="mb-4">We offer scholarships to deserving students:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong className="text-white">Need-Based Scholarships:</strong> For students who cannot afford courses</li>
                <li><strong className="text-white">Merit Scholarships:</strong> For exceptional talent and dedication</li>
                <li><strong className="text-white">Women in Tech:</strong> Special discounts for women pursuing design careers</li>
                <li><strong className="text-white">Student Discounts:</strong> Additional 10% off for verified students</li>
              </ul>
              <p className="mt-4 bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <strong className="text-white">Apply for Scholarship:</strong> Email us at designwithmariam@gmail.com with your story and financial need documentation.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Community Initiatives</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong className="text-white">Free Webinars:</strong> Monthly free design workshops and career guidance sessions</li>
                <li><strong className="text-white">Open Resources:</strong> Free design templates, resources, and tutorials on our blog</li>
                <li><strong className="text-white">Mentorship Program:</strong> Connect students with industry professionals</li>
                <li><strong className="text-white">Job Board:</strong> Help graduates find employment opportunities</li>
                <li><strong className="text-white">Community Forums:</strong> Free peer-to-peer learning and support</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Environmental Responsibility</h2>
              <p className="mb-4">We promote sustainable practices:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Digital-first approach reduces paper waste</li>
                <li>Energy-efficient cloud infrastructure</li>
                <li>Remote learning reduces carbon footprint from commuting</li>
                <li>Paperless transactions and certificates</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Fair Labor Practices</h2>
              <p className="mb-4">We treat our instructors and team fairly:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Fair compensation for course creators</li>
                <li>Flexible work arrangements</li>
                <li>Professional development opportunities</li>
                <li>Transparent revenue sharing</li>
                <li>Respect for intellectual property</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Ethical Business Practices</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong className="text-white">Transparency:</strong> Clear pricing, no hidden fees</li>
                <li><strong className="text-white">Data Privacy:</strong> Strong protection of user information</li>
                <li><strong className="text-white">Quality Commitment:</strong> Continuous course improvement based on feedback</li>
                <li><strong className="text-white">Customer Support:</strong> Responsive and helpful assistance</li>
                <li><strong className="text-white">Honest Marketing:</strong> No false promises or misleading claims</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Partnership for Good</h2>
              <p className="mb-4">We collaborate with organizations that share our values:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Educational institutions for curriculum development</li>
                <li>NGOs working in education sector</li>
                <li>Tech companies for skill development</li>
                <li>Government initiatives for digital literacy</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Future Goals</h2>
              <p className="mb-4">By 2027, we aim to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide 10,000+ free scholarships</li>
                <li>Reach 100,000+ students across South Asia</li>
                <li>Launch dedicated courses for underprivileged communities</li>
                <li>Establish offline learning centers in rural areas</li>
                <li>Create 5,000+ job placements through our network</li>
              </ul>
            </section>

            <section className="bg-pink-500/10 border border-pink-500/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Heart className="w-6 h-6 text-pink-400" />
                <h2 className="text-2xl font-bold text-white">Get Involved</h2>
              </div>
              <p className="mb-4">You can support our CSR initiatives by:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Sponsoring a student's education</li>
                <li>Volunteering as a mentor</li>
                <li>Sharing our free resources in your community</li>
                <li>Partnering with us for educational programs</li>
                <li>Spreading the word about affordable education</li>
              </ul>
            </section>

            <section className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
              <p className="mb-4">To learn more about our CSR initiatives or get involved:</p>
              <p><strong className="text-white">Email:</strong> <a href="mailto:designwithmariam@gmail.com" className="text-blue-400 hover:underline">designwithmariam@gmail.com</a></p>
              <p><strong className="text-white">Phone:</strong> <a href="tel:+918807557977" className="text-blue-400 hover:underline">+91 8807557977</a></p>
              <p><strong className="text-white">Website:</strong> <a href="https://muxion.in" className="text-blue-400 hover:underline">muxion.in</a></p>
            </section>
          </div>

          <div className="flex flex-wrap justify-center gap-6 pt-8 border-t border-blue-500/20">
            <Link to="/privacy" className="text-blue-400 hover:text-blue-300 hover:underline">Privacy Policy</Link>
            <Link to="/terms" className="text-blue-400 hover:text-blue-300 hover:underline">Terms & Conditions</Link>
            <Link to="/disclaimer" className="text-blue-400 hover:text-blue-300 hover:underline">Disclaimer</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}