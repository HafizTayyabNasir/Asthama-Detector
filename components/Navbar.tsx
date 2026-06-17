import Link from 'next/link';
import { Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-blue-600 p-1.5 rounded-lg group-hover:bg-blue-700 transition-colors">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-gray-900">BreathSense</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Home</Link>
          <Link href="/#features" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Features</Link>
          <Link href="/#how-it-works" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">How it Works</Link>
          <Link href="/asthma-simulation" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Simulation</Link>
          <Button asChild className="rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 bg-blue-600 hover:bg-blue-700 text-white">
            <Link href="/predictor">Predict Asthma Risk</Link>
          </Button>
        </div>

        <div className="md:hidden">
          <Button asChild variant="default" className="rounded-full bg-blue-600 hover:bg-blue-700 text-white">
            <Link href="/predictor">Predict</Link>
          </Button>
        </div>
      </div>
    </nav>
  )
}
