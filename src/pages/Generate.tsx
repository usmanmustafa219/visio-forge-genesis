
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useImageGeneration } from '@/hooks/useImageGeneration';
import { usePromptEnhancer } from '@/hooks/usePromptEnhancer';
import { Sparkles, Download, Wand2, Video, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

const Generate = () => {
  const [searchParams] = useSearchParams();
  const [prompt, setPrompt] = useState(searchParams.get('prompt') || '');
  const [originalPrompt, setOriginalPrompt] = useState('');
  const [quality, setQuality] = useState('standard');
  const [size, setSize] = useState('1024x1024');
  const [category, setCategory] = useState('');
  const [style, setStyle] = useState('');
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [contentType, setContentType] = useState<'image' | 'video'>('image');
  const [isPromptEnhanced, setIsPromptEnhanced] = useState(false);

  const { generateImage, isGenerating } = useImageGeneration();
  const { enhancePrompt, isEnhancing } = usePromptEnhancer();

  useEffect(() => {
    const urlPrompt = searchParams.get('prompt');
    if (urlPrompt) {
      setPrompt(urlPrompt);
    }
  }, [searchParams]);

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    // Create base params object
    const baseParams = {
      prompt,
      quality,
      category: category || undefined,
      style: style || undefined,
      contentType,
    };

    // Add size only for images by creating a new object
    const generationParams = contentType === 'image' 
      ? { ...baseParams, size }
      : baseParams;

    generateImage(generationParams, {
      onSuccess: (data) => {
        if (contentType === 'video' && data.videoUrl) {
          setGeneratedContent(data.videoUrl);
        } else if (contentType === 'image' && data.imageUrl) {
          setGeneratedContent(data.imageUrl);
        }
      },
    });
  };

  const handleEnhancePrompt = () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt first');
      return;
    }

    setOriginalPrompt(prompt);
    enhancePrompt(prompt, {
      onSuccess: (enhancedPrompt) => {
        setPrompt(enhancedPrompt);
        setIsPromptEnhanced(true);
      },
    });
  };

  const handleRevertPrompt = () => {
    setPrompt(originalPrompt);
    setIsPromptEnhanced(false);
    setOriginalPrompt('');
  };

  const downloadContent = () => {
    if (generatedContent) {
      const link = document.createElement('a');
      link.href = generatedContent;
      const extension = contentType === 'video' ? 'mp4' : 'png';
      link.download = `visiomancer-${contentType}-${Date.now()}.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const getCreditsNeeded = () => {
    if (contentType === 'video') {
      return quality === 'hd' ? 25 : 15;
    }
    return quality === 'hd' ? 8 : 3;
  };

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
              Generate Your Vision
            </h1>
            <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto">
              Transform your ideas into stunning visuals with the power of AI
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Generation Form */}
            <Card className="bg-slate-800/50 border-purple-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Sparkles className="w-6 h-6 text-purple-400" />
                  <span>Create Something Amazing</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Content Type Selection */}
                <div className="space-y-2">
                  <Label className="text-gray-300">Content Type</Label>
                  <div className="flex space-x-4">
                    <Button
                      variant={contentType === 'image' ? 'default' : 'outline'}
                      onClick={() => setContentType('image')}
                      className={`flex-1 ${contentType === 'image' ? 'bg-purple-600 hover:bg-purple-700' : 'border-purple-500/30 text-purple-300 hover:bg-purple-500/10'}`}
                    >
                      <ImageIcon className="w-4 h-4 mr-2" />
                      Image
                    </Button>
                    <Button
                      variant={contentType === 'video' ? 'default' : 'outline'}
                      onClick={() => setContentType('video')}
                      className={`flex-1 ${contentType === 'video' ? 'bg-purple-600 hover:bg-purple-700' : 'border-purple-500/30 text-purple-300 hover:bg-purple-500/10'}`}
                    >
                      <Video className="w-4 h-4 mr-2" />
                      Video
                    </Button>
                  </div>
                </div>

                {/* Prompt Input */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="prompt" className="text-gray-300">
                      Describe your {contentType === 'video' ? 'animation' : 'image'}
                    </Label>
                    <div className="flex space-x-2">
                      {isPromptEnhanced && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleRevertPrompt}
                          className="border-yellow-500/30 text-yellow-300 hover:bg-yellow-500/10"
                        >
                          Revert
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleEnhancePrompt}
                        disabled={isEnhancing || !prompt.trim()}
                        className="border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
                      >
                        <Wand2 className="w-4 h-4 mr-1" />
                        {isEnhancing ? 'Enhancing...' : 'Enhance'}
                      </Button>
                    </div>
                  </div>
                  <Textarea
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={`Describe the ${contentType === 'video' ? 'animated scene' : 'image'} you want to create...`}
                    className={`bg-slate-700/50 border-purple-500/30 text-white placeholder-gray-400 ${isPromptEnhanced ? 'border-cyan-400/50 bg-cyan-900/10' : ''}`}
                    rows={4}
                  />
                  {isPromptEnhanced && (
                    <p className="text-xs text-cyan-300">✨ Prompt has been enhanced by AI</p>
                  )}
                </div>

                {/* Style and Category */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-300">Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className="bg-slate-700/50 border-purple-500/30 text-white">
                        <SelectValue placeholder="Choose category" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-purple-500/30 text-white">
                        <SelectItem value="">None</SelectItem>
                        <SelectItem value="fantasy">Fantasy</SelectItem>
                        <SelectItem value="sci-fi">Sci-Fi</SelectItem>
                        <SelectItem value="nature">Nature</SelectItem>
                        <SelectItem value="portrait">Portrait</SelectItem>
                        <SelectItem value="abstract">Abstract</SelectItem>
                        <SelectItem value="architecture">Architecture</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Style</Label>
                    <Select value={style} onValueChange={setStyle}>
                      <SelectTrigger className="bg-slate-700/50 border-purple-500/30 text-white">
                        <SelectValue placeholder="Choose style" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-purple-500/30 text-white">
                        <SelectItem value="">None</SelectItem>
                        <SelectItem value="photorealistic">Photorealistic</SelectItem>
                        <SelectItem value="digital art">Digital Art</SelectItem>
                        <SelectItem value="oil painting">Oil Painting</SelectItem>
                        <SelectItem value="watercolor">Watercolor</SelectItem>
                        <SelectItem value="cyberpunk">Cyberpunk</SelectItem>
                        <SelectItem value="minimalist">Minimalist</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Quality and Size (Size only for Images) */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-300">Quality</Label>
                    <Select value={quality} onValueChange={setQuality}>
                      <SelectTrigger className="bg-slate-700/50 border-purple-500/30 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-purple-500/30 text-white">
                        {contentType === 'video' ? (
                          <>
                            <SelectItem value="standard">Standard (15 credits)</SelectItem>
                            <SelectItem value="hd">HD (25 credits)</SelectItem>
                          </>
                        ) : (
                          <>
                            <SelectItem value="standard">Standard (3 credits)</SelectItem>
                            <SelectItem value="hd">HD (8 credits)</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  {contentType === 'image' && (
                    <div className="space-y-2">
                      <Label className="text-gray-300">Size</Label>
                      <Select value={size} onValueChange={setSize}>
                        <SelectTrigger className="bg-slate-700/50 border-purple-500/30 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-purple-500/30 text-white">
                          <SelectItem value="1024x1024">Square (1024x1024)</SelectItem>
                          <SelectItem value="1792x1024">Landscape (1792x1024)</SelectItem>
                          <SelectItem value="1024x1792">Portrait (1024x1792)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                {/* Generate Button */}
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim()}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 py-6 text-lg"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Generating {contentType}...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Generate {contentType === 'video' ? 'Video' : 'Image'} ({getCreditsNeeded()} credits)
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Generated Result */}
            <Card className="bg-slate-800/50 border-purple-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {contentType === 'video' ? (
                    <Video className="w-6 h-6 text-cyan-400" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-cyan-400" />
                  )}
                  <span>Generated Result</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {generatedContent ? (
                  <div className="space-y-4">
                    <div className="aspect-square bg-slate-700/30 rounded-lg overflow-hidden">
                      {contentType === 'video' ? (
                        <video
                          src={generatedContent}
                          controls
                          autoPlay
                          loop
                          muted
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <img
                          src={generatedContent}
                          alt="Generated"
                          className="w-full h-full object-contain"
                        />
                      )}
                    </div>
                    <Button
                      onClick={downloadContent}
                      className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Download {contentType === 'video' ? 'Video' : 'Image'}
                    </Button>
                  </div>
                ) : (
                  <div className="aspect-square bg-slate-700/30 rounded-lg flex items-center justify-center border-2 border-dashed border-purple-500/30">
                    <div className="text-center">
                      {contentType === 'video' ? (
                        <Video className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                      ) : (
                        <ImageIcon className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                      )}
                      <p className="text-gray-400">Your generated {contentType} will appear here</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Generate;
