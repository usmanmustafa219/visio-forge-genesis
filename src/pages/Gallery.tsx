
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Search, Image, Download, Trash2, Eye, Clock, Zap } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const Gallery = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const { data: images, isLoading } = useQuery({
    queryKey: ['user-images', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('images')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const filteredImages = images?.filter(image =>
    image.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    image.category?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <Navbar />

      <div className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            My Gallery
          </h1>
          <p className="text-gray-300 text-lg mb-6">
            Browse and manage all your AI-generated images
          </p>

          {/* Search Bar */}
          <div className="max-w-md relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search images by prompt or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800/50 border-purple-500/30 text-white placeholder-gray-400"
            />
          </div>
        </motion.div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading your gallery...</p>
          </div>
        ) : filteredImages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-12"
          >
            <Image className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold mb-2">
              {searchTerm ? 'No images found' : 'Your gallery is empty'}
            </h3>
            <p className="text-gray-400 mb-6">
              {searchTerm ? 'Try a different search term' : 'Start creating amazing AI images!'}
            </p>
            {!searchTerm && (
              <Button 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                onClick={() => window.location.href = '/generate'}
              >
                Generate Your First Image
              </Button>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Card className="bg-slate-800/50 border-purple-500/30 backdrop-blur-sm overflow-hidden group hover:border-purple-400/50 transition-colors">
                  <div className="aspect-square relative overflow-hidden">
                    {image.image_url ? (
                      <>
                        <img
                          src={image.image_url}
                          alt={image.prompt}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <div className="flex space-x-2">
                            <Button size="sm" variant="secondary" className="bg-white/20 hover:bg-white/30">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="secondary" className="bg-white/20 hover:bg-white/30">
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="secondary" className="bg-red-500/20 hover:bg-red-500/30">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full bg-slate-700/50 flex items-center justify-center">
                        <div className="text-center text-gray-400">
                          <Image className="w-8 h-8 mx-auto mb-2" />
                          <p className="text-sm">
                            {image.status === 'processing' ? 'Processing...' : 'Failed'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-300 mb-3 line-clamp-2">
                      {image.prompt}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {new Date(image.created_at).toLocaleDateString()}
                      </span>
                      <span className="flex items-center">
                        <Zap className="w-3 h-3 mr-1" />
                        {image.credits_used} credits
                      </span>
                    </div>
                    
                    {image.category && (
                      <div className="inline-block bg-purple-500/20 text-purple-300 text-xs px-2 py-1 rounded">
                        {image.category}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
