
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Zap, Eye, Code, Cpu } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <Navbar />

      <div className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              About Visiomancer
            </h1>
            <p className="text-gray-300 text-lg max-w-3xl mx-auto">
              Transforming imagination into reality through the power of artificial intelligence
            </p>
          </div>

          {/* What is Visiomancer */}
          <div className="mb-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="bg-slate-800/50 border-purple-500/30 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <Eye className="w-8 h-8 text-purple-400 mr-3" />
                    <h2 className="text-2xl font-bold">What is Visiomancer?</h2>
                  </div>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Visiomancer is a cutting-edge AI-powered image generation platform that transforms your creative ideas into stunning visual art. 
                    Using advanced artificial intelligence technology, we make it possible for anyone to create professional-quality images with just a simple text description.
                  </p>
                  <p className="text-gray-300 leading-relaxed">
                    Whether you're an artist, designer, marketer, or simply someone with a vivid imagination, Visiomancer provides you with the tools to bring your visions to life instantly.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* How it Works */}
          <div className="mb-16">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="bg-slate-800/50 border-purple-500/30 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <Cpu className="w-8 h-8 text-cyan-400 mr-3" />
                    <h2 className="text-2xl font-bold">How Visiomancer Works</h2>
                  </div>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold">1</span>
                      </div>
                      <h3 className="text-lg font-semibold mb-2 text-purple-300">Describe Your Vision</h3>
                      <p className="text-gray-400 text-sm">Write a detailed description of the image you want to create</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold">2</span>
                      </div>
                      <h3 className="text-lg font-semibold mb-2 text-cyan-300">AI Processing</h3>
                      <p className="text-gray-400 text-sm">Our advanced AI analyzes your prompt and generates unique artwork</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold">3</span>
                      </div>
                      <h3 className="text-lg font-semibold mb-2 text-pink-300">Get Your Image</h3>
                      <p className="text-gray-400 text-sm">Download your high-quality generated image in seconds</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Features */}
          <div className="mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-center mb-8">Key Features</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="bg-slate-800/50 border-purple-500/30 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <Sparkles className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2 text-purple-300">Multiple Styles</h3>
                    <p className="text-gray-400">Choose from various artistic styles including realistic, cartoon, anime, and more</p>
                  </CardContent>
                </Card>
                <Card className="bg-slate-800/50 border-purple-500/30 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <Zap className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2 text-yellow-300">Lightning Fast</h3>
                    <p className="text-gray-400">Generate high-quality images in seconds, not hours</p>
                  </CardContent>
                </Card>
                <Card className="bg-slate-800/50 border-purple-500/30 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <Eye className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2 text-cyan-300">High Quality</h3>
                    <p className="text-gray-400">Professional-grade images suitable for any project</p>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>

          {/* CEO Section */}
          <div className="mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <Card className="bg-slate-800/50 border-purple-500/30 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row items-center justify-center mb-8">
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden mr-0 md:mr-8 mb-6 md:mb-0 border-4 border-gradient-to-r from-purple-500 to-pink-500">
                      <img 
                        src="/lovable-uploads/299958f4-e70c-4029-8fb3-96c3273ce362.png" 
                        alt="Muhammad Usman Mustafa - CEO" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-center md:text-left">
                      <h2 className="text-2xl font-bold mb-2">Meet Our CEO</h2>
                      <h3 className="text-xl text-purple-300 font-semibold">Muhammad Usman Mustafa</h3>
                      <p className="text-gray-400">Experienced AI Engineer & Software Architect</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-300 leading-relaxed mb-4">
                      Muhammad Usman Mustafa is a visionary leader in the field of artificial intelligence and software architecture. 
                      With extensive experience in developing cutting-edge AI solutions, he founded Visiomancer with the mission to democratize 
                      AI-powered creativity and make advanced image generation accessible to everyone.
                    </p>
                    <p className="text-gray-300 leading-relaxed">
                      Under his leadership, Visiomancer continues to push the boundaries of what's possible with AI technology, 
                      ensuring that users have access to the most advanced and user-friendly image generation tools available.
                    </p>
                  </div>
                  <div className="flex justify-center mt-6">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Code className="w-5 h-5 text-purple-400 mr-2" />
                        <span className="text-sm text-gray-400">AI Engineering</span>
                      </div>
                      <div className="flex items-center">
                        <Cpu className="w-5 h-5 text-cyan-400 mr-2" />
                        <span className="text-sm text-gray-400">Software Architecture</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Mission Statement */}
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              <Card className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-purple-500/30 backdrop-blur-sm">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                  <p className="text-gray-300 leading-relaxed text-lg">
                    To empower creativity through artificial intelligence, making professional-quality image generation 
                    accessible to everyone, regardless of their artistic background or technical expertise.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
