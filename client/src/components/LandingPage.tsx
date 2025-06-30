import React from 'react';
import { useNavigate } from 'react-router-dom';
import Badge from '../Badge';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-red-500 via-pink-500 to-purple-500 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-700">
      <div className="flex flex-col items-center justify-center flex-1 px-4 pt-24 pb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-4 drop-shadow-lg">
          Transform Your Life with <br />
          <span className="text-yellow-300">AI-Powered Planning</span>
        </h1>
        <p className="text-lg md:text-xl text-white text-center mb-8 max-w-2xl drop-shadow">
          Get personalized recommendations for health, finance, and lifestyle based on your unique goals and circumstances.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <button
            className="bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg text-lg transition-all"
            onClick={() => navigate('/login')}
          >
            Start Your Journey
          </button>
          <button
            className="border border-pink-200 text-pink-200 font-semibold py-3 px-8 rounded-lg text-lg transition-all cursor-not-allowed opacity-60"
            disabled
          >
            View Demo
          </button>
        </div>
      </div>
      <div className="bg-neutral-900 bg-opacity-90 py-16 px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Why Choose AI Life Planner?</h2>
        <p className="text-lg text-neutral-300 max-w-2xl mx-auto">
          Experience the power of artificial intelligence combined with personalized life coaching.
        </p>
      </div>
      <div className="absolute left-4 bottom-4">
        <Badge />
      </div>
    </div>
  );
};

export default LandingPage;
