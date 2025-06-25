
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Sparkles, Zap, Eye, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const [prompt, setPrompt] = useState("");
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <div className="relative">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-cyan-500/30 rounded-full blur-2xl animate-ping"></div>
        </div>

        <div className="relative z-10 container mx-auto px-6 py-20">
          <div className="text-center max-w-4xl mx-auto">
            {/* Main Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-6xl md:text-7xl font-bold mb-6 leading-tight"
            >
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                Conjure Any Image
              </span>
              <br />
              <span className="text-white">
                with Just a Prompt
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto"
            >
              Unleash the power of AI to generate stunning visuals — from nature to sci-fi, 
              research to surrealism — instantly.
            </motion.p>

            {/* Interactive Prompt Demo */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mb-12"
            >
              <div className="max-w-2xl mx-auto relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative bg-slate-800 rounded-lg p-4 border border-purple-500/30">
                  <div className="flex items-center space-x-4">
                    <Input
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="A mystical forest with glowing mushrooms and floating crystals..."
                      className="flex-1 bg-transparent border-none text-white placeholder-gray-400 text-lg focus:ring-0"
                    />
                    <Button 
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8"
                      asChild
                    >
                      <Link to={user ? "/generate" : "/auth"}>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Generate
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
            >
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg px-8 py-6 group"
                asChild
              >
                <Link to={user ? "/generate" : "/auth"}>
                  <Zap className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                  Generate Your First Image
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-purple-500 text-purple-300 hover:bg-purple-500/10 text-lg px-8 py-6"
                asChild
              >
                <Link to="/credits">View Pricing Plans</Link>
              </Button>
            </motion.div>

            {/* Features Grid */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
            >
              <div className="text-center p-6 rounded-lg bg-slate-800/50 border border-purple-500/20 backdrop-blur-sm">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-purple-300">Instant Generation</h3>
                <p className="text-gray-400">Create stunning images in seconds with our advanced AI technology.</p>
              </div>

              <div className="text-center p-6 rounded-lg bg-slate-800/50 border border-purple-500/20 backdrop-blur-sm">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-cyan-300">Multiple Styles</h3>
                <p className="text-gray-400">Choose from various categories, styles, and quality settings.</p>
              </div>

              <div className="text-center p-6 rounded-lg bg-slate-800/50 border border-purple-500/20 backdrop-blur-sm">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-pink-300">Easy Sharing</h3>
                <p className="text-gray-400">Share your creations instantly across all social platforms.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
