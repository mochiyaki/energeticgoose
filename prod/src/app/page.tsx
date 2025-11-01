import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Shield, TrendingUp, Zap, Globe, Lock, CheckCircle } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold">Energetic Goose</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#how-it-works" className="text-sm font-medium hover:text-primary">How It Works</a>
            <a href="#benefits" className="text-sm font-medium hover:text-primary">Benefits</a>
            <a href="#security" className="text-sm font-medium hover:text-primary">Security</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/signin">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started <ArrowRight className="ml-2 w-4 h-4" /></Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Energetic Goose: Tokenize Invoices. Accelerate Cash Flow.
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Advance 80% at ~7% APY, settle cross-border with 0% FX markup, and let our AI agent optimize AR/AP.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8">
                Sign Up Your Organization
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/signin">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What We Do</h2>
          <p className="text-lg text-muted-foreground">
            Transform your outstanding invoices into instant liquidity through tokenized financing on Centrifuge, 
            powered by AI-driven treasury management.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="container mx-auto px-4 py-16 bg-white">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <CardTitle>Upload Invoice</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Upload your outstanding invoices (PDF or image) to our secure platform.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-purple-600">2</span>
              </div>
              <CardTitle>Convert to Contract</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Our system tokenizes your invoice into a smart contract on Centrifuge.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <CardTitle>Receive Advance</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Get up to 80% of invoice value instantly at competitive 7% APY rates.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-orange-600">4</span>
              </div>
              <CardTitle>AI Optimization</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Our AI agent manages your treasury, optimizing AR/AP and cash flow.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Energetic Goose</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">7% APY Loans</h3>
            <p className="text-muted-foreground">
              Competitive rates that beat traditional factoring by 3-5 percentage points.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">0% FX Markup</h3>
            <p className="text-muted-foreground">
              Cross-border settlements with zero foreign exchange markup fees.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI Treasury Agent</h3>
            <p className="text-muted-foreground">
              Intelligent automation for AR/AP management and cash flow optimization.
            </p>
          </div>
        </div>
      </section>

      {/* Security */}
      <section id="security" className="container mx-auto px-4 py-16 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <Shield className="w-12 h-12 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-center mb-4">Security & Compliance</h2>
          <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
            Built on Centrifuge's battle-tested infrastructure with institutional-grade security.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
              <div>
                <h4 className="font-semibold mb-1">Blockchain Security</h4>
                <p className="text-sm text-muted-foreground">
                  All contracts are immutable and transparent on-chain.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
              <div>
                <h4 className="font-semibold mb-1">Encrypted Data</h4>
                <p className="text-sm text-muted-foreground">
                  Your sensitive information is encrypted at rest and in transit.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
              <div>
                <h4 className="font-semibold mb-1">Regulatory Compliance</h4>
                <p className="text-sm text-muted-foreground">
                  Designed to meet KYC/AML requirements and financial regulations.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
              <div>
                <h4 className="font-semibold mb-1">Audit Trail</h4>
                <p className="text-sm text-muted-foreground">
                  Complete transparency with immutable transaction history.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Cash Flow?</h2>
          <p className="text-lg mb-8 opacity-90">
            Join leading businesses that are accelerating their growth with tokenized invoice financing.
          </p>
          <Link href="/signup">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Get Started Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold">Energetic Goose</span>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary">Terms</a>
              <a href="#" className="hover:text-primary">Privacy</a>
              <a href="#" className="hover:text-primary">Contact</a>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 Energetic Goose. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
