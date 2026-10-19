import { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import WhatsAppIcon from '../../components/common/WhatsAppIcon';
import toast from 'react-hot-toast';
import { Phone, Mail, MessageSquare, CheckCircle, Clock, AlertCircle, X, Send } from 'lucide-react';

export default function Queries() {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [replyingQuery, setReplyingQuery] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);

  const fetchQueries = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/queries');
      setQueries(res.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load customer queries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchQueries(); 
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/admin/queries/${id}`, { status: newStatus });
      toast.success(`Query status updated to ${newStatus}`);
      fetchQueries();
    } catch (err) {
      console.error(err);
      toast.error('Error updating status');
    }
  };

  const handleOpenReplyModal = (query) => {
    setReplyingQuery(query);
    setResponseText(query.adminResponse || '');
  };

  const handleSaveReply = async (e) => {
    e.preventDefault();
    if (!replyingQuery) return;
    setSubmittingReply(true);

    try {
      await api.put(`/admin/queries/${replyingQuery._id}`, {
        adminResponse: responseText.trim(),
        status: 'resolved'
      });
      toast.success('Reply saved and marked as resolved!');
      setReplyingQuery(null);
      fetchQueries();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to save reply');
    } finally {
      setSubmittingReply(false);
    }
  };

  const getCleanMobile = (mobile) => {
    if (!mobile) return '';
    const clean = mobile.replace(/[^0-9]/g, '');
    return clean.length === 10 ? `91${clean}` : clean;
  };

  const filteredQueries = queries.filter(q => {
    if (filterStatus === 'all') return true;
    return q.status === filterStatus;
  });

  if (loading) return <LoadingSpinner text="Loading customer queries..." />;

  return (
    <div className="space-y-6">
      {/* Header & Filter Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-brand-dark uppercase tracking-tight">
            Customer Queries ({queries.length})
          </h1>
          <p className="text-xs sm:text-sm text-brand-gray-mid mt-0.5">
            Review inquiries submitted by website visitors and reply directly via WhatsApp, Phone, or Email.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {['all', 'new', 'in-progress', 'resolved'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                filterStatus === st
                  ? 'bg-brand-red text-white shadow-xs'
                  : 'bg-white border border-gray-200 text-brand-gray hover:bg-gray-50'
              }`}
            >
              {st === 'all' ? 'All' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Main Queries Container */}
      <div className="bg-white rounded-2xl shadow-xs border border-gray-200 overflow-hidden">
        {filteredQueries.length === 0 ? (
          <div className="p-12 text-center text-brand-gray-mid">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30 text-brand-gray-mid" />
            <h4 className="font-extrabold text-brand-dark text-base uppercase">No queries found</h4>
            <p className="text-xs text-brand-gray-mid mt-1">Queries submitted via the "Query" button will appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredQueries.map((q) => {
              const cleanMobile = getCleanMobile(q.mobile);
              const waUrl = `https://wa.me/${cleanMobile}?text=${encodeURIComponent(
                `Hello ${q.name}, this is regarding your query to GELCO PLUS ELECTRICALS: "${q.question.slice(0, 80)}..."`
              )}`;

              return (
                <div key={q._id} className="p-4 sm:p-6 hover:bg-gray-50/60 transition-colors flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  {/* Left: Customer Info & Query */}
                  <div className="space-y-2.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-black text-brand-dark text-sm sm:text-base">
                        {q.name}
                      </span>
                      <span className="text-[11px] font-mono text-brand-gray-mid">
                        • {new Date(q.createdAt).toLocaleDateString()} {new Date(q.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        q.status === 'new'
                          ? 'bg-red-50 text-brand-red border border-red-200'
                          : q.status === 'in-progress'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {q.status === 'new' && <AlertCircle className="w-3 h-3" />}
                        {q.status === 'in-progress' && <Clock className="w-3 h-3" />}
                        {q.status === 'resolved' && <CheckCircle className="w-3 h-3" />}
                        <span>{q.status}</span>
                      </span>
                    </div>

                    {/* Query Message Box */}
                    <div className="bg-gray-50 border border-gray-200/80 rounded-xl p-3 text-xs sm:text-sm text-brand-dark leading-relaxed">
                      <span className="font-bold text-brand-gray-mid uppercase text-[10px] block mb-1">Customer Query:</span>
                      <p className="whitespace-pre-wrap">{q.question}</p>
                    </div>

                    {/* Admin Response if recorded */}
                    {q.adminResponse && (
                      <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3 text-xs sm:text-sm text-emerald-900 leading-relaxed">
                        <span className="font-bold text-emerald-700 uppercase text-[10px] block mb-1">Admin Response / Note:</span>
                        <p className="whitespace-pre-wrap">{q.adminResponse}</p>
                        {q.respondedAt && (
                          <span className="text-[10px] text-emerald-600 block mt-1 font-mono">
                            Responded on: {new Date(q.respondedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Customer Contact Badges */}
                    <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-100 text-brand-dark font-mono font-bold">
                        📱 {q.mobile}
                      </span>
                      {q.email && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-100 text-brand-dark font-sans font-medium">
                          ✉️ {q.email}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: Actions (Direct WhatsApp, Call, Reply, Status) */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-stretch lg:items-end gap-2 flex-shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-gray-100">
                    {/* Status Select */}
                    <div className="flex items-center gap-2 w-full lg:w-auto">
                      <span className="text-[11px] font-bold text-brand-gray-mid uppercase">Status:</span>
                      <select 
                        value={q.status}
                        onChange={(e) => handleStatusChange(q._id, e.target.value)}
                        className={`flex-1 lg:flex-none text-xs font-black uppercase rounded-xl px-3 py-1.5 border focus:outline-none transition-colors ${
                          q.status === 'new' ? 'bg-red-50 text-red-700 border-red-200' : 
                          q.status === 'in-progress' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                          'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}
                      >
                        <option value="new">New</option>
                        <option value="in-progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </div>

                    {/* Reply Actions Toolbar */}
                    <div className="flex items-center gap-2 w-full lg:w-auto">
                      {/* WhatsApp One-Click Direct Reply */}
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 lg:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#25D366] hover:bg-[#20BA5A] text-white text-xs font-black uppercase tracking-wider shadow-xs hover:shadow-md transition-all active:scale-95"
                        title="Reply on WhatsApp"
                      >
                        <WhatsAppIcon className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>

                      {/* Phone Call */}
                      <a
                        href={`tel:${q.mobile}`}
                        className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-xl bg-gray-100 hover:bg-brand-dark hover:text-white text-brand-dark text-xs font-bold transition-all active:scale-95"
                        title={`Call ${q.mobile}`}
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Call</span>
                      </a>

                      {/* Record Response Modal Button */}
                      <button
                        type="button"
                        onClick={() => handleOpenReplyModal(q)}
                        className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-xl border border-gray-300 hover:border-brand-red hover:text-brand-red text-brand-dark text-xs font-black uppercase tracking-wider transition-all active:scale-95 bg-white"
                        title="Record admin response note"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Reply Note</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Reply Modal */}
      {replyingQuery && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-gray-200 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div>
                <h3 className="text-base font-black text-brand-dark uppercase">Record Reply / Note</h3>
                <p className="text-xs text-brand-gray-mid">Replying to {replyingQuery.name} ({replyingQuery.mobile})</p>
              </div>
              <button
                type="button"
                onClick={() => setReplyingQuery(null)}
                className="p-1 rounded-full hover:bg-gray-100 text-brand-gray-mid hover:text-brand-dark"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveReply} className="space-y-4">
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 text-xs">
                <span className="font-bold text-brand-gray-mid uppercase block mb-1">Original Question:</span>
                <p className="text-brand-dark">{replyingQuery.question}</p>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-brand-dark mb-1.5">
                  Your Response / Resolution Details:
                </label>
                <textarea
                  rows={4}
                  required
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Type the resolution notes, quotation details, or response given to the customer..."
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-gray-300 focus:outline-none focus:border-brand-red bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReplyingQuery(null)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-brand-dark hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReply}
                  className="px-5 py-2 rounded-xl bg-brand-red hover:bg-brand-red-dark text-white text-xs font-black uppercase tracking-wider transition-all shadow-xs disabled:opacity-50"
                >
                  {submittingReply ? 'Saving...' : 'Save & Mark Resolved'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
