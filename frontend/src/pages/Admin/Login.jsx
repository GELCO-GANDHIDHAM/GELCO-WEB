import { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { 
  Lock, 
  Phone, 
  KeyRound, 
  AlertTriangle, 
  CheckCircle, 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  ArrowRight,
  Home
} from 'lucide-react';
import api from '../../services/api';

export default function Login() {
  const navigate = useNavigate();
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-3 sm:p-6 lg:p-10 relative overflow-hidden selection:bg-brand-red selection:text-white">
      {/* Decorative ambient background glows */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-brand-red/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-neutral-900/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container Card */}
      <div className="w-full max-w-5xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-200/80 overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[580px] lg:min-h-[640px] relative z-10">
        
        {/* ============================================================ */}
        {/* LEFT COLUMN: Showcase Image (PC & iPad / Tablet Only) */}
        {/* Hidden on mobile view per user request */}
        {/* ============================================================ */}
        <div className="hidden md:flex md:col-span-6 lg:col-span-6 relative bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 overflow-hidden flex-col justify-between border-r border-gray-200/80">
          {/* High-detail product showcase poster image */}
          <img
            src="/images/admin-login-showcase.png"
            alt="GELCO Smart Control Solutions"
            className="absolute inset-0 w-full h-full object-cover object-center select-none"
          />

          {/* Elegant top and bottom gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/40 pointer-events-none" />

          {/* Top Floating Badge */}
          <div className="relative z-10 p-6 lg:p-8 flex items-center justify-between">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md shadow-md border border-white/60">
              <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse" />
              <span className="text-[11px] font-black uppercase tracking-wider text-brand-dark">Central Admin Portal</span>
            </div>

            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-white text-[11px] font-bold transition-all border border-white/20 hover:border-white/40 shadow-xs"
              title="Return to public website"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Visit Site</span>
            </Link>
          </div>

          {/* Bottom Floating Glass Card */}
          <div className="relative z-10 p-6 lg:p-8">
            <div className="backdrop-blur-md bg-black/55 rounded-2xl p-5 border border-white/15 shadow-xl text-white">
              <p className="text-xs sm:text-sm font-bold text-white/95 leading-relaxed">
                "Smart Solutions for a Brighter Tomorrow"
              </p>
              <p className="text-[11px] text-white/70 mt-1 leading-normal font-medium">
                High-precision electrical protection, DOL starters, and automatic phase changers.
              </p>
              <div className="mt-3 flex items-center justify-between text-[10px] uppercase tracking-wider text-white/80 font-bold border-t border-white/15 pt-2.5">
                <span className="text-white/90">GELCO PLUS ELECTRICALS</span>
                <span className="inline-flex items-center gap-1 text-emerald-400 font-black">
                  <ShieldCheck className="w-3.5 h-3.5" /> 256-Bit SSL
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* RIGHT COLUMN: Admin Login & Password Reset Form */}
        {/* Full width on Mobile, right half on PC & iPad */}
        {/* ============================================================ */}
        <div className="col-span-1 md:col-span-6 lg:col-span-6 flex flex-col justify-between p-6 sm:p-10 lg:p-12 bg-white">
          
          {/* Top Brand Header */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <Link to="/" className="flex items-center gap-2 group">
                <img 
                  src="/flower.png" 
                  alt="GELCO Logo" 
                  className="h-8 w-8 sm:h-9 sm:w-9 object-contain group-hover:scale-105 transition-transform" 
                />
                <div className="flex flex-col">
                  <img 
                    src="/gelco_text.png" 
                    alt="GELCO" 
                    className="h-4 sm:h-5 object-contain self-start" 
                  />
                  <span className="text-[9px] font-black uppercase tracking-widest text-brand-dark leading-none mt-0.5">
                    Plus Electricals
                  </span>
                </div>
              </Link>

              {/* Mobile "Visit Site" link */}
              <Link
                to="/"
                className="md:hidden inline-flex items-center gap-1 text-xs font-bold text-brand-gray hover:text-brand-red transition-colors"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Visit Site</span>
              </Link>
            </div>

            {/* Title & Subtitle */}
            <div className="mb-6 sm:mb-8">
              <span className="text-[10px] font-black uppercase tracking-widest text-brand-red bg-brand-red/10 px-2.5 py-1 rounded-full inline-block mb-2">
                {isForgotMode ? 'Account Recovery' : 'Administrative Access'}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-brand-dark uppercase tracking-tight">
                {isForgotMode ? 'Reset Password' : 'Sign in to Portal'}
              </h1>
              <p className="text-xs sm:text-sm text-brand-gray font-medium mt-1">
                {isForgotMode 
                  ? 'Verify your identity to configure a new administrator password.' 
                  : 'Please enter your registered mobile number and password to continue.'}
              </p>
            </div>

            {/* Alerts */}
            {error && (
              <div className="mb-5 p-3.5 bg-red-50/90 border border-red-200/80 rounded-xl flex items-start gap-2.5 shadow-xs animate-in fade-in duration-200">
                <AlertTriangle className="h-4 w-4 text-brand-red flex-shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-brand-red font-semibold leading-snug">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200/80 rounded-xl flex items-start gap-2.5 shadow-xs animate-in fade-in duration-200">
                <CheckCircle className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-emerald-800 font-semibold leading-snug">{success}</p>
              </div>
            )}

            {/* ================= LOGIN FORM ================= */}
            {!isForgotMode ? (
              <form className="space-y-4 sm:space-y-5" onSubmit={handleLoginSubmit}>
                {/* Mobile Number Field */}
                <div>
                  <label className="block text-xs font-black text-brand-dark uppercase tracking-wide mb-1.5">
                    Mobile Number
                  </label>
                  <div className="relative rounded-xl shadow-xs">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Phone className="h-4 w-4 text-brand-gray" />
                    </div>
                    <input
                      type="tel"
                      required
                      value={loginData.mobileNumber}
                      onChange={(e) => setLoginData({ ...loginData, mobileNumber: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-brand-dark placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all"
                      placeholder="e.g. 9824740023"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-black text-brand-dark uppercase tracking-wide">
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
                      className="text-xs font-bold text-brand-red hover:text-brand-red-dark hover:underline focus:outline-none transition-colors"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative rounded-xl shadow-xs">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-brand-gray" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      className="w-full pl-10 pr-11 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-brand-dark placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-brand-dark transition-colors"
                      tabIndex="-1"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex items-center justify-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-md text-xs sm:text-sm font-black text-white uppercase tracking-wider transition-all duration-200 ${
                    loading 
                      ? 'bg-brand-gray cursor-not-allowed' 
                      : 'bg-brand-red hover:bg-brand-red-dark hover:shadow-lg hover:shadow-brand-red/25 active:scale-[0.99]'
                  }`}
                >
                  <span>{loading ? 'Authenticating...' : 'Sign In to Portal'}</span>
                  {!loading && <ArrowRight className="h-4 w-4" />}
                </button>
              </form>
            ) : (
              /* ================= FORGOT / RESET FORM ================= */
              <form className="space-y-4" onSubmit={handleForgotSubmit}>
                {/* Registered Mobile */}
                <div>
                  <label className="block text-xs font-black text-brand-dark uppercase tracking-wide mb-1.5">
                    Registered Mobile Number
                  </label>
                  <div className="relative rounded-xl shadow-xs">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Phone className="h-4 w-4 text-brand-gray" />
                    </div>
                    <input
                      type="tel"
                      required
                      value={forgotData.mobileNumber}
                      onChange={(e) => setForgotData({ ...forgotData, mobileNumber: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-brand-dark placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all"
                      placeholder="e.g. 9824740023"
                    />
                  </div>
                </div>

                {/* Secret Code */}
                <div>
                  <label className="block text-xs font-black text-brand-dark uppercase tracking-wide mb-1.5">
                    6-Digit Master Secret Code
                  </label>
                  <div className="relative rounded-xl shadow-xs">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <KeyRound className="h-4 w-4 text-brand-gray" />
                    </div>
                    <input
                      type="password"
                      maxLength={6}
                      required
                      value={forgotData.secretCode}
                      onChange={(e) => setForgotData({ ...forgotData, secretCode: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-brand-dark placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red tracking-widest transition-all"
                      placeholder="Enter 6-digit code"
                    />
                  </div>
                  <p className="text-[10px] text-brand-gray mt-1 font-medium">Configured in server .env (ADMIN_RESET_CODE)</p>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-xs font-black text-brand-dark uppercase tracking-wide mb-1.5">
                    New Password
                  </label>
                  <div className="relative rounded-xl shadow-xs">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-brand-gray" />
                    </div>
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={forgotData.newPassword}
                      onChange={(e) => setForgotData({ ...forgotData, newPassword: e.target.value })}
                      className="w-full pl-10 pr-11 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-brand-dark placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all"
                      placeholder="Minimum 6 characters"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-brand-dark transition-colors"
                      tabIndex="-1"
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-black text-brand-dark uppercase tracking-wide mb-1.5">
                    Confirm New Password
                  </label>
                  <div className="relative rounded-xl shadow-xs">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-brand-gray" />
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={forgotData.confirmPassword}
                      onChange={(e) => setForgotData({ ...forgotData, confirmPassword: e.target.value })}
                      className="w-full pl-10 pr-11 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-brand-dark placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all"
                      placeholder="Re-enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-brand-dark transition-colors"
                      tabIndex="-1"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit Reset Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-md text-xs sm:text-sm font-black text-white uppercase tracking-wider transition-all duration-200 ${
                    loading 
                      ? 'bg-brand-gray cursor-not-allowed' 
                      : 'bg-brand-red hover:bg-brand-red-dark hover:shadow-lg hover:shadow-brand-red/25 active:scale-[0.99]'
                  }`}
                >
                  <span>{loading ? 'Resetting Password...' : 'Reset & Save Password'}</span>
                  {!loading && <ArrowRight className="h-4 w-4" />}
                </button>

                {/* Back to Login Button */}
                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotMode(false);
                      setError(null);
                      setSuccess(null);
                    }}
                    className="inline-flex items-center text-xs font-black text-brand-dark hover:text-brand-red transition-colors uppercase tracking-wider"
                  >
                    <ArrowLeft className="h-3.5 w-3.5 mr-1.5" /> Back to Sign In
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Footer Security Notice */}
          <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between text-[11px] text-brand-gray">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span className="font-medium">Authorized Personnel Only</span>
            </div>
            <span className="font-bold text-gray-400">v1.2.0</span>
          </div>

        </div>

      </div>
    </div>
  );
}