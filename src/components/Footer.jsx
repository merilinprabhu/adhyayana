import React from 'react';
import { useData } from '../context/DataContext';
import { BookOpen, ShieldCheck, Mail, Phone, MapPin, Award, CheckCircle } from 'lucide-react';

export const Footer = ({ onNavigate }) => {
  const { lang } = useData();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-12 pb-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-black text-white">ADHYAYANA</span>
                <p className="text-[10px] text-emerald-400 font-semibold">ಅಧ್ಯಯನ • ಜ್ಞಾನವೇ ಶಕ್ತಿ</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {lang === 'kn'
                ? 'ಕರ್ನಾಟಕದ ಸ್ಪರ್ಧಾತ್ಮಕ ಪರೀಕ್ಷಾರ್ಥಿಗಳಿಗಾಗಿ ಅತ್ಯಾಧುನಿಕ, ಸುರಕ್ಷಿತ ಹಾಗೂ ಆಟೋಮ್ಯಾಟಿಕ್ ಟೆಸ್ಟ್ ಮತ್ತು ನೋಟ್ಸ್ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್.'
                : 'Advanced, dynamic and secure exam readiness ecosystem for KPSC, Karnataka Police, Banking, TET, and State exams.'}
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>1-Person 1-Gmail Security Enabled</span>
            </div>
          </div>

          {/* Exam Streams */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
              {lang === 'kn' ? 'ಸ್ಪರ್ಧಾತ್ಮಕ ಪರೀಕ್ಷೆಗಳು' : 'Exam Categories'}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="hover:text-emerald-400 cursor-pointer" onClick={() => onNavigate('exams')}>
                • KPSC KAS (ಕರ್ನಾಟಕ ಆಡಳಿತ ಸೇವೆ)
              </li>
              <li className="hover:text-emerald-400 cursor-pointer" onClick={() => onNavigate('exams')}>
                • FDA / SDA / VAO (ಗ್ರಾಮ ಆಡಳಿತಾಧಿಕಾರಿ)
              </li>
              <li className="hover:text-emerald-400 cursor-pointer" onClick={() => onNavigate('exams')}>
                • Karnataka Police PSI & Constable
              </li>
              <li className="hover:text-emerald-400 cursor-pointer" onClick={() => onNavigate('exams')}>
                • KARTET & GPSTR Teacher Recruitment
              </li>
              <li className="hover:text-emerald-400 cursor-pointer" onClick={() => onNavigate('exams')}>
                • Banking & SSC Kannada Series
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
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Google Sheets 1-Click Test Sync</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Google Drive PDF Notes with Watermark</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Anti-Cheat Real-time Mock Test Engine</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Unique Student Performance Dashboard</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Bilingual Kannada & English Support</span>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
              {lang === 'kn' ? 'ಸಂಪರ್ಕ & ಬೆಂಬಲ' : 'Support & Contact'}
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400" />
                <span>support@adhyayana.edu</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>+91 (80) 4122-ADHYAYANA</span>
              </p>
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Bengaluru, Karnataka - 560001</span>
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} ADHYAYANA EdTech Systems. All Rights Reserved.</p>
          <div className="flex gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Content Security Guidelines</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
