
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Image, Zap, CreditCard, Sparkles, TrendingUp, Clock } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { useProfile } from '@/hooks/useProfile';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const { profile } = useProfile();

  const { data: recentImages } = useQuery({
    queryKey: ['recent-images', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('images')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const { data: totalImages } = useQuery({
    queryKey: ['total-images', user?.id],
    queryFn: async () => {
      if (!user) return 0;
      
      const { count, error } = await supabase
        .from('images')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (error) throw error;
      return count || 0;
    },
    enabled: !!user,
  });

  const stats = [
    {
      title: 'Available Credits',
      value: profile?.credits || 0,
      icon: Zap,
      color: 'text-yellow-400',
      bgColor: 'from-yellow-500/20 to-orange-500/20',
    },
    {
      title: 'Images Generated',
      value: totalImages || 0,
      icon: Image,
      color: 'text-purple-400',
      bgColor: 'from-purple-500/20 to-pink-500/20',
    },
    {
      title: 'Credits Used',
      value: profile?.total_credits_consumed || 0,
      icon: TrendingUp,
      color: 'text-cyan-400',
      bgColor: 'from-cyan-500/20 to-blue-500/20',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <Navbar />

      <div className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, {profile?.first_name || 'Creator'}!
          </h1>
          <p className="text-gray-300 text-lg">
            Ready to create something amazing today?
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid md:grid-cols-3 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <Card key={stat.title} className="bg-slate-800/50 border-purple-500/30 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.bgColor} flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid md:grid-cols-2 gap-6 mb-8"
        >
          <Card className="bg-slate-800/50 border-purple-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <span>Generate New Image</span>
              </CardTitle>
              <CardDescription>
                Create stunning AI-generated images with just a text prompt
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <Link to="/generate">
                  <Image className="w-4 h-4 mr-2" />
                  Start Creating
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-purple-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-cyan-400" />
                <span>Get More Credits</span>
              </CardTitle>
              <CardDescription>
                Purchase additional credits to continue generating images
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full border-cyan-500 text-cyan-300 hover:bg-cyan-500/10">
                <Link to="/credits">
                  <Zap className="w-4 h-4 mr-2" />
                  Buy Credits
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Images */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Recent Creations</h2>
            <Button variant="ghost" asChild className="text-purple-400 hover:text-purple-300">
              <Link to="/gallery">View All</Link>
            </Button>
          </div>

          {recentImages && recentImages.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {recentImages.map((image) => (
                <Card key={image.id} className="bg-slate-800/50 border-purple-500/30 backdrop-blur-sm overflow-hidden">
                  <div className="aspect-square bg-slate-700/50 flex items-center justify-center">
                    {image.image_url ? (
                      <img
                        src={image.image_url}
                        alt={image.prompt}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center text-gray-400">
                        <Image className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-sm">Processing...</p>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-300 truncate mb-2">{image.prompt}</p>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {new Date(image.created_at).toLocaleDateString()}
                      </span>
                      <span className="flex items-center">
                        <Zap className="w-3 h-3 mr-1" />
                        {image.credits_used} credits
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-slate-800/50 border-purple-500/30 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <Image className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold mb-2">No images yet</h3>
                <p className="text-gray-400 mb-4">Start creating your first AI-generated image!</p>
                <Button asChild className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  <Link to="/generate">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Image
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
