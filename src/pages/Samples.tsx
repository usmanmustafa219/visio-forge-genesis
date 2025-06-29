
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

const sampleImages = [
  {
    id: 1,
    prompt: "A mystical forest with glowing mushrooms and floating crystals under a starry sky, ethereal lighting, magical atmosphere",
    category: "Fantasy",
    image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=800&fit=crop&crop=center"
  },
  {
    id: 2,
    prompt: "Cyberpunk cityscape at night with neon lights, flying cars, and holographic advertisements, futuristic architecture",
    category: "Sci-Fi",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=800&fit=crop&crop=center"
  },
  {
    id: 3,
    prompt: "Portrait of a wise elderly wizard with a long white beard, magical robes, holding a glowing staff, fantasy art style",
    category: "Portrait",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&h=800&fit=crop&crop=center"
  },
  {
    id: 4,
    prompt: "Serene mountain lake at sunrise with misty peaks, reflection in water, peaceful nature scene, photorealistic",
    category: "Nature",
    image: "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=800&h=800&fit=crop&crop=center"
  },
  {
    id: 5,
    prompt: "Abstract geometric shapes in vibrant colors, flowing patterns, digital art, modern contemporary style",
    category: "Abstract",
    image: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800&h=800&fit=crop&crop=center"
  },
  {
    id: 6,
    prompt: "Ancient Greek temple with marble columns, golden hour lighting, architectural details, classical style",
    category: "Architecture",
    image: "https://images.unsplash.com/photo-1539650116574-75c0c6d73273?w=800&h=800&fit=crop&crop=center"
  },
  {
    id: 7,
    prompt: "Majestic dragon soaring through cloudy skies, detailed scales, fantasy creature, epic scene",
    category: "Fantasy",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=800&fit=crop&crop=center"
  },
  {
    id: 8,
    prompt: "Futuristic space station orbiting Earth, detailed technology, sci-fi atmosphere, cosmic background",
    category: "Sci-Fi",
    image: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800&h=800&fit=crop&crop=center"
  }
];

const Samples = () => {
  const { user } = useAuth();

  const copyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
    toast.success('Prompt copied to clipboard!');
  };

  const usePrompt = (prompt: string) => {
    if (!user) {
      toast.error('Please sign in to generate images');
      return;
    }
    const params = new URLSearchParams({ prompt });
    window.location.href = `/generate?${params.toString()}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Sample Gallery
            </h1>
            <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto">
              Get inspired by these sample images and prompts. Click to copy the prompt and create your own version!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {sampleImages.map((sample) => (
              <motion.div
                key={sample.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: sample.id * 0.1 }}
                className="w-full"
              >
                <Card className="bg-slate-800/50 border-purple-500/30 backdrop-blur-sm overflow-hidden group hover:border-purple-400/50 transition-colors h-full flex flex-col">
                  <CardContent className="p-0 flex-1 flex flex-col">
                    <div className="aspect-square relative overflow-hidden">
                      <img
                        src={sample.image}
                        alt={sample.prompt}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        onError={(e) => {
                          console.log(`Failed to load image: ${sample.image}`);
                          // Fallback to a placeholder if image fails to load
                          (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800&h=800&fit=crop&crop=center";
                        }}
                      />
                      <div className="absolute top-2 right-2">
                        <span className="bg-purple-600/80 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                          {sample.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-3 sm:p-4 flex-1 flex flex-col">
                      <p className="text-gray-300 text-sm mb-4 leading-relaxed line-clamp-3 flex-1">
                        {sample.prompt}
                      </p>
                      <div className="flex flex-col gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyPrompt(sample.prompt)}
                          className="w-full border-purple-500/30 text-purple-300 hover:bg-purple-500/10 text-xs sm:text-sm"
                        >
                          <Copy className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          Copy Prompt
                        </Button>
                        {user ? (
                          <Button
                            size="sm"
                            onClick={() => usePrompt(sample.prompt)}
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-xs sm:text-sm"
                          >
                            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                            Use Prompt
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            asChild
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-xs sm:text-sm"
                          >
                            <Link to="/auth">
                              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                              Sign In
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-400 mb-6">
              Ready to create your own masterpiece?
            </p>
            {user ? (
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                asChild
              >
                <Link to="/generate">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Start Creating
                </Link>
              </Button>
            ) : (
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                asChild
              >
                <Link to="/auth">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Sign Up to Get Started
                </Link>
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Samples;
