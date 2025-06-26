
import { motion } from 'framer-motion';
import { useImages } from '@/hooks/useImages';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Gallery = () => {
  const { images, isLoading } = useImages();

  const handleDownload = (imageData: string, prompt: string) => {
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${imageData}`;
    link.download = `visiomancer-${prompt.substring(0, 20).replace(/[^a-zA-Z0-9]/g, '-')}.png`;
    link.click();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
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
              Your AI-generated masterpieces
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
              {images.map((image) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-slate-800/50 border-purple-500/30 backdrop-blur-sm overflow-hidden">
                    <CardContent className="p-0">
                      <div className="aspect-square relative group">
                        <img
                          src={image.image_url || `data:image/png;base64,${image.image_data}`}
                          alt={image.prompt}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleDownload(image.image_data!, image.prompt)}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="p-3 sm:p-4">
                        <p className="text-xs sm:text-sm text-gray-300 mb-2 line-clamp-2">
                          {image.prompt}
                        </p>
                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <span>{image.size}</span>
                          <span>{image.quality}</span>
                          <span>{image.credits_used} credits</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Gallery;
