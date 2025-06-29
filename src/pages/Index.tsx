
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Sparkles, Zap, Eye, ArrowRight, Users, Star, Palette, Clock, Shield, Trophy } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const [prompt, setPrompt] = useState("");
  const { user } = useAuth();

  const features = [
    {
      icon: <Sparkles className="w-8 h-8 text-white" />,
      title: "AI-Powered Generation",
      description: "Create stunning images in seconds with our advanced AI technology powered by OpenAI's latest models.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: <Eye className="w-8 h-8 text-white" />,
      title: "Multiple Styles & Categories",
      description: "Choose from various categories, styles, and quality settings to match your creative vision.",
      gradient: "from-cyan-500 to-blue-500"
    },
    {
      icon: <Zap className="w-8 h-8 text-white" />,
      title: "Lightning Fast",
      description: "Generate high-quality images in under 30 seconds with our optimized processing pipeline.",
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      icon: <Palette className="w-8 h-8 text-white" />,
      title: "Creative Control",
      description: "Fine-tune your generations with advanced options for size, quality, and artistic style.",
      gradient: "from-pink-500 to-red-500"
    },
    {
      icon: <Shield className="w-8 h-8 text-white" />,
      title: "Secure & Private",
      description: "Your images and data are protected with enterprise-grade security and privacy measures.",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: <Users className="w-8 h-8 text-white" />,
      title: "Community Driven",
      description: "Join thousands of creators sharing inspiration and techniques in our vibrant community.",
      gradient: "from-indigo-500 to-purple-500"
    }
  ];

  const stats = [
    { value: "50K+", label: "Images Generated" },
    { value: "10K+", label: "Happy Users" },
    { value: "99.9%", label: "Uptime" },
    { value: "4.9/5", label: "User Rating" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Hero Section */}
      <div className="relative">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-cyan-500/30 rounded-full blur-2xl animate-ping"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center max-w-4xl mx-auto">
            {/* Main Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl sm:text-6xl md:text-7xl font-bold mb-6 leading-tight"
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
              className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto"
            >
              Unleash the power of AI to generate stunning visuals — from nature to sci-fi, 
              research to surrealism — instantly with cutting-edge technology.
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
                  <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <Input
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="A mystical forest with glowing mushrooms and floating crystals..."
                      className="flex-1 bg-transparent border-none text-white placeholder-gray-400 text-sm sm:text-lg focus:ring-0"
                    />
                    <Button 
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-6 sm:px-8 w-full sm:w-auto"
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
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg px-8 py-6 group w-full sm:w-auto"
                asChild
              >
                <Link to={user ? "/generate" : "/auth"}>
                  <Zap className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                  {user ? "Generate Your Next Image" : "Start Creating for Free"}
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-purple-500 text-purple-300 hover:bg-purple-500/10 text-lg px-8 py-6 w-full sm:w-auto"
                asChild
              >
                <Link to="/samples">Explore Sample Gallery</Link>
              </Button>
            </motion.div>

            {/* Stats Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-16"
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-purple-400 mb-2">{stat.value}</div>
                  <div className="text-gray-400 text-sm sm:text-base">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Why Choose Visiomancer?
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Experience the next generation of AI image generation with powerful features designed for creators
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div className="text-center p-6 sm:p-8 rounded-xl bg-slate-800/50 border border-purple-500/20 backdrop-blur-sm hover:border-purple-400/50 transition-all duration-300 h-full">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-white group-hover:text-purple-300 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="py-16 sm:py-24 bg-gradient-to-r from-purple-900/50 to-pink-900/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Trophy className="w-16 h-16 mx-auto mb-6 text-yellow-400" />
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-white">
              Ready to Create Something Amazing?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of creators who are already using Visiomancer to bring their ideas to life
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg px-8 py-6 group w-full sm:w-auto"
                asChild
              >
                <Link to={user ? "/generate" : "/auth"}>
                  <Sparkles className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                  {user ? "Create Now" : "Get Started Free"}
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-6 w-full sm:w-auto"
                asChild
              >
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Index;
