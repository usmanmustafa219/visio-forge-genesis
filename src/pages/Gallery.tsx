
import { motion } from 'framer-motion';
import { useImages } from '@/hooks/useImages';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Download, Eye, Share, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Gallery = () => {
  const { images, isLoading, refetch } = useImages();
  const { user } = useAuth();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const handleImageError = (imageId: string) => {
    setImageErrors(prev => new Set([...prev, imageId]));
  };

  const getImageSrc = (image: any) => {
    // First try image_url if it exists
    if (image.image_url) {
      return image.image_url;
    }
    
    // Then try base64 image_data if it exists
    if (image.image_data) {
      // Check if it's already a data URL
      if (image.image_data.startsWith('data:image/')) {
        return image.image_data;
      }
      // If not, construct the data URL
      return `data:image/png;base64,${image.image_data}`;
    }
    
    // Return null if no image data is available
    return null;
  };

  const handleDownload = (image: any) => {
    try {
      const imageSrc = getImageSrc(image);
      if (!imageSrc) {
        toast.error('No image data available for download');
        return;
      }

      const link = document.createElement('a');
      link.href = imageSrc;
      const filename = `visiomancer-${image.prompt.substring(0, 20).replace(/[^a-zA-Z0-9]/g, '-')}.png`;
      link.download = filename;
      link.click();
      toast.success('Image downloaded successfully!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download image');
    }
  };

  const handleShare = async (image: any, platform: string) => {
    try {
      const shareText = `Check out this AI-generated image: ${image.prompt}`;
      const shareUrl = window.location.origin;
      
      let url = '';
      switch (platform) {
        case 'twitter':
          url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
          break;
        case 'facebook':
          url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
          break;
        case 'linkedin':
          url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareText)}`;
          break;
        case 'whatsapp':
          url = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
          break;
        default:
          if (navigator.share) {
            await navigator.share({
              title: 'AI Generated Image',
              text: shareText,
              url: shareUrl,
            });
            return;
          }
          break;
      }
      
      if (url) {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    } catch (error) {
      console.error('Share error:', error);
      toast.error('Failed to share image');
    }
  };

  const handleDelete = async (imageId: string) => {
    if (!user) return;
    
    setDeletingId(imageId);
    try {
      const { error } = await supabase
        .from('images')
        .delete()
        .eq('id', imageId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('Image deleted successfully!');
      refetch();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete image');
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-purple-400 mx-auto mb-4" />
            <p className="text-gray-300">Loading your gallery...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              My Gallery
            </h1>
            <p className="text-gray-300 text-base sm:text-lg">
              Your AI-generated masterpieces ({images.length} images)
            </p>
          </div>

          {images.length === 0 ? (
            <div className="text-center py-16">
              <Eye className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold mb-2 text-gray-300">No images yet</h3>
              <p className="text-gray-500 mb-6">Start creating your first AI masterpiece!</p>
              <Button 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                onClick={() => window.location.href = '/generate'}
              >
                Generate Your First Image
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {images.map((image) => {
                const imageSrc = getImageSrc(image);
                const hasImageError = imageErrors.has(image.id);
                
                return (
                  <motion.div
                    key={image.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="bg-slate-800/50 border-purple-500/30 backdrop-blur-sm overflow-hidden hover:border-purple-400/50 transition-colors">
                      <CardContent className="p-0">
                        <div className="aspect-square relative group bg-slate-700/50">
                          {imageSrc && !hasImageError ? (
                            <img
                              src={imageSrc}
                              alt={image.prompt}
                              className="w-full h-full object-cover"
                              loading="lazy"
                              onError={() => handleImageError(image.id)}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-slate-700/50">
                              <div className="text-center text-gray-400">
                                <Eye className="w-8 h-8 mx-auto mb-2" />
                                <p className="text-sm">
                                  {hasImageError ? 'Failed to load' : 'No image data'}
                                </p>
                              </div>
                            </div>
                          )}
                          
                          {imageSrc && !hasImageError && (
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => handleDownload(image)}
                                className="bg-white/20 hover:bg-white/30"
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                              
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    className="bg-white/20 hover:bg-white/30"
                                  >
                                    <Share className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="bg-slate-800 border-purple-500/30">
                                  <DropdownMenuItem onClick={() => handleShare(image, 'twitter')}>
                                    Share on Twitter
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleShare(image, 'facebook')}>
                                    Share on Facebook
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleShare(image, 'linkedin')}>
                                    Share on LinkedIn
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleShare(image, 'whatsapp')}>
                                    Share on WhatsApp
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleShare(image, 'native')}>
                                    Share via...
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>

                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    className="bg-red-500/80 hover:bg-red-600/80"
                                    disabled={deletingId === image.id}
                                  >
                                    {deletingId === image.id ? (
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                      <Trash2 className="w-4 h-4" />
                                    )}
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="bg-slate-800 border-purple-500/30 text-white">
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Image</AlertDialogTitle>
                                    <AlertDialogDescription className="text-gray-300">
                                      Are you sure you want to delete this image? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel className="bg-gray-600 hover:bg-gray-700 text-white border-gray-500">
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(image.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          )}
                        </div>
                        <div className="p-3 sm:p-4">
                          <p className="text-xs sm:text-sm text-gray-300 mb-2 line-clamp-2">
                            {image.prompt}
                          </p>
                          <div className="flex justify-between items-center text-xs text-gray-500">
                            <span>{image.size || '1024x1024'}</span>
                            <span>{image.quality || 'standard'}</span>
                            <span>{image.credits_used || 0} credits</span>
                          </div>
                          <div className="flex justify-between items-center text-xs text-gray-500 mt-1">
                            <span>{image.category || 'General'}</span>
                            <span>{image.style || 'Default'}</span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {new Date(image.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Gallery;
