
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';
import { Sparkles, Wand2, Settings, Loader2 } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { useImageGeneration } from '@/hooks/useImageGeneration';
import { useSearchParams } from 'react-router-dom';

const Generate = () => {
  const [searchParams] = useSearchParams();
  const [prompt, setPrompt] = useState('');
  const [category, setCategory] = useState('');
  const [style, setStyle] = useState('');
  const [quality, setQuality] = useState('standard');
  const [size, setSize] = useState('1024x1024');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const { generateImage, isGenerating } = useImageGeneration();

  // Handle URL parameters for pre-filled prompts
  useEffect(() => {
    const urlPrompt = searchParams.get('prompt');
    if (urlPrompt) {
      setPrompt(urlPrompt);
    }
  }, [searchParams]);

  const handleGenerate = () => {
    if (!prompt.trim()) return;

    generateImage({
      prompt,
      quality,
      size,
      category,
      style,
    }, {
      onSuccess: (data) => {
        setGeneratedImage(data.imageUrl);
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <Navbar />

      <div className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Generate Image
            </h1>
            <p className="text-gray-300 text-lg">
              Describe your vision and watch AI bring it to life
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Generation Form */}
            <Card className="bg-slate-800/50 border-purple-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Wand2 className="w-5 h-5 text-purple-400" />
                  <span>Create Your Image</span>
                </CardTitle>
                <CardDescription>
                  Describe what you want to see and customize the generation settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Prompt</label>
                  <Textarea
                    placeholder="A mystical forest with glowing mushrooms and floating crystals under a starry sky..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="bg-slate-700/50 border-purple-500/30 text-white placeholder-gray-400 min-h-[100px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className="bg-slate-700/50 border-purple-500/30 text-white">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-purple-500/30 text-white">
                        <SelectItem value="nature">Nature</SelectItem>
                        <SelectItem value="sci-fi">Sci-Fi</SelectItem>
                        <SelectItem value="fantasy">Fantasy</SelectItem>
                        <SelectItem value="portrait">Portrait</SelectItem>
                        <SelectItem value="abstract">Abstract</SelectItem>
                        <SelectItem value="architecture">Architecture</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Style</label>
                    <Select value={style} onValueChange={setStyle}>
                      <SelectTrigger className="bg-slate-700/50 border-purple-500/30 text-white">
                        <SelectValue placeholder="Select style" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-purple-500/30 text-white">
                        <SelectItem value="realistic">Realistic</SelectItem>
                        <SelectItem value="artistic">Artistic</SelectItem>
                        <SelectItem value="cartoon">Cartoon</SelectItem>
                        <SelectItem value="anime">Anime</SelectItem>
                        <SelectItem value="vintage">Vintage</SelectItem>
                        <SelectItem value="modern">Modern</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Quality</label>
                    <Select value={quality} onValueChange={setQuality}>
                      <SelectTrigger className="bg-slate-700/50 border-purple-500/30 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-purple-500/30 text-white">
                        <SelectItem value="standard">Standard (3 credits)</SelectItem>
                        <SelectItem value="hd">HD (8 credits)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Size</label>
                    <Select value={size} onValueChange={setSize}>
                      <SelectTrigger className="bg-slate-700/50 border-purple-500/30 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-purple-500/30 text-white">
                        <SelectItem value="1024x1024">1024×1024 (Square)</SelectItem>
                        <SelectItem value="1792x1024">1792×1024 (Landscape)</SelectItem>
                        <SelectItem value="1024x1792">1024×1792 (Portrait)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || isGenerating}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg py-6"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Generate Image
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Preview Area */}
            <Card className="bg-slate-800/50 border-purple-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="w-5 h-5 text-cyan-400" />
                  <span>Preview</span>
                </CardTitle>
                <CardDescription>
                  Your generated image will appear here
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-slate-700/50 rounded-lg flex items-center justify-center border-2 border-dashed border-purple-500/30">
                  {isGenerating ? (
                    <div className="text-center text-gray-400">
                      <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin" />
                      <p className="text-lg font-medium mb-2">Creating Magic</p>
                      <p className="text-sm">Please wait while we generate your image...</p>
                    </div>
                  ) : generatedImage ? (
                    <img 
                      src={generatedImage} 
                      alt="Generated image" 
                      className="w-full h-full object-contain rounded-lg"
                    />
                  ) : (
                    <div className="text-center text-gray-400">
                      <Sparkles className="w-12 h-12 mx-auto mb-4" />
                      <p className="text-lg font-medium mb-2">Ready to Create</p>
                      <p className="text-sm">Enter a prompt and click generate to see your image</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Generate;
