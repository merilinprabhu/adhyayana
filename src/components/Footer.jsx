import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { 
  BookOpen, 
  ShieldCheck, 
  Mail, 
  Phone, 
  MapPin, 
  CheckCircle, 
  Edit3, 
  Save, 
  X, 
  Send, 
  Clock, 
  MessageCircle,
  ExternalLink,
  Sparkles
} from 'lucide-react';

export const Footer = ({ onNavigate }) => {
  const { lang, footerConfig, updateFooterConfig } = useData();
  const { isDeveloper } = useAuth();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState(footerConfig || {});

  const handleOpenEdit = () => {
    setFormData(footerConfig || {});
    setIsEditModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateFooterConfig(formData);
    setIsEditModalOpen(false);
  };

  const currentAbout = lang === 'kn' ? (footerConfig?.aboutKn || 'ಕರ್ನಾಟಕದ ಸ್ಪರ್ಧಾತ್ಮಕ ಪರೀಕ್ಷಾರ್ಥಿಗಳಿಗಾಗಿ ಅತ್ಯಾಧುನಿಕ, ಸುರಕ್ಷಿತ ಹಾಗೂ ಆಟೋಮ್ಯಾಟಿಕ್ ಟೆಸ್ಟ್ ಮತ್ತು ನೋಟ್ಸ್ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್.') : (footerConfig?.aboutEn || 'Advanced, dynamic and secure exam readiness ecosystem for KPSC, Karnataka Police, Banking, TET, and State exams.');
  const currentAddress = lang === 'kn' ? (footerConfig?.addressKn || 'ಬೆಂಗಳೂರು, ಕರ್ನಾಟಕ - 560001') : (footerConfig?.addressEn || 'Bengaluru, Karnataka - 560001');
  const currentHours = lang === 'kn' ? (footerConfig?.workingHoursKn || 'ಸೋಮವಾರ - ಶನಿವಾರ: ಬೆಳಗ್ಗೆ 9 ರಿಂದ ಸಂಜೆ 7') : (footerConfig?.workingHoursEn || 'Mon - Sat: 9:00 AM - 7:00 PM');

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800/80 pt-12 pb-8 transition-colors relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Developer Floating Quick Edit Bar */}
        {isDeveloper && (
          <div className="mb-8 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-wrap items-center justify-between gap-3 text-xs text-amber-300">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span className="font-bold">ಡೆವಲಪರ್ ಮೋಡ್ (Developer Mode):</span>
              <span>ಫೂಟರ್ ಹಾಗೂ ಸಂಪರ್ಕ ವಿವರಗಳನ್ನು (Phone, Email, Address, Socials) ಸುಲಭವಾಗಿ ಬದಲಾಯಿಸಿ.</span>
            </div>
            <button
              onClick={handleOpenEdit}
              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-black flex items-center gap-1.5 shadow-sm transition-all text-xs"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>ಸಂಪರ್ಕ ವಿವರ ತಿದ್ದುಪಡಿ (Edit Contact Details)</span>
            </button>
          </div>
        )}

        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-black text-white tracking-wide">ADHYAYANA</span>
                <p className="text-[10px] text-emerald-400 font-semibold">ಅಧ್ಯಯನ • ಜ್ಞಾನವೇ ಶಕ್ತಿ</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {currentAbout}
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>1-User 1-Gmail Security Enabled</span>
            </div>
            {footerConfig?.telegramUrl && (
              <a 
                href={footerConfig.telegramUrl} 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-xs text-sky-400 hover:text-sky-300 font-medium bg-sky-950/40 border border-sky-800/40 px-3 py-1.5 rounded-lg"
              >
                <Send className="w-3.5 h-3.5" />
                <span>ಟೆಲಿಗ್ರಾಂ ಚಾನೆಲ್ ಸೇರಿ (Telegram)</span>
              </a>
            )}
          </div>

          {/* Exam Streams */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
              {lang === 'kn' ? 'ಸ್ಪರ್ಧಾತ್ಮಕ ಪರೀಕ್ಷೆಗಳು' : 'Exam Categories'}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="hover:text-emerald-400 cursor-pointer transition-colors" onClick={() => onNavigate && onNavigate('exams')}>
                • KPSC KAS (ಕರ್ನಾಟಕ ಆಡಳಿತ ಸೇವೆ)
              </li>
              <li className="hover:text-emerald-400 cursor-pointer transition-colors" onClick={() => onNavigate && onNavigate('exams')}>
                • FDA / SDA / VAO (ಗ್ರಾಮ ಆಡಳಿತಾಧಿಕಾರಿ)
              </li>
              <li className="hover:text-emerald-400 cursor-pointer transition-colors" onClick={() => onNavigate && onNavigate('exams')}>
                • HSTR / GPSTR ಶಿಕ್ಷಕರ ನೇಮಕಾತಿ
              </li>
              <li className="hover:text-emerald-400 cursor-pointer transition-colors" onClick={() => onNavigate && onNavigate('exams')}>
                • Karnataka Police PSI & Constable
              </li>
              <li className="hover:text-emerald-400 cursor-pointer transition-colors" onClick={() => onNavigate && onNavigate('exams')}>
                • KARTET & CTET ಸರಣಿಗಳು
              </li>
            </ul>
          </div>

          {/* Key Features */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
              {lang === 'kn' ? 'ಪ್ರಮುಖ ವೈಶಿಷ್ಟ್ಯಗಳು' : 'Platform Features'}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Google Sheets 1-Click Live Sync</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Watermarked Digital PDF Notes</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Real CBT Mock Test Engine with Analysis</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Zero Gateway Fee Instant UPI / QR</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>ದ್ವಿಭಾಷಾ ಬೆಂಬಲ (Kannada & English)</span>
              </li>
            </ul>
          </div>

          {/* Contact & Support (Editable) */}
          <div className="relative group">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                {lang === 'kn' ? 'ಸಂಪರ್ಕ & ಬೆಂಬಲ' : 'Support & Contact'}
              </h4>
              {isDeveloper && (
                <button
                  onClick={handleOpenEdit}
                  title="ಸಂಪರ್ಕ ವಿವರ ಬದಲಾಯಿಸಿ (Edit Contact Info)"
                  className="text-amber-400 hover:text-amber-300 p-1 rounded hover:bg-amber-400/20 text-xs font-semibold flex items-center gap-1"
                >
                  <Edit3 className="w-3 h-3" />
                  <span className="text-[10px]">Edit</span>
                </button>
              )}
            </div>

            <div className="space-y-2.5 text-xs text-slate-400">
              {footerConfig?.email && (
                <a 
                  href={`mailto:${footerConfig.email}`}
                  className="flex items-center gap-2 hover:text-emerald-400 transition-colors"
                >
                  <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{footerConfig.email}</span>
                </a>
              )}

              {footerConfig?.phone && (
                <a 
                  href={`tel:${footerConfig.phone.replace(/[^0-9+]/g, '')}`}
                  className="flex items-center gap-2 hover:text-emerald-400 transition-colors"
                >
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{footerConfig.phone}</span>
                </a>
              )}

              {footerConfig?.whatsappNumber && (
                <a 
                  href={`https://wa.me/91${footerConfig.whatsappNumber.replace(/[^0-9]/g, '')}?text=Hello%20Adhyayana%20Team`}
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-medium"
                >
                  <MessageCircle className="w-4 h-4 shrink-0" />
                  <span>WhatsApp: +91 {footerConfig.whatsappNumber}</span>
                </a>
              )}

              {currentAddress && (
                <p className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{currentAddress}</span>
                </p>
              )}

              {currentHours && (
                <p className="flex items-center gap-2 text-slate-500 text-[11px] pt-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{currentHours}</span>
                </p>
              )}
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-900 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} {footerConfig?.copyrightText || 'ADHYAYANA EdTech Systems. All Rights Reserved.'}</p>
          <div className="flex gap-6">
            <span className="hover:text-slate-400 cursor-pointer">ಗೌಪ್ಯತೆ ನೀತಿ (Privacy)</span>
            <span className="hover:text-slate-400 cursor-pointer">ನಿಯಮಗಳು (Terms)</span>
            <span className="hover:text-slate-400 cursor-pointer">ಪರೀಕ್ಷಾ ನೀತಿ (Guidelines)</span>
          </div>
        </div>

      </div>

      {/* Developer Edit Contact Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 text-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-bold text-white">ಸಂಪರ್ಕ & ಫೂಟರ್ ವಿವರಗಳ ಎಡಿಟರ್ (Footer Contact Editor)</h3>
              </div>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-4 space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">ಸಹಾಯವಾಣಿ ಇಮೇಲ್ (Support Email):</label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="support@adhyayana.edu"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">ಮುಖ್ಯ ಫೋನ್ ಸಂಖ್ಯೆ (Phone):</label>
                  <input
                    type="text"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 (80) 4122-ADHYAYANA"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">WhatsApp ಸಂಖ್ಯೆ (10 ಅಂಕೆ):</label>
                  <input
                    type="text"
                    value={formData.whatsappNumber || ''}
                    onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                    placeholder="9480123456"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">ಟೆಲಿಗ್ರಾಂ ಲಿಂಕ್ (Telegram URL):</label>
                  <input
                    type="text"
                    value={formData.telegramUrl || ''}
                    onChange={(e) => setFormData({ ...formData, telegramUrl: e.target.value })}
                    placeholder="https://t.me/adhyayana_karnataka"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">ವಿಳಾಸ (ಕನ್ನಡದಲ್ಲಿ - Address Kn):</label>
                <input
                  type="text"
                  value={formData.addressKn || ''}
                  onChange={(e) => setFormData({ ...formData, addressKn: e.target.value })}
                  placeholder="ಬೆಂಗಳೂರು, ಕರ್ನಾಟಕ - 560001"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">ವಿಳಾಸ (ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ - Address En):</label>
                <input
                  type="text"
                  value={formData.addressEn || ''}
                  onChange={(e) => setFormData({ ...formData, addressEn: e.target.value })}
                  placeholder="Bengaluru, Karnataka - 560001"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">ಸಂಸ್ಥೆಯ ಕಿರು ಪರಿಚಯ (About Text - Kannada):</label>
                <textarea
                  rows="2"
                  value={formData.aboutKn || ''}
                  onChange={(e) => setFormData({ ...formData, aboutKn: e.target.value })}
                  placeholder="ಕರ್ನಾಟಕದ ಸ್ಪರ್ಧಾತ್ಮಕ ಪರೀಕ್ಷಾರ್ಥಿಗಳಿಗಾಗಿ..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">ಕಾರ್ಯನಿರ್ವಹಣಾ ಸಮಯ (Working Hours):</label>
                <input
                  type="text"
                  value={formData.workingHoursKn || ''}
                  onChange={(e) => setFormData({ ...formData, workingHoursKn: e.target.value })}
                  placeholder="ಸೋಮವಾರ - ಶನಿವಾರ: ಬೆಳಗ್ಗೆ 9 ರಿಂದ ಸಂಜೆ 7"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-all"
                >
                  ರದ್ದು (Cancel)
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-2 shadow-lg shadow-emerald-900/40 transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>ಉಳಿಸಿ (Save Changes)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </footer>
  );
};
