import React, { useState } from 'react';
import { Mail, Lock, AtSign } from 'lucide-react';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import Card from '../../ui/Card';
import { supabase } from '../../../utils/supabase';

interface SignupPageProps {
  onSignupSuccess: () => void;
  onSwitchToLogin: () => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onSignupSuccess, onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: name }
      }
    });

    setLoading(false);

    if (error) {
      alert('Signup failed: ' + error.message);
    } else {
      alert('Signup successful! Please check your email to confirm.');
      onSignupSuccess();
    }
  };

  const handleGmailSignup = async () => {
    setLoading(true);

    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });

    setLoading(false);

    if (error) {
      alert('Google signup failed: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-neutral-900 dark:to-neutral-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">AI</span>
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
            Create your account
          </h1>
          <p className="text-neutral-600 dark:text-neutral-300">
            Start your journey with Life Planner
          </p>
        </div>

        <Card padding="lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="text"
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your display name"
              required
            />

            <Input
              type="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              icon={<Mail size={16} className="text-neutral-400" />}
              required
            />

            <Input
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              icon={<Lock size={16} className="text-neutral-400" />}
              required
            />

            <Button
              type="submit"
              size="lg"
              loading={loading}
              className="w-full"
            >
              Sign Up
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-300 dark:border-neutral-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white dark:bg-neutral-800 px-2 text-neutral-500 dark:text-neutral-400">
                  Or continue with
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={handleGmailSignup}
              loading={loading}
              className="w-full mt-4"
            >
              <AtSign size={20} className="mr-2" />
              Sign up with Gmail
            </Button>
          </div>

          <div className="mt-6 text-center">
            <button
              className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400"
              onClick={onSwitchToLogin}
            >
              Already have an account? Log in
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SignupPage;
