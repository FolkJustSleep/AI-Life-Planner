import React from 'react';
import Badge from '../Badge';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-neutral-100 dark:bg-neutral-900 transition-colors">
      <div className="flex flex-col items-center justify-center flex-1 px-4 pt-24 pb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white text-center mb-4">
          Transform Your Life with <br />
          <span className="text-[#16b1ff] dark:text-[#4fd1ff] font-extrabold">AI-Powered Planning</span>
        </h1>
        <p className="text-lg md:text-xl text-neutral-600 dark:text-[#7ca0b8] text-center mb-8 max-w-2xl">
          Get personalized recommendations for health, finance, and lifestyle based on your unique goals and circumstances.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <button
            type="button"
            className="bg-[#16b1ff] hover:bg-[#0e8ec7] dark:bg-[#4fd1ff] dark:hover:bg-[#16b1ff] text-white dark:text-neutral-900 font-semibold py-3 px-8 rounded-lg text-lg transition-all"
            onClick={onStart}
          >
            Start Your Journey
          </button>
        </div>
      </div>
      <div className="bg-neutral-200 dark:bg-[#18191a] py-16 px-4 text-center transition-colors">
        <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white mb-4">Why Choose AI Life Planner?</h2>
        <div className="text-lg text-neutral-700 dark:text-[#7ca0b8] max-w-2xl mx-auto space-y-4">
          <p>
            Experience the power of artificial intelligence combined with personalized life coaching.
          </p>
          <ul className="list-disc list-inside text-left mx-auto max-w-xl">
            <li>Personalized recommendations for your health, finance, and lifestyle goals.</li>
            <li>Smart tracking and insights to help you stay on top of your progress.</li>
            <li>Seamless integration of your goals, habits, and daily planning in one place.</li>
            <li>Secure and private: your data is protected and only used to help you grow.</li>
            <li>Easy-to-use interface designed for clarity and motivation.</li>
          </ul>
        </div>
      </div>
      <div className="absolute left-4 bottom-4">
        <Badge />
      </div>
    </div>
  );
};

export default LandingPage;
