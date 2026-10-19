import { useState, useEffect } from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Plus, 
  Trash2, 
  Save, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  PhoneCall,
  MessageCircle,
  Eye
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function FooterSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    locationUrl: '',
    email: '',
    tagline: '',
    contactPerson: '',
    phones: [
      { number: '', label: 'Primary / WhatsApp', isWhatsApp: true }
    ],
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/settings');
      if (res.data?.data) {
        const d = res.data.data;
        setFormData({
          address: d.address || '',
          city: d.city || '',
          locationUrl: d.locationUrl || '',
          email: d.email || '',
          tagline: d.tagline || '',
          contactPerson: d.contactPerson || '',
          phones: d.phones && d.phones.length > 0 
            ? d.phones 
            : [{ number: '', label: 'Mobile', isWhatsApp: true }],
        });
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
      toast.error('Failed to load footer settings');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneChange = (index, field, value) => {
    const updated = [...formData.phones];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, phones: updated });
  };

  const handleAddPhone = () => {
    setFormData({
      ...formData,
      phones: [
        ...formData.phones,
        { number: '', label: 'Mobile', isWhatsApp: false }
      ],
    });
  };

  const handleRemovePhone = (index) => {
    if (formData.phones.length === 1) {
      toast.error('At least one mobile number is required.');
      return;
    }
    const updated = formData.phones.filter((_, i) => i !== index);
    setFormData({ ...formData, phones: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put('/settings', formData);
      toast.success(res.data?.message || 'Footer & contact settings saved successfully!');
    } catch (err) {
      console.error('Save settings error:', err);
      toast.error(err.response?.data?.message || 'Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <LoadingSpinner text="Loading footer and contact settings..." />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
      {/* Page Header */}
      <div className="bg-white p-5 sm:p-7 rounded-2xl border border-brand-gray-border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-red/10 text-brand-red text-xs font-black uppercase tracking-wider mb-1.5">
            <Building2 className="w-3.5 h-3.5" />
            <span>Footer & Contact Module</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-brand-dark uppercase tracking-tight">
            Footer Details & Contact Editor
          </h1>
          <p className="text-xs sm:text-sm text-brand-gray-mid mt-1">
            Update store address, Google Maps link, contact email, and multiple mobile numbers shown on the website footer.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-red hover:bg-brand-red-dark text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-sm hover:shadow-md hover:shadow-brand-red/25 transition-all duration-200 active:scale-95 disabled:opacity-50 cursor-pointer flex-shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving Changes...' : 'Save All Changes'}</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form Column (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 1: Address & Maps Location */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-brand-gray-border shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <div className="p-2 rounded-lg bg-red-50 text-brand-red">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-brand-dark text-sm sm:text-base">Address & Google Maps Location</h3>
                <p className="text-xs text-brand-gray-mid">Displayed in the Location card of the website footer.</p>
              </div>
            </div>

            <div className="space-y-3 pt-1">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-brand-dark mb-1">
                  Full Street Address <span className="text-brand-red">*</span>
                </label>
                <textarea
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="e.g. D7, Nilesh Park, Plot No. 80, Near Ganesh Juice Corner, Sector-8"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-brand-dark mb-1">
                  City & State <span className="text-brand-red">*</span>
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="e.g. Gandhidham, Gujarat"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-black uppercase tracking-wider text-brand-dark">
                    Google Maps URL / Location Link
                  </label>
                  {formData.locationUrl && (
                    <a
                      href={formData.locationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-red hover:underline"
                    >
                      <span>Test Location</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <input
                  type="url"
                  value={formData.locationUrl}
                  onChange={(e) => setFormData({ ...formData, locationUrl: e.target.value })}
                  placeholder="https://maps.google.com/?q=..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm font-mono focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all"
                />
                <p className="text-[11px] text-brand-gray-mid mt-1">
                  When visitors click the Location card in the footer, they will be navigated to this map pin.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Official Email & Contact Person */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-brand-gray-border shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-brand-dark text-sm sm:text-base">Email & Brand Tagline</h3>
                <p className="text-xs text-brand-gray-mid">General contact email and company slogan.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="sm:col-span-2">
                <label className="block text-xs font-black uppercase tracking-wider text-brand-dark mb-1">
                  Official Email Address <span className="text-brand-red">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="gelcopluselectricals@gmail.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-brand-dark mb-1">
                  Primary Contact Person
                </label>
                <input
                  type="text"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  placeholder="Paresh Bhai Patel"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-brand-dark mb-1">
                  Company Tagline
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="Reliable Electrical Solutions..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Multiple Mobile Numbers */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-brand-gray-border shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-green-50 text-green-600">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-brand-dark text-sm sm:text-base">Multiple Mobile Numbers</h3>
                  <p className="text-xs text-brand-gray-mid">Add direct call and WhatsApp contact numbers.</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddPhone}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-brand-red hover:text-white text-xs font-bold transition-all cursor-pointer shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Number</span>
              </button>
            </div>

            <div className="space-y-3 pt-1">
              {formData.phones.map((phone, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-gray-200/90 bg-gray-50/50 flex flex-col sm:flex-row items-start sm:items-center gap-3 transition-all hover:bg-white hover:border-brand-red/30"
                >
                  <div className="flex items-center justify-center w-7 h-7 rounded-full bg-white border border-gray-200 text-xs font-bold text-brand-dark flex-shrink-0">
                    {idx + 1}
                  </div>

                  <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-12 gap-2">
                    <div className="sm:col-span-6">
                      <label className="block text-[10px] font-black uppercase tracking-wider text-brand-gray-mid mb-0.5">
                        Mobile Number
                      </label>
                      <input
                        type="tel"
                        value={phone.number}
                        onChange={(e) => handlePhoneChange(idx, 'number', e.target.value)}
                        placeholder="e.g. 9824740023"
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs font-mono font-bold focus:outline-none focus:border-brand-red bg-white"
                        required
                      />
                    </div>

                    <div className="sm:col-span-6">
                      <label className="block text-[10px] font-black uppercase tracking-wider text-brand-gray-mid mb-0.5">
                        Label / Department
                      </label>
                      <input
                        type="text"
                        value={phone.label}
                        onChange={(e) => handlePhoneChange(idx, 'label', e.target.value)}
                        placeholder="e.g. Paresh Patel / Sales"
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs focus:outline-none focus:border-brand-red bg-white"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0 self-end sm:self-center pt-1 sm:pt-0">
                    <label className="inline-flex items-center gap-1.5 text-xs text-brand-gray cursor-pointer">
                      <input
                        type="checkbox"
                        checked={phone.isWhatsApp}
                        onChange={(e) => handlePhoneChange(idx, 'isWhatsApp', e.target.checked)}
                        className="w-4 h-4 text-brand-red rounded border-gray-300 focus:ring-brand-red"
                      />
                      <span className="text-[11px] font-bold">WhatsApp</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => handleRemovePhone(idx)}
                      className="p-1.5 text-gray-400 hover:text-brand-red hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Remove number"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Preview Column (5 Cols) */}
        <div className="lg:col-span-5 space-y-6 sticky top-24">
          <div className="bg-brand-dark text-white p-5 sm:p-6 rounded-2xl shadow-xl border border-white/10 space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-brand-red" />
                <h3 className="font-black text-sm uppercase tracking-wider">Live Footer Preview</h3>
              </div>
              <span className="text-[10px] text-gray-400 font-mono">Real-time</span>
            </div>

            {/* Preview: Brand Column */}
            <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] space-y-1.5">
              <div className="flex items-center gap-2">
                <img src="/flower.png" alt="GELCO" className="h-6 w-6 object-contain bg-white rounded p-0.5" />
                <span className="font-black text-xs uppercase tracking-wide">GELCO PLUS ELECTRICALS</span>
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                {formData.tagline || 'Reliable Electrical Solutions for Every Requirement.'}
              </p>
            </div>

            {/* Preview: Location Card */}
            <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] space-y-1">
              <div className="flex items-center gap-2 text-brand-red text-xs font-black uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5" />
                <span>Location</span>
              </div>
              <p className="text-xs text-gray-300 leading-snug">
                {formData.address || 'Address not specified'}, {formData.city || 'City'}
              </p>
              {formData.locationUrl && (
                <div className="pt-1">
                  <span className="inline-flex items-center gap-1 text-[10px] text-brand-red hover:underline font-bold">
                    <span>View on Google Maps</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </span>
                </div>
              )}
            </div>

            {/* Preview: Contact Card with Multiple Numbers */}
            <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] space-y-2">
              <div className="flex items-center gap-2 text-brand-red text-xs font-black uppercase tracking-wider">
                <Phone className="w-3.5 h-3.5" />
                <span>Contact Numbers</span>
              </div>

              <div className="space-y-1.5 pt-0.5">
                {formData.phones.filter(p => p.number.trim()).map((phone, i) => (
                  <div key={i} className="flex items-center justify-between text-xs py-0.5 border-b border-white/5 last:border-b-0">
                    <div className="flex items-center gap-1.5">
                      <PhoneCall className="w-3 h-3 text-gray-400" />
                      <span className="font-mono font-bold text-white">{phone.number}</span>
                      {phone.label && (
                        <span className="text-[10px] text-gray-400">({phone.label})</span>
                      )}
                    </div>
                    {phone.isWhatsApp && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-green-500/20 text-green-400 border border-green-500/30">
                        WA
                      </span>
                    )}
                  </div>
                ))}

                {formData.email && (
                  <div className="pt-1 text-[11px] text-gray-300 flex items-center gap-1.5">
                    <Mail className="w-3 h-3 text-brand-red" />
                    <span className="truncate">{formData.email}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Save Button in Preview */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving}
              className="w-full py-2.5 px-4 rounded-xl bg-brand-red hover:bg-brand-red-dark text-white text-xs font-black uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-98 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Footer Settings'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
