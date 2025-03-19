import React from 'react';
import { Link } from 'react-router-dom';
import { Wand2, Sparkles, Zap } from 'lucide-react';

export function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Transform Your Ideas Into
            <span className="text-purple-600"> Stunning Images</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Create beautiful, unique images in seconds using our advanced AI technology.
            Perfect for artists, designers, and creators.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/generate"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
            >
              <Wand2 className="mr-2 h-5 w-5" />
              Start Creating
            </Link>
            <Link
              to="/pricing"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              View Plans
            </Link>
          </div>
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Wand2 className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI-Powered Creation</h3>
            <p className="text-gray-600">Transform text descriptions into stunning visual masterpieces with our advanced AI technology.</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Endless Possibilities</h3>
            <p className="text-gray-600">Create any style, any scene, any vision you can imagine with unlimited creative potential.</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Zap className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
            <p className="text-gray-600">Generate high-quality images in seconds, not hours. Perfect for rapid prototyping and ideation.</p>
          </div>
        </div>
      </div>
    </div>
  );
}