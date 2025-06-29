
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';
import { Sparkles, Wand2, Settings, Loader2, AlertCircle } from 'lucide-react';
import { useImageGeneration } from '@/hooks/useImageGeneration';
import { useSearchParams } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Generate = () => {
  const [searchParams] = useSearchParams();
  const [prompt, setPrompt] = useState('');
  const [category, setCategory] = useState('');
  const [style, setStyle] = useState('');
  const [quality, setQuality] = useState('standard');
  const [size, setSize] = useState('1024x1024');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generationProgress, setGenerationProgress] = useState(0);

  const { generateImage, isGenerating } = useImageGeneration();

  // Handle URL parameters for pre-filled prompts
  useEffect(() => {
    const urlPrompt = searchParams.get('prompt');
    if (urlPrompt) {
      setPrompt(urlPrompt);
    }
  }, [searchParams]);

  // Simulate progress during generation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGenerating) {
      setGenerationProgress(0);
      interval = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 10;
        });
      }, 1000);
    } else {
      setGenerationProgress(0);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  const handleGenerate = () => {
    if (!prompt.trim()) {
      return;
    }

    if (prompt.trim().length < 3) {
      return;
    }

    setGeneratedImage(null);
    generateImage({
      prompt: prompt.trim(),
      quality,
      size,
      category,
      style,
    }, {
      onSuccess: (data) => {
        setGeneratedImage(data.imageUrl);
        setGenerationProgress(100);
      }
    });
  };

  const isPromptValid = prompt.trim().length >= 3;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Generate Image
            </h1>
            <p className="text-gray-300 text-base sm:text-lg">
              Describe your vision and watch AI bring it to life
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Generation Form */}
            <Card className="bg-slate-800/50 border-purple-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                  <Wand2 className="w-5 h-5 text-purple-400" />
                  <span>Create Your Image</span>
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Describe what you want to see and customize the generation settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Prompt <span className="text-red-400">*</span>
                  </label>
                  <Textarea
                    placeholder="A mystical forest with glowing mushrooms and floating crystals under a starry sky..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="bg-slate-700/50 border-purple-500/30 text-white placeholder-gray-400 min-h-[100px] text-sm sm:text-base"
                  />
                  {prompt.length > 0 && prompt.length < 3 && (
                    <p className="text-red-400 text-xs mt-1">
                      Please provide at least 3 characters for a better prompt
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className="bg-slate-700/50 border-purple-500/30 text-white text-sm sm:text-base">
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
                      <SelectTrigger className="bg-slate-700/50 border-purple-500/30 text-white text-sm sm:text-base">
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Quality</label>
                    <Select value={quality} onValueChange={setQuality}>
                      <SelectTrigger className="bg-slate-700/50 border-purple-500/30 text-white text-sm sm:text-base">
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
                      <SelectTrigger className="bg-slate-700/50 border-purple-500/30 text-white text-sm sm:text-base">
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

                {!isPromptValid && prompt.length > 0 && (
                  <Alert className="bg-red-900/20 border-red-500/30">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-red-300">
                      Please provide a more detailed prompt (at least 3 characters)
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  onClick={handleGenerate}
                  disabled={!isPromptValid || isGenerating}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-base sm:text-lg py-3 sm:py-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Generating... {Math.round(generationProgress)}%
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
                <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                  <Settings className="w-5 h-5 text-cyan-400" />
                  <span>Preview</span>
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Your generated image will appear here
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-slate-700/50 rounded-lg flex items-center justify-center border-2 border-dashed border-purple-500/30">
                  {isGenerating ? (
                    <div className="text-center text-gray-400 p-4">
                      <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin" />
                      <p className="text-lg font-medium mb-2">Creating Magic</p>
                      <p className="text-sm mb-2">Please wait while we generate your image...</p>
                      <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                        <div 
                          className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${generationProgress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500">{Math.round(generationProgress)}% complete</p>
                    </div>
                  ) : generatedImage ? (
                    <img 
                      src={generatedImage} 
                      alt="Generated image" 
                      className="w-full h-full object-contain rounded-lg"
                    />
                  ) : (
                    <div className="text-center text-gray-400 p-4">
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
