import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Compass, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Failed to log in. Please check your credentials or contact the Blue Wisdom admin.');
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-bw-light flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-8">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-bw-navy rounded-full flex items-center justify-center mb-4 shadow-md">
            <Compass className="w-8 h-8 text-bw-gold" />
          </div>
          <h2 className="text-2xl font-bold text-bw-navy text-center">Team Compass</h2>
          <p className="text-gray-500 text-sm mt-1">Authorized Access Only</p>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-semibold text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-bw-navy mb-1">Work Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-bw-gold outline-none transition"
              placeholder="manager@bluewisdom.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-bw-navy mb-1">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-bw-gold outline-none transition"
              placeholder="••••••••"
            />
          </div>
          <button 
            disabled={loading}
            type="submit" 
            className="w-full bg-bw-navy text-white p-3 rounded-lg font-bold flex justify-center items-center gap-2 hover:bg-blue-900 transition disabled:opacity-75"
          >
            <Lock className="w-4 h-4" />
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
