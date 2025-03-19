import { Link } from "react-router-dom";
import { Facebook, Twitter, Linkedin, Youtube, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* AI Suite Section */}
        <div>
          <h3 className="text-xl font-semibold mb-4">AI Suite</h3>
          <ul className="space-y-2 text-gray-400">
            <li><Link to="/ai-image-generator" className="hover:text-white">AI Image Generator</Link></li>
            <li><Link to="/ai-video-generator" className="hover:text-white">AI Video Generator</Link></li>
            <li><Link to="/image-upscaler" className="hover:text-white">Image Upscaler</Link></li>
            <li><Link to="/background-remover" className="hover:text-white">Background Remover</Link></li>
            <li><Link to="/photo-editor" className="hover:text-white">Photo Editor</Link></li>
            <li><Link to="/ai-voice-generator" className="hover:text-white">AI Voice Generator</Link></li>
          </ul>
        </div>

        {/* Information Section */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Information</h3>
          <ul className="space-y-2 text-gray-400">
            <li><Link to="/pricing" className="hover:text-white">Pricing</Link></li>
            <li><Link to="/about-us" className="hover:text-white">About Us</Link></li>
            <li><Link to="/api" className="hover:text-white">API</Link></li>
            <li><Link to="/jobs" className="hover:text-white">Jobs</Link></li>
            <li><Link to="/sell-content" className="hover:text-white">Sell Content</Link></li>
            <li><Link to="/brand-guidelines" className="hover:text-white">Brand Guidelines</Link></li>
            <li><Link to="/events" className="hover:text-white">Events</Link></li>
            <li><Link to="/search-trends" className="hover:text-white">Search Trends</Link></li>
            <li><Link to="/blog" className="hover:text-white">Blog</Link></li>
          </ul>
        </div>

        {/* Legal Section */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Legal</h3>
          <ul className="space-y-2 text-gray-400">
            <li><Link to="/terms" className="hover:text-white">Terms of Use</Link></li>
            <li><Link to="/license" className="hover:text-white">License Agreement</Link></li>
            <li><Link to="/privacy-policy" className="hover:text-white">Privacy Policy</Link></li>
            <li><Link to="/copyright" className="hover:text-white">Copyright Information</Link></li>
            <li><Link to="/cookies" className="hover:text-white">Cookies Policy</Link></li>
          </ul>
        </div>

        {/* Support & Social Media */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Support</h3>
          <ul className="space-y-2 text-gray-400">
            <li><Link to="/faq" className="hover:text-white">FAQ</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-4">Follow Us</h3>
          <div className="flex space-x-4">
            {/* <a href="#" className="hover:text-blue-400"><Facebook className="w-6 h-6" /></a> */}
            <a href="#" className="hover:text-sky-400"><Twitter className="w-6 h-6" /></a>
            <a href="#" className="hover:text-red-500"><Youtube className="w-6 h-6" /></a>
            <a href="#" className="hover:text-blue-600"><Linkedin className="w-6 h-6" /></a>
          </div>
        </div>

      </div>

      {/* Newsletter Subscription */}
      <div className="border-t border-gray-800 mt-8 py-6 text-center">
        <h3 className="text-lg font-semibold text-white">Get exclusive assets sent straight to your inbox</h3>
        <div className="mt-3 flex justify-center">
          <input type="email" placeholder="Enter your email" className="px-4 py-2 rounded-l-md text-black focus:outline-none" />
          <button className="bg-blue-600 px-6 py-2 rounded-r-md text-white hover:bg-blue-700">Sign Up</button>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-gray-800 mt-4 py-4 text-center text-gray-400">
        <span>English</span>
        <p className="mt-2">&copy; 2010-2025 AI Suite. All rights reserved.</p>
      </div>
    </footer>
  );
}
