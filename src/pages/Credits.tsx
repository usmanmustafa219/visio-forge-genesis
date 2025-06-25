
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Zap, Check, Star } from 'lucide-react';
import { Navbar } from '@/components/Navbar';

const Credits = () => {
  const plans = [
    {
      name: 'Starter',
      credits: 50,
      price: 9.99,
      popular: false,
      features: [
        '50 Image Generations',
        'Standard Quality',
        'All Image Sizes',
        'Basic Support'
      ]
    },
    {
      name: 'Creator',
      credits: 150,
      price: 24.99,
      popular: true,
      features: [
        '150 Image Generations',
        'High Quality Available',
        'All Image Sizes',
        'Priority Support',
        'Early Access Features'
      ]
    },
    {
      name: 'Professional',
      credits: 500,
      price: 79.99,
      popular: false,
      features: [
        '500 Image Generations',
        'Ultra High Quality',
        'All Image Sizes',
        'Premium Support',
        'Commercial License',
        'Bulk Download'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <Navbar />

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

        <div className="grid md:grid-cols-3 gap-8 mb-12 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    Most Popular
                  </div>
                </div>
              )}
              
              <Card className={`bg-slate-800/50 border-purple-500/30 backdrop-blur-sm h-full ${
                plan.popular ? 'ring-2 ring-purple-500/50' : ''
              }`}>
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <CardDescription className="text-gray-300">
                    Perfect for {plan.name.toLowerCase()} users
                  </CardDescription>
                  <div className="pt-4">
                    <div className="text-4xl font-bold text-white mb-2">
                      ${plan.price}
                    </div>
                    <div className="flex items-center justify-center text-cyan-400">
                      <Zap className="w-4 h-4 mr-1" />
                      <span className="font-medium">{plan.credits} Credits</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center text-gray-300">
                        <Check className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700' 
                        : 'bg-slate-700 hover:bg-slate-600'
                    }`}
                  >
                    Get {plan.credits} Credits
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
                <CardTitle className="text-lg">Can I upgrade anytime?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Yes! You can purchase additional credits at any time. They'll be added to your existing balance.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-purple-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Commercial usage?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Professional plan includes commercial license. Other plans are for personal use only.
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
