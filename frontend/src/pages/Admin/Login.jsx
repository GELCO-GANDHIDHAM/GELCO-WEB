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
    <div className="min-h-screen w-full flex flex-col md:flex-row relative overflow-x-hidden bg-white selection:bg-brand-red selection:text-white">
      
      {/* ============================================================ */}
      {/* LEFT SECTION: Full-Screen Showcase Image (PC & iPad Only)   */}
      {/* Hidden on mobile view per user requirement                  */}
      {/* ============================================================ */}
      <div className="hidden md:flex md:w-1/2 lg:w-[53%] xl:w-[56%] min-h-screen relative bg-neutral-950 flex-col justify-between overflow-hidden select-none">
        {/* Full-bleed background showcase image */}
        <img
          src="/images/admin-login-showcase.png"
          alt="GELCO Smart Control Solutions"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Ambient lighting overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/45 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/50 pointer-events-none" />

        {/* Top Floating Badge */}
        <div className="relative z-10 p-6 lg:p-10 flex items-center justify-between">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/95 backdrop-blur-md shadow-xl border border-white/60">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-red animate-pulse" />
            <span className="text-xs font-black uppercase tracking-wider text-brand-dark">GELCO Central Portal</span>
          </div>

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white text-xs font-bold transition-all border border-white/20 hover:border-white/50 shadow-sm hover:scale-105"
            title="Return to public storefront"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Storefront</span>
          </Link>
        </div>

        {/* Bottom Floating Glass Card */}
        <div className="relative z-10 p-6 lg:p-10 max-w-lg">
          <div className="backdrop-blur-md bg-black/60 rounded-3xl p-6 border border-white/15 shadow-2xl text-white">
            <div className="flex items-center gap-2 mb-2 text-brand-red">
              <span className="h-1.5 w-6 bg-brand-red rounded-full" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white/80">Innovation & Reliability</span>
            </div>
            <p className="text-sm lg:text-base font-extrabold text-white leading-snug">
              "Smart Solutions for a Brighter Tomorrow"
            </p>
            <p className="text-xs text-white/75 mt-1.5 leading-relaxed font-medium">
              Agricultural motor protection, DOL starters, automatic phase changers & industrial switchgear.
            </p>
            <div className="mt-4 flex items-center justify-between text-[11px] uppercase tracking-wider text-white/85 font-bold border-t border-white/15 pt-3">
              <span>GELCO PLUS ELECTRICALS</span>
              <span className="inline-flex items-center gap-1 text-emerald-400 font-black">
                <ShieldCheck className="w-4 h-4" /> 256-Bit SSL
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* RIGHT SECTION: Full-Screen Login & Reset Form               */}
      {/* Full width on Mobile, right side on PC & iPad with Curve    */}
      {/* ============================================================ */}
      <div className="w-full md:w-1/2 lg:w-[47%] xl:w-[44%] min-h-screen flex flex-col justify-between p-6 sm:p-10 lg:p-14 xl:p-16 bg-white relative z-20 overflow-y-auto">
        
        {/* ============================================================ */}
        {/* ELEGANT CURVED DESIGN DIVIDER (PC & iPad Only)               */}
        {/* Seamlessly bows the white login panel into the image with    */}
        {/* a graceful curve and high-visibility GELCO Red accent contour*/}
        {/* ============================================================ */}
        <div className="hidden md:block absolute top-0 -left-12 lg:-left-20 xl:-left-24 bottom-0 w-14 lg:w-22 xl:w-26 h-full z-30 pointer-events-none">
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="h-full w-full drop-shadow-[-12px_0_20px_rgba(0,0,0,0.22)]"
          >
            {/* White curved fill extending the right panel */}
            <path d="M100,0 C15,30 15,70 100,100 L102,100 L102,0 Z" fill="#FFFFFF" />
            
            {/* GELCO Red accent contour curve */}
            <path
              d="M100,0 C15,30 15,70 100,100"
              fill="none"
              stroke="#E31E24"
              strokeWidth="3.5"
              strokeLinecap="round"
              className="opacity-95"
            />
          </svg>
        </div>

        {/* Top Header: Brand Logo & Storefront Return */}
        <div className="w-full max-w-md mx-auto flex items-center justify-between pt-2">
          <Link to="/" className="flex items-center gap-2.5 group">
            <img 
              src="/flower.png" 
              alt="GELCO Logo" 
              className="h-9 w-9 sm:h-10 sm:w-10 object-contain group-hover:scale-105 transition-transform" 
            />
            <div className="flex flex-col">
              <img 
                src="/gelco_text.png" 
                alt="GELCO" 
                className="h-4.5 sm:h-5.5 object-contain self-start" 
              />
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-brand-dark leading-none mt-0.5">
                Plus Electricals
              </span>
            </div>
          </Link>

          {/* Quick link to Storefront */}
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-gray hover:text-brand-red transition-colors px-3 py-1.5 rounded-full hover:bg-gray-100"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Storefront</span>
          </Link>
        </div>

        {/* Center Content: Login / Forgot Password Form */}
        <div className="w-full max-w-md mx-auto my-auto py-8 sm:py-10">
          
          {/* Header titles */}
          <div className="mb-6 sm:mb-8">
            <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-brand-red bg-brand-red/10 px-3 py-1 rounded-full inline-block mb-2.5">
              {isForgotMode ? 'Account Recovery' : 'Administrative Access'}
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-brand-dark uppercase tracking-tight">
              {isForgotMode ? 'Reset Password' : 'Sign in to Portal'}
            </h1>
            <p className="text-xs sm:text-sm text-brand-gray font-medium mt-1.5">
              {isForgotMode 
                ? 'Verify your credentials to configure a new administrator password.' 
                : 'Enter your registered mobile number and password to access the panel.'}
            </p>
          </div>

          {/* Alerts */}
          {error && (
            <div className="mb-6 p-4 bg-red-50/90 border border-red-200/80 rounded-2xl flex items-start gap-3 shadow-xs">
              <AlertTriangle className="h-5 w-5 text-brand-red flex-shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-brand-red font-semibold leading-snug">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200/80 rounded-2xl flex items-start gap-3 shadow-xs">
              <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-emerald-800 font-semibold leading-snug">{success}</p>
            </div>
          )}

          {/* ================= LOGIN FORM ================= */}
          {!isForgotMode ? (
            <form className="space-y-5" onSubmit={handleLoginSubmit}>
              {/* Mobile Number Field */}
              <div>
                <label className="block text-xs font-black text-brand-dark uppercase tracking-wide mb-2">
                  Mobile Number
                </label>
                <div className="relative rounded-2xl shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Phone className="h-4 w-4 text-brand-gray" />
                  </div>
                  <input
                    type="tel"
                    required
                    value={loginData.mobileNumber}
                    onChange={(e) => setLoginData({ ...loginData, mobileNumber: e.target.value })}
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium text-brand-dark placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all"
                    placeholder="e.g. 9824740023"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex justify-between items-center mb-2">
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
                <div className="relative rounded-2xl shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-brand-gray" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    className="w-full pl-11 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium text-brand-dark placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-brand-dark transition-colors"
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
                className={`w-full flex items-center justify-center gap-2 py-4 px-5 border border-transparent rounded-2xl shadow-md text-xs sm:text-sm font-black text-white uppercase tracking-wider transition-all duration-200 ${
                  loading 
                    ? 'bg-brand-gray cursor-not-allowed' 
                    : 'bg-brand-red hover:bg-brand-red-dark hover:shadow-xl hover:shadow-brand-red/30 active:scale-[0.99]'
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
                <div className="relative rounded-2xl shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Phone className="h-4 w-4 text-brand-gray" />
                  </div>
                  <input
                    type="tel"
                    required
                    value={forgotData.mobileNumber}
                    onChange={(e) => setForgotData({ ...forgotData, mobileNumber: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium text-brand-dark placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all"
                    placeholder="e.g. 9824740023"
                  />
                </div>
              </div>

              {/* Secret Code */}
              <div>
                <label className="block text-xs font-black text-brand-dark uppercase tracking-wide mb-1.5">
                  6-Digit Master Secret Code
                </label>
                <div className="relative rounded-2xl shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <KeyRound className="h-4 w-4 text-brand-gray" />
                  </div>
                  <input
                    type="password"
                    maxLength={6}
                    required
                    value={forgotData.secretCode}
                    onChange={(e) => setForgotData({ ...forgotData, secretCode: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium text-brand-dark placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red tracking-widest transition-all"
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
                <div className="relative rounded-2xl shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-brand-gray" />
                  </div>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={forgotData.newPassword}
                    onChange={(e) => setForgotData({ ...forgotData, newPassword: e.target.value })}
                    className="w-full pl-11 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium text-brand-dark placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all"
                    placeholder="Minimum 6 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-brand-dark transition-colors"
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
                <div className="relative rounded-2xl shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-brand-gray" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={forgotData.confirmPassword}
                    onChange={(e) => setForgotData({ ...forgotData, confirmPassword: e.target.value })}
                    className="w-full pl-11 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium text-brand-dark placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all"
                    placeholder="Re-enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-brand-dark transition-colors"
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
                className={`w-full flex items-center justify-center gap-2 py-3.5 px-5 border border-transparent rounded-2xl shadow-md text-xs sm:text-sm font-black text-white uppercase tracking-wider transition-all duration-200 ${
                  loading 
                    ? 'bg-brand-gray cursor-not-allowed' 
                    : 'bg-brand-red hover:bg-brand-red-dark hover:shadow-xl hover:shadow-brand-red/30 active:scale-[0.99]'
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

        {/* Bottom Security Notice */}
        <div className="w-full max-w-md mx-auto pt-6 border-t border-gray-100 flex items-center justify-between text-[11px] text-brand-gray">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span className="font-semibold text-gray-700">Authorized Personnel Only</span>
          </div>
          <span className="font-black text-gray-400">GELCO PLUS v1.2</span>
        </div>

      </div>

    </div>
  );
}