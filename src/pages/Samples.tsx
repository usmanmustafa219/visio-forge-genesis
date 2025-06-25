
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
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
    image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=400&fit=crop"
  },
  {
    id: 2,
    prompt: "Cyberpunk cityscape at night with neon lights, flying cars, and holographic advertisements, futuristic architecture",
    category: "Sci-Fi",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop"
  },
  {
    id: 3,
    prompt: "Portrait of a wise elderly wizard with a long white beard, magical robes, holding a glowing staff, fantasy art style",
    category: "Portrait",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop"
  },
  {
    id: 4,
    prompt: "Serene mountain lake at sunrise with misty peaks, reflection in water, peaceful nature scene, photorealistic",
    category: "Nature",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop"
  },
  {
    id: 5,
    prompt: "Abstract geometric shapes in vibrant colors, flowing patterns, digital art, modern contemporary style",
    category: "Abstract",
    image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop"
  },
  {
    id: 6,
    prompt: "Ancient Greek temple with marble columns, golden hour lighting, architectural details, classical style",
    category: "Architecture",
    image: "https://images.unsplash.com/photo-1555993539-1732b0258815?w=400&h=400&fit=crop"
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
    // Navigate to generate page with the prompt
    const params = new URLSearchParams({ prompt });
    window.location.href = `/generate?${params.toString()}`;
  };

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
              Sample Gallery
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Get inspired by these sample images and prompts. Click to copy the prompt and create your own version!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sampleImages.map((sample) => (
              <motion.div
                key={sample.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: sample.id * 0.1 }}
              >
                <Card className="bg-slate-800/50 border-purple-500/30 backdrop-blur-sm overflow-hidden group hover:border-purple-400/50 transition-colors">
                  <CardContent className="p-0">
                    <div className="aspect-square relative overflow-hidden">
                      <img
                        src={sample.image}
                        alt={sample.prompt}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 right-2">
                        <span className="bg-purple-600/80 text-white text-xs px-2 py-1 rounded-full">
                          {sample.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                        {sample.prompt}
                      </p>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyPrompt(sample.prompt)}
                          className="flex-1 border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Prompt
                        </Button>
                        {user ? (
                          <Button
                            size="sm"
                            onClick={() => usePrompt(sample.prompt)}
                            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                          >
                            <Sparkles className="w-4 h-4 mr-2" />
                            Use Prompt
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            asChild
                            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                          >
                            <Link to="/auth">
                              <Sparkles className="w-4 h-4 mr-2" />
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
