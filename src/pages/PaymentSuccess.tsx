import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { CheckCircle, Zap, ArrowRight, Loader2 } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const { data: paymentSession, isLoading } = useQuery({
    queryKey: ['payment-session', sessionId],
    queryFn: async () => {
      if (!sessionId) return null;
      
      const { data, error } = await supabase
        .from('payment_sessions')
        .select(`
          *,
          credit_packages (
            name,
            credits,
            price_cents
          )
        `)
        .eq('stripe_session_id', sessionId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!sessionId,
    refetchInterval: (query) => {
      // Keep refetching until payment is completed
      return query.data?.status === 'completed' ? false : 2000;
    },
  });

  if (!sessionId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        <Navbar />
        <div className="container mx-auto px-6 py-8 flex items-center justify-center">
          <Card className="bg-slate-800/50 border-red-500/30 backdrop-blur-sm max-w-md">
            <CardContent className="p-8 text-center">
              <h2 className="text-xl font-semibold mb-2 text-red-400">Invalid Session</h2>
              <p className="text-gray-300 mb-4">No payment session found.</p>
              <Button asChild className="bg-purple-600 hover:bg-purple-700">
                <Link to="/credits">Back to Credits</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isLoading || !paymentSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        <Navbar />
        <div className="container mx-auto px-6 py-8 flex items-center justify-center">
          <Card className="bg-slate-800/50 border-purple-500/30 backdrop-blur-sm max-w-md">
            <CardContent className="p-8 text-center">
              <Loader2 className="w-12 h-12 animate-spin text-purple-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Processing Payment...</h2>
              <p className="text-gray-300">Please wait while we confirm your payment.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <Navbar />

      <div className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="bg-slate-800/50 border-green-500/30 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle className="w-8 h-8 text-green-400" />
              </motion.div>
              <CardTitle className="text-3xl font-bold text-green-400 mb-2">
                Payment Successful!
              </CardTitle>
              <CardDescription className="text-gray-300 text-lg">
                Your credits have been added to your account
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Payment Details */}
              <div className="bg-slate-700/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Zap className="w-5 h-5 text-yellow-400 mr-2" />
                  Purchase Details
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Package:</span>
                    <span className="font-medium">{paymentSession.credit_packages?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Credits Added:</span>
                    <span className="font-medium text-yellow-400">
                      {paymentSession.credits} credits
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Amount Paid:</span>
                    <span className="font-medium">
                      ${(paymentSession.amount_cents / 100).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status:</span>
                    <span className="font-medium text-green-400 capitalize">
                      {paymentSession.status}
                    </span>
                  </div>
                  {paymentSession.is_test && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Mode:</span>
                      <span className="font-medium text-blue-400">Test Payment</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Next Steps */}
              <div className="text-center space-y-4">
                <p className="text-gray-300">
                  Ready to start creating amazing AI-generated images?
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    <Link to="/generate">
                      Start Creating
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="border-slate-600 text-slate-300 hover:bg-slate-700">
                    <Link to="/dashboard">Go to Dashboard</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
