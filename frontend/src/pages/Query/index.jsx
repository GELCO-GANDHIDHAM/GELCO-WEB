import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Send, CheckCircle, AlertTriangle, ArrowLeft, MessageSquare } from 'lucide-react';

export default function Query() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    question: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await api.post('/queries', formData);
      setSuccess(true);
      setFormData({ name: '', mobile: '', email: '', question: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit query. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] pb-16">
        {/* Sleek Top Navigation */}
        <div className="max-w-xl mx-auto px-4 pt-3 sm:pt-6 pb-3">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-gray-200 text-brand-dark hover:text-white hover:bg-brand-red hover:border-brand-red shadow-2xs hover:shadow-md transition-all duration-200 text-xs font-black uppercase tracking-wider group cursor-pointer active:scale-95"
          >
            <div className="w-5 h-5 rounded-full bg-gray-100 group-hover:bg-white/20 flex items-center justify-center transition-colors">
              <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
            </div>
            <span>Back</span>
          </button>
        </div>

        <div className="px-4">
          <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-card p-6 sm:p-10 text-center border border-gray-200/90 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-emerald-500" />
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 sm:h-10 sm:w-10" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-brand-dark uppercase tracking-tight mb-2">Query Submitted!</h2>
            <p className="text-xs sm:text-sm text-brand-gray mb-6 font-medium max-w-md mx-auto">
              Thank you for reaching out to us. Paresh Patel and the technical team will review your query and contact you shortly.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
              <button 
                type="button"
                onClick={() => setSuccess(false)}
                className="w-full sm:w-auto px-5 py-2.5 bg-brand-red text-white font-black rounded-xl uppercase tracking-wider hover:bg-brand-red-dark transition-all text-xs shadow-xs"
              >
                Submit Another Query
              </button>
              <button 
                type="button"
                onClick={handleBack}
                className="w-full sm:w-auto px-5 py-2.5 border border-gray-300 text-brand-dark font-black rounded-xl uppercase tracking-wider hover:bg-gray-50 transition-all text-xs"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-16">
      {/* Sleek Top Navigation Bar */}
      <div className="max-w-3xl mx-auto px-3 sm:px-6 lg:px-8 pt-3 sm:pt-6 pb-2.5 flex items-center justify-between">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-gray-200/90 text-brand-dark hover:text-white hover:bg-brand-red hover:border-brand-red shadow-2xs hover:shadow-md transition-all duration-200 text-xs font-black uppercase tracking-wider group cursor-pointer active:scale-95"
        >
          <div className="w-5 h-5 rounded-full bg-gray-100 group-hover:bg-white/20 flex items-center justify-center transition-colors">
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
          </div>
          <span>Back</span>
        </button>

        <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-brand-gray-mid">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse" />
          <span>Official Inquiry Desk</span>
        </div>
      </div>

      {/* Main Query Card (Positioned Directly Below with Zero Redundant Void) */}
      <div className="max-w-3xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-card overflow-hidden border border-gray-200/90">
          
          {/* Card Header */}
          <div className="relative bg-gradient-to-br from-[#1E1E1E] via-[#141414] to-[#0D0D0D] p-5 sm:p-8 text-white text-center overflow-hidden">
            {/* Top Red Gradient Stripe */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-brand-red to-transparent" />
            
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-brand-red-light text-[10px] font-mono font-bold uppercase tracking-widest mb-1.5 backdrop-blur-xs">
              <MessageSquare className="w-3 h-3" />
              <span>Direct To Engineering</span>
            </div>

            <h1 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight text-white mb-1">
              Submit a Query
            </h1>
            <p className="text-[11px] sm:text-xs text-gray-300 font-medium max-w-md mx-auto">
              Have a technical question or need bulk pricing? Connect directly with our team.
            </p>
          </div>
          
          {/* Form Body */}
          <div className="p-4 sm:p-8">
            {error && (
              <div className="mb-5 p-3.5 bg-red-50 border-l-4 border-brand-red flex items-start rounded-r-lg">
                <AlertTriangle className="h-4 w-4 text-brand-red mr-2.5 flex-shrink-0 mt-0.5" />
                <p className="text-brand-red font-medium text-xs sm:text-sm">{error}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-5">
                <div>
                  <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-1">
                    Full Name <span className="text-brand-red">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/10 transition-all bg-gray-50/50 text-xs sm:text-sm"
                    placeholder="e.g. Paresh Patel"
                  />
                </div>
                <div>
                  <label htmlFor="mobile" className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-1">
                    Mobile Number <span className="text-brand-red">*</span>
                  </label>
                  <input
                    type="tel"
                    id="mobile"
                    name="mobile"
                    required
                    pattern="[6-9][0-9]{9}"
                    title="Please enter a valid 10-digit Indian mobile number"
                    value={formData.mobile}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/10 transition-all bg-gray-50/50 text-xs sm:text-sm"
                    placeholder="e.g. 9824740023"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-1">
                  Email Address <span className="text-brand-gray-mid text-[10px] normal-case font-normal ml-1">(Optional)</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/10 transition-all bg-gray-50/50 text-xs sm:text-sm"
                  placeholder="e.g. pareshpatel@gmail.com"
                />
              </div>
              
              <div>
                <label htmlFor="question" className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-1">
                  Your Query <span className="text-brand-red">*</span>
                </label>
                <textarea
                  id="question"
                  name="question"
                  required
                  rows="4"
                  value={formData.question}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/10 transition-all bg-gray-50/50 resize-y text-xs sm:text-sm"
                  placeholder="Please describe your requirements, model inquiries, or technical questions..."
                ></textarea>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center items-center gap-2 px-6 py-3 rounded-xl shadow-xs text-xs sm:text-sm font-black text-white uppercase tracking-wider transition-all cursor-pointer ${
                  loading ? 'bg-brand-gray cursor-not-allowed' : 'bg-brand-red hover:bg-brand-red-dark active:scale-[0.99] shadow-[0_4px_14px_rgba(227,30,36,0.25)]'
                }`}
              >
                {loading ? 'Submitting...' : (
                  <>
                    <span>Submit Query</span>
                    <Send className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}