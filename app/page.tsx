import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Activity, Shield, Zap, Brain } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pt-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 opacity-70" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-semibold mb-8">
              <Activity className="w-4 h-4" />
              <span>AI-Powered Medical Analysis</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-8 leading-tight">
              Predict Asthma Risk with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Machine Learning</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-3xl mx-auto">
              Early detection saves lives. Our advanced AI model analyzes symptoms, lifestyle, and clinical indicators to provide accurate asthma risk assessments in seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="h-14 px-8 text-lg rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <Link href="/predictor">
                  Start Prediction <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full border-gray-300 hover:bg-gray-50 transition-all duration-300">
                <Link href="/presentation">
                  Simulation & Modelling (Presentation)
                </Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Decorative background blobs */}
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30" />
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30" />
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose BreathSense?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Our platform combines cutting-edge technology with medical insights to deliver reliable results.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Brain className="w-8 h-8 text-purple-600" />}
              title="Machine Learning"
              description="Trained on thousands of patient records using logistic regression for high accuracy."
            />
            <FeatureCard 
              icon={<Zap className="w-8 h-8 text-amber-500" />}
              title="Instant Results"
              description="Get immediate risk assessment and confidence levels right after submitting your data."
            />
            <FeatureCard 
              icon={<Shield className="w-8 h-8 text-green-600" />}
              title="Secure & Private"
              description="Your data is processed safely and securely. We prioritize your privacy above all."
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="w-full md:w-1/2">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-purple-600/20 mix-blend-overlay"></div>
                <img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Doctor reviewing data" className="w-full h-auto object-cover" />
              </div>
            </div>
            <div className="w-full md:w-1/2 space-y-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
                <p className="text-lg text-gray-600">A simple three-step process to understand your asthma risk level.</p>
              </div>
              
              <div className="space-y-6">
                <Step number="1" title="Input Symptoms" description="Enter your current symptoms, medical history, and clinical indicators like FEV1." />
                <Step number="2" title="AI Analysis" description="Our ML model analyzes the complex relationships between all your inputs." />
                <Step number="3" title="Get Assessment" description="Receive a clear risk prediction, confidence score, and actionable next steps." />
              </div>
              
              <Button asChild size="lg" className="mt-8 rounded-full bg-blue-600 text-white hover:bg-blue-700">
                <Link href="/predictor">Try it now</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to check your respiratory health?</h2>
          <p className="text-blue-100 text-xl mb-10">Take the first step towards better breathing and health management.</p>
          <Button asChild size="lg" variant="secondary" className="h-14 px-10 text-lg rounded-full bg-white text-blue-600 hover:bg-gray-50 shadow-xl hover:-translate-y-1 transition-all duration-300">
            <Link href="/predictor">Go to Predictor Page</Link>
          </Button>
        </div>
      </section>
      
      <footer className="bg-gray-900 py-12 text-center text-gray-400">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Activity className="w-6 h-6 text-blue-500" />
          <span className="text-xl font-bold text-white">BreathSense</span>
        </div>
        <p>© 2026 BreathSense AI. Educational purposes only.</p>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
      <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  )
}

function Step({ number, title, description }: { number: string, title: string, description: string }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xl border-4 border-white shadow-sm">
        {number}
      </div>
      <div>
        <h4 className="text-xl font-bold text-gray-900 mb-1">{title}</h4>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  )
}
