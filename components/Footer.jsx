import { ArrowRight, Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold" style={{color: '#347433'}}>EcoFinds</h3>
            <p className="text-gray-300 leading-relaxed">
              A vibrant and trusted platform revolutionizing the way people buy and sell pre-owned goods. 
              Fostering a culture of sustainability by extending the lifecycle of products.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold" style={{color: '#347433'}}>Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-300 hover:text-white transition-colors flex items-center group">
                  <ArrowRight size={14} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Home
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-300 hover:text-white transition-colors flex items-center group">
                  <ArrowRight size={14} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  About EcoFinds
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-300 hover:text-white transition-colors flex items-center group">
                  <ArrowRight size={14} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Contact Us
                </a>
              </li>
              <li>
                <a href="/faq" className="text-gray-300 hover:text-white transition-colors flex items-center group">
                  <ArrowRight size={14} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  FAQ & Support
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold" style={{color: '#347433'}}>Platform Features</h4>
            <ul className="space-y-2">
              <li>
                <a href="/about#quality-assurance" className="text-gray-300 hover:text-white transition-colors flex items-center group">
                  <ArrowRight size={14} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Quality Verification
                </a>
              </li>
              <li>
                <a href="/about#secure-transactions" className="text-gray-300 hover:text-white transition-colors flex items-center group">
                  <ArrowRight size={14} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Secure Marketplace
                </a>
              </li>
              <li>
                <a href="/about#easy-browsing" className="text-gray-300 hover:text-white transition-colors flex items-center group">
                  <ArrowRight size={14} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Smart Discovery
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold" style={{color: '#347433'}}>Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone size={16} style={{color: '#347433'}} />
                <a href="tel:+919876543210" className="text-gray-300 hover:text-white transition-colors">
                  +91 98765 43210
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={16} style={{color: '#347433'}} />
                <a href="mailto:support@ecofinds.com" className="text-gray-300 hover:text-white transition-colors">
                  support@ecofinds.com
                </a>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin size={16} style={{color: '#347433'}} className="mt-1" />
                <span className="text-gray-300">
                  Green Valley Business Park<br />
                  Pune, Maharashtra 411045<br />
                  India
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h4 className="text-lg font-semibold mb-2" style={{color: '#347433'}}>
                Stay Updated with EcoFinds
              </h4>
              <p className="text-gray-300">
                Get the latest updates on sustainable shopping and new pre-owned treasures in our marketplace.
              </p>
            </div>
            <div className="flex space-x-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
              />
              <button 
                className="px-6 py-2 text-white rounded-md transition-colors hover:bg-green-800"
                style={{backgroundColor: '#347433'}}
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400">
              © 2024 EcoFinds. All rights reserved. Empowering sustainable consumption through trusted marketplace.
            </p>
            <div className="flex space-x-6">
              <a href="/contact" className="text-gray-400 hover:text-white transition-colors">
                Get Support
              </a>
              <a href="/faq" className="text-gray-400 hover:text-white transition-colors">
                Help Center
              </a>
              <a href="/about" className="text-gray-400 hover:text-white transition-colors">
                Learn More
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
