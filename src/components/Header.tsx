
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Eye, User, LogOut, Zap, Image, CreditCard, Menu, X, Home, Contact } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const Header = () => {
  const { user, signOut } = useAuth();
  const { profile } = useProfile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-purple-500/20 bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-slate-900/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Visiomancer
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-4 xl:space-x-6">
            <Link to="/" className="text-gray-300 hover:text-purple-300 transition-colors flex items-center space-x-1 text-sm xl:text-base">
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
            <Link to="/samples" className="text-gray-300 hover:text-purple-300 transition-colors text-sm xl:text-base">
              Sample Images
            </Link>
            {user && (
              <Link to="/gallery" className="text-gray-300 hover:text-purple-300 transition-colors text-sm xl:text-base">
                My Collection
              </Link>
            )}
            <Link to="/about" className="text-gray-300 hover:text-purple-300 transition-colors text-sm xl:text-base">
              About
            </Link>
            <Link to="/contact" className="text-gray-300 hover:text-purple-300 transition-colors text-sm xl:text-base">
              Contact Us
            </Link>
          </nav>

          {/* Desktop User Menu */}
          <div className="hidden lg:flex items-center space-x-2 xl:space-x-4">
            {user ? (
              <>
                {/* Credits Display */}
                <div className="flex items-center space-x-2 bg-slate-800/50 rounded-lg px-3 py-2 border border-purple-500/30">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-white font-medium">{profile?.credits || 0}</span>
                  <span className="text-gray-400 text-sm">credits</span>
                </div>

                {/* User Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="text-white hover:text-purple-300">
                      <User className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-slate-800 border-purple-500/30 text-white">
                    <DropdownMenuItem asChild>
                      <Link to="/generate" className="flex items-center space-x-2">
                        <Image className="w-4 h-4" />
                        <span>Generate Image</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/gallery" className="flex items-center space-x-2">
                        <Image className="w-4 h-4" />
                        <span>My Gallery</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/credits" className="flex items-center space-x-2">
                        <CreditCard className="w-4 h-4" />
                        <span>Buy Credits</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex space-x-4">
                <Button variant="ghost" asChild className="text-white hover:text-purple-300">
                  <Link to="/auth">Login</Link>
                </Button>
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700" asChild>
                  <Link to="/auth">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-purple-500/20 py-4">
            <div className="flex flex-col space-y-4">
              {/* Navigation Links */}
              <Link 
                to="/" 
                className="text-gray-300 hover:text-purple-300 transition-colors px-2 flex items-center space-x-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>
              <Link 
                to="/samples" 
                className="text-gray-300 hover:text-purple-300 transition-colors px-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sample Images
              </Link>
              {user && (
                <Link 
                  to="/gallery" 
                  className="text-gray-300 hover:text-purple-300 transition-colors px-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  My Collection
                </Link>
              )}
              <Link 
                to="/about" 
                className="text-gray-300 hover:text-purple-300 transition-colors px-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                to="/contact" 
                className="text-gray-300 hover:text-purple-300 transition-colors px-2 flex items-center space-x-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Contact className="w-4 h-4" />
                <span>Contact Us</span>
              </Link>

              {user ? (
                <>
                  {/* Credits Display */}
                  <div className="flex items-center space-x-2 bg-slate-800/50 rounded-lg px-3 py-2 border border-purple-500/30 mx-2 w-fit">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <span className="text-white font-medium">{profile?.credits || 0}</span>
                    <span className="text-gray-400 text-sm">credits</span>
                  </div>

                  {/* User Actions */}
                  <div className="border-t border-purple-500/20 pt-4 flex flex-col space-y-2">
                    <Link 
                      to="/generate" 
                      className="flex items-center space-x-2 text-gray-300 hover:text-purple-300 transition-colors px-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Image className="w-4 h-4" />
                      <span>Generate Image</span>
                    </Link>
                    <Link 
                      to="/gallery" 
                      className="flex items-center space-x-2 text-gray-300 hover:text-purple-300 transition-colors px-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Image className="w-4 h-4" />
                      <span>My Gallery</span>
                    </Link>
                    <Link 
                      to="/credits" 
                      className="flex items-center space-x-2 text-gray-300 hover:text-purple-300 transition-colors px-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Buy Credits</span>
                    </Link>
                    <button 
                      onClick={handleSignOut}
                      className="flex items-center space-x-2 text-gray-300 hover:text-purple-300 transition-colors px-2 text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="border-t border-purple-500/20 pt-4 flex flex-col space-y-2">
                  <Link 
                    to="/auth" 
                    className="text-gray-300 hover:text-purple-300 transition-colors px-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/auth" 
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg mx-2 text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
