
import { Link } from 'react-router-dom';
import { Eye, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 border-t border-purple-500/20 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Eye className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Visiomancer
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Transform your imagination into stunning AI-generated artwork. Create, customize, and bring your creative visions to life with the power of artificial intelligence.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/samples" className="block text-gray-400 hover:text-purple-400 transition-colors text-sm">
                Sample Gallery
              </Link>
              <Link to="/about" className="block text-gray-400 hover:text-purple-400 transition-colors text-sm">
                About Us
              </Link>
              <Link to="/contact" className="block text-gray-400 hover:text-purple-400 transition-colors text-sm">
                Contact Support
              </Link>
              <Link to="/auth" className="block text-gray-400 hover:text-purple-400 transition-colors text-sm">
                Sign Up
              </Link>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg">Features</h3>
            <div className="space-y-2">
              <Link to="/generate" className="block text-gray-400 hover:text-purple-400 transition-colors text-sm">
                AI Image Generation
              </Link>
              <Link to="/gallery" className="block text-gray-400 hover:text-purple-400 transition-colors text-sm">
                Personal Gallery
              </Link>
              <Link to="/credits" className="block text-gray-400 hover:text-purple-400 transition-colors text-sm">
                Credit System
              </Link>
              <span className="block text-gray-400 text-sm">
                High-Quality Images
              </span>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <Mail className="w-4 h-4 text-purple-400" />
                <span>support@visiomancer.com</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <Phone className="w-4 h-4 text-purple-400" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-start space-x-2 text-gray-400 text-sm">
                <MapPin className="w-4 h-4 text-purple-400 mt-0.5" />
                <span>
                  123 AI Innovation Street<br />
                  Tech Valley, CA 94000
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-purple-500/20 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="text-gray-400 text-sm text-center sm:text-left">
            © 2024 Visiomancer. All rights reserved. | CEO: Muhammad Usman Mustafa
          </div>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
