import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Zap, Check, Star, CreditCard, Loader2 } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';
import { toast } from 'sonner';

const Credits = () => {
  const [loadingPackage, setLoadingPackage] = useState<string | null>(null);

  // Fetch credit packages from database
  const { data: packages, isLoading } = useQuery({
    queryKey: ['credit-packages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('credit_packages')
        .select('*')
        .eq('active', true)
        .order('credits', { ascending: true });

      if (error) throw error;
      return data || [];
    },
  });

  // Purchase mutation
  const purchaseMutation = useMutation({
    mutationFn: async (packageId: string) => {
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { packageId },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      if (data.url) {
        // Open Stripe checkout in new tab
        window.open(data.url, '_blank');
      }
      setLoadingPackage(null);
    },
    onError: (error) => {
      console.error('Purchase error:', error);
      toast.error('Failed to start checkout. Please try again.');
      setLoadingPackage(null);
    },
  });

  const handlePurchase = (packageId: string) => {
    setLoadingPackage(packageId);
    purchaseMutation.mutate(packageId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        <div className="container mx-auto px-6 py-8 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Get More Credits
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Purchase credits to continue creating amazing AI-generated images. 
            Choose the plan that fits your creative needs.
          </p>
        </motion.div>

        {/* Test Mode Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4 mb-8 max-w-4xl mx-auto"
        >
          <div className="flex items-center justify-center space-x-2 mb-2">
            <CreditCard className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-blue-300">Test Mode Active</h3>
          </div>
          <p className="text-center text-blue-200 text-sm">
            Use test card: <strong>4242 4242 4242 4242</strong> (any future expiry, any CVV)
            <br />
            This is a test environment – no real money will be charged.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12 max-w-7xl mx-auto">
          {packages?.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative"
            >
              {pkg.discount_percentage > 0 && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
                    <Star className="w-3 h-3 mr-1" />
                    Save {pkg.discount_percentage}%
                  </div>
                </div>
              )}
              
              <Card className={`bg-slate-800/50 border-purple-500/30 backdrop-blur-sm h-full ${
                pkg.discount_percentage >= 15 ? 'ring-2 ring-purple-500/50' : ''
              }`}>
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-xl font-bold">{pkg.name}</CardTitle>
                  <div className="pt-2">
                    <div className="text-3xl font-bold text-white mb-2">
                      ${(pkg.price_cents / 100).toFixed(2)}
                    </div>
                    <div className="flex items-center justify-center text-cyan-400">
                      <Zap className="w-4 h-4 mr-1" />
                      <span className="font-medium">{pkg.credits} Credits</span>
                    </div>
                    {pkg.discount_percentage > 0 && (
                      <div className="text-green-400 text-sm mt-1">
                        {pkg.discount_percentage}% off
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-2 mb-6 text-sm">
                    <li className="flex items-center text-gray-300">
                      <Check className="w-3 h-3 text-green-400 mr-2 flex-shrink-0" />
                      {pkg.credits} Image Generations
                    </li>
                    <li className="flex items-center text-gray-300">
                      <Check className="w-3 h-3 text-green-400 mr-2 flex-shrink-0" />
                      All Quality Options
                    </li>
                    <li className="flex items-center text-gray-300">
                      <Check className="w-3 h-3 text-green-400 mr-2 flex-shrink-0" />
                      All Image Sizes
                    </li>
                    {pkg.discount_percentage >= 15 && (
                      <li className="flex items-center text-gray-300">
                        <Check className="w-3 h-3 text-green-400 mr-2 flex-shrink-0" />
                        Best Value
                      </li>
                    )}
                  </ul>
                  <Button 
                    className={`w-full text-sm ${
                      pkg.discount_percentage >= 15
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700' 
                        : 'bg-slate-700 hover:bg-slate-600'
                    }`}
                    onClick={() => handlePurchase(pkg.id)}
                    disabled={loadingPackage === pkg.id}
                  >
                    {loadingPackage === pkg.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      `Buy ${pkg.credits} Credits`
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-slate-800/50 border-purple-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">How do credits work?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Each image generation costs credits based on quality: Standard (3), Medium (5), or High (8) credits per image.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-purple-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Do credits expire?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  No! Your credits never expire. Use them at your own pace whenever inspiration strikes.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-purple-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Is this real money?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  This is currently in test mode. Use test card 4242 4242 4242 4242 to simulate purchases. No real charges will occur.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-purple-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Instant delivery?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Yes! Credits are added to your account immediately after successful payment completion.
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Credits;
