import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Compass, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setMessage('');
      setError('');
      setLoading(true);
      await resetPassword(email);
      setMessage('Check your inbox for further instructions');
    } catch (err) {
      setError(`Failed to reset password: ${err.message}`);
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
          <h2 className="text-2xl font-bold text-bw-navy text-center">Password Reset</h2>
          <p className="text-gray-500 text-sm mt-1">We'll send you a recovery link</p>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-semibold text-center">{error}</div>}
        {message && <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm font-semibold text-center">{message}</div>}

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
          <button 
            disabled={loading}
            type="submit" 
            className="w-full bg-bw-navy text-white p-3 rounded-lg font-bold flex justify-center items-center gap-2 hover:bg-blue-900 transition disabled:opacity-75"
          >
            <Mail className="w-4 h-4" />
            {loading ? 'Sending...' : 'Reset Password'}
          </button>
        </form>

        <div className="text-center text-sm text-gray-500 flex flex-col gap-2">
          <Link to="/login" className="text-bw-navy font-bold hover:underline">Back to Sign In</Link>
          <span>Need an account? <Link to="/signup" className="text-bw-navy font-bold hover:underline">Sign Up</Link></span>
        </div>
      </div>
    </div>
  );
}
