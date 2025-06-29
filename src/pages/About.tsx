import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Users, Target, Award, Code, Zap } from 'lucide-react';

const About = () => {
  const teamMembers = [
    {
      name: "M Usman Mustafa",
      role: "CEO & Co-Founder",
      image: "/lovable-uploads/299958f4-e70c-4029-8fb3-96c3273ce362.png",
      description: "Visionary leader and experienced software architect with over 10 years in software development and AI technologies."
    },
    {
      name: "Muhammad Ali",
      role: "COO & Co-Founder", 
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      description: "Expert software developer and operations specialist, ensuring seamless delivery of cutting-edge solutions."
    },
    {
      name: "Bilal Khursheed",
      role: "CTO & Co-Founder",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      description: "Technical architect and innovation leader, driving the technological vision and development strategies."
    }
  ];

  const values = [
    {
      icon: <Sparkles className="w-8 h-8 text-purple-400" />,
      title: "Innovation First",
      description: "We push the boundaries of what's possible with AI and machine learning technologies."
    },
    {
      icon: <Users className="w-8 h-8 text-cyan-400" />,
      title: "User-Centric",
      description: "Every feature we build is designed with our users' needs and creativity in mind."
    },
    {
      icon: <Target className="w-8 h-8 text-pink-400" />,
      title: "Quality Focused",
      description: "We maintain the highest standards in code quality, performance, and user experience."
    },
    {
      icon: <Award className="w-8 h-8 text-yellow-400" />,
      title: "Excellence Driven",
      description: "We strive for excellence in everything we do, from development to customer support."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header Section */}
          <div className="text-center mb-12 sm:mb-16">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              About Visiomancer
            </h1>
            <p className="text-gray-300 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
              Revolutionizing creative expression through the power of artificial intelligence, 
              making professional-quality image generation accessible to everyone.
            </p>
          </div>

          {/* Mission Section */}
          <Card className="bg-slate-800/50 border-purple-500/30 backdrop-blur-sm mb-12 sm:mb-16">
            <CardHeader>
              <CardTitle className="text-2xl sm:text-3xl text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 text-base sm:text-lg text-center leading-relaxed">
                At Visiomancer, we believe that creativity should know no bounds. Our mission is to democratize 
                the power of AI-driven image generation, enabling artists, designers, entrepreneurs, and dreamers 
                to transform their imagination into stunning visual reality with just a few words.
              </p>
            </CardContent>
          </Card>

          {/* Company Section */}
          <div className="mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Powered by CodeBaxh
            </h2>
            <Card className="bg-slate-800/50 border-cyan-500/30 backdrop-blur-sm">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center justify-center mb-6">
                  <Code className="w-12 h-12 text-cyan-400 mr-4" />
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white">CodeBaxh</h3>
                    <p className="text-cyan-300">Software Development & Consultancy</p>
                  </div>
                </div>
                <p className="text-gray-300 text-base sm:text-lg leading-relaxed text-center mb-6">
                  CodeBaxh is a leading software development and consultancy company specializing in 
                  cutting-edge technologies including artificial intelligence, machine learning, and 
                  enterprise software solutions. With a proven track record of delivering innovative 
                  solutions to clients worldwide, CodeBaxh combines technical expertise with creative 
                  vision to build products that make a difference.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="text-center">
                    <Zap className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                    <h4 className="font-semibold text-white mb-2">Software Development</h4>
                    <p className="text-gray-400 text-sm">Full-stack development, mobile apps, and enterprise solutions</p>
                  </div>
                  <div className="text-center">
                    <Target className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                    <h4 className="font-semibold text-white mb-2">Technology Consultancy</h4>
                    <p className="text-gray-400 text-sm">Strategic guidance, architecture design, and technical leadership</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Team Section */}
          <div className="mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Meet Our Leadership
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  <Card className="bg-slate-800/50 border-purple-500/30 backdrop-blur-sm h-full hover:border-purple-400/50 transition-colors">
                    <CardContent className="p-6 text-center">
                      <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden mx-auto mb-4 border-4 border-purple-500/30">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{member.name}</h3>
                      <p className="text-purple-300 font-medium mb-4">{member.role}</p>
                      <p className="text-gray-300 text-sm sm:text-base leading-relaxed">{member.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Values Section */}
          <div className="mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Our Values
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="bg-slate-800/50 border-purple-500/30 backdrop-blur-sm h-full hover:border-purple-400/50 transition-colors">
                    <CardContent className="p-6 text-center">
                      <div className="mb-4">
                        {value.icon}
                      </div>
                      <h3 className="text-lg font-bold text-white mb-3">{value.title}</h3>
                      <p className="text-gray-300 text-sm leading-relaxed">{value.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Technology Section */}
          <Card className="bg-slate-800/50 border-purple-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl sm:text-3xl text-center bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                Our Technology
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 text-base sm:text-lg text-center leading-relaxed mb-6">
                Visiomancer is built on cutting-edge AI technology, leveraging the latest advances in 
                machine learning and neural networks to deliver unparalleled image generation capabilities.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                <div>
                  <h4 className="font-semibold text-white mb-2">OpenAI Integration</h4>
                  <p className="text-gray-400 text-sm">Powered by state-of-the-art AI models for superior image quality</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Cloud Infrastructure</h4>
                  <p className="text-gray-400 text-sm">Scalable and reliable architecture for optimal performance</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Advanced Security</h4>
                  <p className="text-gray-400 text-sm">Enterprise-grade security protecting your data and creations</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
