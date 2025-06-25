
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Eye, User, LogOut, Zap, Image, CreditCard, Palette, Info, Phone } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const Navbar = () => {
  const { user, signOut } = useAuth();
  const { profile } = useProfile();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="flex justify-between items-center p-6 relative z-10">
      <Link to={user ? "/dashboard" : "/"} className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
          <Eye className="w-5 h-5 text-white" />
        </div>
        <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Visiomancer
        </span>
      </Link>

      <div className="hidden md:flex items-center space-x-6">
        <Link to="/samples" className="text-gray-300 hover:text-purple-300 transition-colors">
          Samples
        </Link>
        <Link to="/about" className="text-gray-300 hover:text-purple-300 transition-colors">
          About
        </Link>
        <Link to="/contact" className="text-gray-300 hover:text-purple-300 transition-colors">
          Contact
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        {user ? (
          <>
            {/* Credits Display */}
            <div className="flex items-center space-x-2 bg-slate-800/50 rounded-lg px-3 py-2 border border-purple-500/30">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-white font-medium">{profile?.credits || 0}</span>
              <span className="text-gray-400 text-sm">credits</span>
            </div>

            {/* User Menu */}
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
                <DropdownMenuItem asChild>
                  <Link to="/samples" className="flex items-center space-x-2">
                    <Palette className="w-4 h-4" />
                    <span>Sample Gallery</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/about" className="flex items-center space-x-2">
                    <Info className="w-4 h-4" />
                    <span>About</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/contact" className="flex items-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span>Contact</span>
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
    </nav>
  );
};
