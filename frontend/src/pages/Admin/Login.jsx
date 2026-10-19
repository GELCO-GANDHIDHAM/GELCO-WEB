import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Lock, Phone, KeyRound, AlertTriangle, CheckCircle, ArrowLeft } from 'lucide-react';
import api from '../../services/api';

export default function Login() {
  const navigate = useNavigate();
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [loginData, setLoginData] = useState({ mobileNumber: '', password: '' });
  const [forgotData, setForgotData] = useState({
    mobileNumber: '',
    secretCode: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  if (localStorage.getItem('gelco_admin_token')) {
    return <Navigate to="/admin/dashboard" />;
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await api.post('/admin/login', loginData);
      localStorage.setItem('gelco_admin_token', res.data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid mobile number or password');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (forgotData.newPassword !== forgotData.confirmPassword) {
      setError('New password and confirm password do not match.');
      return;
    }

    if (forgotData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/admin/reset-password', {
        mobileNumber: forgotData.mobileNumber,
        secretCode: forgotData.secretCode,
        newPassword: forgotData.newPassword,
      });

      setSuccess(res.data?.message || 'Password reset successfully! Please sign in.');
      setLoginData((prev) => ({
        ...prev,
        mobileNumber: forgotData.mobileNumber,
        password: '',
      }));
      setForgotData({
        mobileNumber: '',
        secretCode: '',
        newPassword: '',
        confirmPassword: '',
      });
      setIsForgotMode(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-gray-light flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex justify-center">
          <img src="/flower.png" alt="GELCO Logo" className="w-16 h-16 object-contain" />
        </div>
        <h2 className="mt-4 text-3xl font-extrabold text-brand-dark uppercase tracking-tight">
          {isForgotMode ? 'Reset Password' : 'Admin Login'}
        </h2>
        <div className="mt-2 flex items-center justify-center gap-1.5">
          <span className="text-sm text-brand-gray-mid">Secure portal for</span>
          <img src="/gelco_text.png" alt="GELCO" className="h-4 object-contain" />
          <span className="text-sm text-brand-gray-mid font-medium">PLUS ELECTRICALS</span>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-card sm:rounded-xl sm:px-10 border border-brand-gray-border">
          {error && (
            <div className="mb-6 p-3 bg-red-50 border-l-4 border-brand-red flex items-start rounded-r">
              <AlertTriangle className="h-5 w-5 text-brand-red mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-brand-red font-medium">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-3 bg-green-50 border-l-4 border-green-600 flex items-start rounded-r">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-700 font-medium">{success}</p>
            </div>
          )}

          {!isForgotMode ? (
            /* --- LOGIN FORM --- */
            <form className="space-y-6" onSubmit={handleLoginSubmit}>
              <div>
                <label className="block text-xs font-bold text-brand-dark uppercase tracking-wide">
                  Mobile Number
                </label>
                <div className="mt-2 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-4 w-4 text-brand-gray-mid" />
                  </div>
                  <input
                    type="tel"
                    required
                    value={loginData.mobileNumber}
                    onChange={(e) => setLoginData({ ...loginData, mobileNumber: e.target.value })}
                    className="w-full pl-10 border border-brand-gray-border rounded px-3 py-2 text-sm focus:outline-none focus:border-brand-red"
                    placeholder="e.g. 9824740023"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-bold text-brand-dark uppercase tracking-wide">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotMode(true);
                      setError(null);
                      setSuccess(null);
                      if (loginData.mobileNumber) {
                        setForgotData((prev) => ({ ...prev, mobileNumber: loginData.mobileNumber }));
                      }
                    }}
                    className="text-xs font-bold text-brand-red hover:underline focus:outline-none"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="mt-2 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-brand-gray-mid" />
                  </div>
                  <input
                    type="password"
                    required
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    className="w-full pl-10 border border-brand-gray-border rounded px-3 py-2 text-sm focus:outline-none focus:border-brand-red"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-3 border border-transparent rounded-md shadow-sm text-sm font-bold text-white uppercase tracking-wide transition-colors ${
                  loading ? 'bg-brand-gray cursor-not-allowed' : 'bg-brand-red hover:bg-brand-red-dark'
                }`}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>
          ) : (
            /* --- FORGOT / RESET PASSWORD FORM --- */
            <form className="space-y-5" onSubmit={handleForgotSubmit}>
              <div>
                <label className="block text-xs font-bold text-brand-dark uppercase tracking-wide">
                  Registered Mobile Number
                </label>
                <div className="mt-2 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-4 w-4 text-brand-gray-mid" />
                  </div>
                  <input
                    type="tel"
                    required
                    value={forgotData.mobileNumber}
                    onChange={(e) => setForgotData({ ...forgotData, mobileNumber: e.target.value })}
                    className="w-full pl-10 border border-brand-gray-border rounded px-3 py-2 text-sm focus:outline-none focus:border-brand-red"
                    placeholder="e.g. 9824740023"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-dark uppercase tracking-wide">
                  6-Digit Secret Code
                </label>
                <div className="mt-2 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <KeyRound className="h-4 w-4 text-brand-gray-mid" />
                  </div>
                  <input
                    type="password"
                    maxLength={6}
                    required
                    value={forgotData.secretCode}
                    onChange={(e) => setForgotData({ ...forgotData, secretCode: e.target.value })}
                    className="w-full pl-10 border border-brand-gray-border rounded px-3 py-2 text-sm focus:outline-none focus:border-brand-red tracking-widest"
                    placeholder="Enter 6-digit secret code"
                  />
                </div>
                <p className="text-[0.7rem] text-brand-gray-mid mt-1">Configured in server .env (ADMIN_RESET_CODE)</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-dark uppercase tracking-wide">
                  New Password
                </label>
                <div className="mt-2 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-brand-gray-mid" />
                  </div>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={forgotData.newPassword}
                    onChange={(e) => setForgotData({ ...forgotData, newPassword: e.target.value })}
                    className="w-full pl-10 border border-brand-gray-border rounded px-3 py-2 text-sm focus:outline-none focus:border-brand-red"
                    placeholder="Enter new password (min. 6 chars)"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-dark uppercase tracking-wide">
                  Confirm New Password
                </label>
                <div className="mt-2 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-brand-gray-mid" />
                  </div>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={forgotData.confirmPassword}
                    onChange={(e) => setForgotData({ ...forgotData, confirmPassword: e.target.value })}
                    className="w-full pl-10 border border-brand-gray-border rounded px-3 py-2 text-sm focus:outline-none focus:border-brand-red"
                    placeholder="Re-enter new password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-3 border border-transparent rounded-md shadow-sm text-sm font-bold text-white uppercase tracking-wide transition-colors ${
                  loading ? 'bg-brand-gray cursor-not-allowed' : 'bg-brand-red hover:bg-brand-red-dark'
                }`}
              >
                {loading ? 'Resetting Password...' : 'Reset Password'}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotMode(false);
                    setError(null);
                    setSuccess(null);
                  }}
                  className="inline-flex items-center text-xs font-bold text-brand-dark hover:text-brand-red transition-colors uppercase tracking-wider"
                >
                  <ArrowLeft className="h-3.5 w-3.5 mr-1.5" /> Back to Login
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}