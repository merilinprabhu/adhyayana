import React, { useRef, useState, useEffect, useCallback } from 'react';
import { 
  Award, 
  Download, 
  Share2, 
  X, 
  CheckCircle2, 
  Sparkles, 
  FileText, 
  Image as ImageIcon, 
  ShieldCheck, 
  Check, 
  Target 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const CertificateModal = ({ 
  isOpen, 
  onClose, 
  candidateName = '', 
  candidateEmail = '', 
  testTitle = 'State Competitive Mock Test', 
  score = 0, 
  totalMarks = 50, 
  accuracy = 0, 
  correctCount = null, 
  wrongCount = null, 
  totalQuestions = null, 
  date = null, 
  attemptId = '' 
}) => {
  const canvasRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(null);

  // Parse numerical metrics safely
  const parsedScore = typeof score === 'number' ? score : (Number(score) || 0);
  const parsedTotalMarks = typeof totalMarks === 'number' && totalMarks > 0 
    ? totalMarks 
    : (Number(totalMarks) || (totalQuestions ? totalQuestions * 2 : 50));
  
  const parsedAccuracy = typeof accuracy === 'number' && !isNaN(accuracy) 
    ? accuracy 
    : (Number(accuracy) || (parsedTotalMarks > 0 ? Math.round((parsedScore / parsedTotalMarks) * 100) : 0));

  const parsedCorrect = correctCount !== null && correctCount !== undefined ? Number(correctCount) : null;
  const parsedWrong = wrongCount !== null && wrongCount !== undefined ? Number(wrongCount) : null;
  const parsedTotalQ = totalQuestions !== null && totalQuestions !== undefined ? Number(totalQuestions) : null;

  const percentage = parsedTotalMarks > 0 
    ? Math.round((parsedScore / parsedTotalMarks) * 100) 
    : parsedAccuracy;

  const isDistinction = percentage >= 75 || parsedAccuracy >= 75;
  const isFirstClass = (percentage >= 60 && percentage < 75) || (parsedAccuracy >= 60 && parsedAccuracy < 75);

  const formattedDate = new Date(date || Date.now()).toLocaleDateString('kn-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const formattedDateEn = new Date(date || Date.now()).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  // Display Name resolution
  const displayName = candidateName && candidateName.trim() && candidateName !== 'Aspirant' 
    ? candidateName.trim() 
    : (candidateEmail ? candidateEmail.split('@')[0].toUpperCase() : 'ಕರ್ನಾಟಕ ಸ್ಪರ್ಧಾ ಪರೀಕ್ಷಾರ್ಥಿ');

  const certId = attemptId || `CERT-${Date.now().toString(36).toUpperCase()}`;

  const renderCertificateCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 2000;
    const height = 1414; // A4 Landscape ratio (1.414:1)
    canvas.width = width;
    canvas.height = height;

    // 1. Background (Royal Parchment Gradient)
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#ffffff');
    bgGrad.addColorStop(0.5, '#faf8f2');
    bgGrad.addColorStop(1, '#f4f0e2');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Outer Ornamental Borders
    ctx.strokeStyle = '#065f46'; // Emerald Green
    ctx.lineWidth = 20;
    ctx.strokeRect(40, 40, width - 80, height - 80);

    ctx.strokeStyle = '#d97706'; // Golden Amber
    ctx.lineWidth = 5;
    ctx.strokeRect(58, 58, width - 116, height - 116);

    ctx.strokeStyle = '#047857';
    ctx.lineWidth = 2;
    ctx.strokeRect(74, 74, width - 148, height - 148);

    // 3. Classical Corner Embellishments
    const drawCorner = (x, y, rotate) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotate);
      ctx.fillStyle = '#d97706';
      ctx.beginPath();
      ctx.arc(0, 0, 26, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#065f46';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(0, 0, 34, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    };

    drawCorner(74, 74, 0);
    drawCorner(width - 74, 74, Math.PI / 2);
    drawCorner(width - 74, height - 74, Math.PI);
    drawCorner(74, height - 74, -Math.PI / 2);

    // 4. Header Top Brand & Mission
    ctx.fillStyle = '#065f46';
    ctx.font = 'bold 36px "Noto Sans Kannada", "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('• ಅ ಧ್ಯ ಯ ನ • ADHYAYANA EDTECH SYSTEMS •', width / 2, 130);

    ctx.fillStyle = '#64748b';
    ctx.font = '22px "Noto Sans Kannada", "Segoe UI", sans-serif';
    ctx.fillText('ಕರ್ನಾಟಕ ಸ್ಪರ್ಧಾತ್ಮಕ ಪರೀಕ್ಷಾ ಆಕಾಂಕ್ಷಿಗಳ ಪ್ರಮುಖ ಡಿಜಿಟಲ್ ವೇದಿಕೆ | Karnataka Premier Exam Portal', width / 2, 170);

    // 5. Golden Seal / Star in Center
    ctx.save();
    ctx.translate(width / 2, 245);
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(0, 0, 48, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 38px sans-serif';
    ctx.fillText('★', 0, 13);
    ctx.restore();

    // 6. Main Certificate Titles
    ctx.fillStyle = '#d97706';
    ctx.font = 'bold 54px "Noto Sans Kannada", "Segoe UI", sans-serif';
    ctx.fillText('ಸಾಧನಾ ಪ್ರಮಾಣಪತ್ರ', width / 2, 355);

    ctx.fillStyle = '#065f46';
    ctx.font = 'bold 32px "Segoe UI", sans-serif';
    ctx.fillText('CERTIFICATE OF EXCELLENCE & ACHIEVEMENT', width / 2, 410);

    // 7. Presentation Subtext
    ctx.fillStyle = '#475569';
    ctx.font = 'italic 25px Georgia, serif';
    ctx.fillText('This Certificate is proudly awarded to / ಈ ಪ್ರಮಾಣಪತ್ರವನ್ನು ಗೌರವಪೂರ್ವಕವಾಗಿ ಪ್ರದಾನ ಮಾಡಲಾಗಿದೆ:', width / 2, 480);

    // 8. Candidate Name (Bold & Highlighted)
    ctx.fillStyle = '#0f172a';
    ctx.font = '900 58px "Noto Sans Kannada", "Segoe UI", sans-serif';
    ctx.fillText(displayName, width / 2, 560);

    // Underline for Candidate Name
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 380, 585);
    ctx.lineTo(width / 2 + 380, 585);
    ctx.stroke();

    // 9. Purpose / Achievement Description
    ctx.fillStyle = '#334155';
    ctx.font = '26px "Noto Sans Kannada", "Segoe UI", sans-serif';
    ctx.fillText('ರಾಜ್ಯಮಟ್ಟದ ಮಾದರಿ ಅಣಕು ಪರೀಕ್ಷಾ ಸರಣಿಯಲ್ಲಿ ಯಶಸ್ವಿಯಾಗಿ ಭಾಗವಹಿಸಿ ಅತ್ಯುತ್ತಮ ಸಾಧನೆ ತೋರಿದ್ದಕ್ಕಾಗಿ:', width / 2, 640);

    ctx.fillStyle = '#065f46';
    ctx.font = 'bold 36px "Noto Sans Kannada", "Segoe UI", sans-serif';
    ctx.fillText(`"${testTitle}"`, width / 2, 695);

    // 10. Performance Metric Badges Box
    const boxY = 750;
    const boxW = 1260;
    const boxX = (width - boxW) / 2;
    const boxH = 150;

    ctx.fillStyle = '#f0fdf4';
    ctx.fillRect(boxX, boxY, boxW, boxH);
    ctx.strokeStyle = '#86efac';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(boxX, boxY, boxW, boxH);

    // Badge 1: Score Obtained
    ctx.fillStyle = '#065f46';
    ctx.font = 'bold 22px "Noto Sans Kannada", "Segoe UI", sans-serif';
    ctx.fillText('ಗಳಿಸಿದ ಅಂಕಗಳು (Score)', boxX + 210, boxY + 45);
    ctx.fillStyle = '#0f172a';
    ctx.font = '900 46px "Segoe UI", sans-serif';
    ctx.fillText(`${parsedScore} / ${parsedTotalMarks}`, boxX + 210, boxY + 105);

    ctx.fillStyle = '#059669';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText(`(${percentage}% Marks)`, boxX + 210, boxY + 133);

    // Divider 1
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(boxX + 420, boxY + 20);
    ctx.lineTo(boxX + 420, boxY + 135);
    ctx.stroke();

    // Badge 2: Accuracy Rate
    ctx.fillStyle = '#065f46';
    ctx.font = 'bold 22px "Noto Sans Kannada", "Segoe UI", sans-serif';
    ctx.fillText('ನಿಖರತೆ (Accuracy Rate)', boxX + 630, boxY + 45);
    ctx.fillStyle = '#0f172a';
    ctx.font = '900 46px "Segoe UI", sans-serif';
    ctx.fillText(`${parsedAccuracy}%`, boxX + 630, boxY + 105);

    if (parsedCorrect !== null) {
      ctx.fillStyle = '#0284c7';
      ctx.font = 'bold 17px "Noto Sans Kannada", sans-serif';
      ctx.fillText(`${parsedCorrect} ಸರಿ ಪ್ರಶ್ನೆಗಳು (${parsedCorrect}/${parsedTotalQ || (parsedCorrect + (parsedWrong || 0))})`, boxX + 630, boxY + 133);
    }

    // Divider 2
    ctx.beginPath();
    ctx.moveTo(boxX + 840, boxY + 20);
    ctx.lineTo(boxX + 840, boxY + 135);
    ctx.stroke();

    // Badge 3: Distinction Grade
    ctx.fillStyle = '#065f46';
    ctx.font = 'bold 22px "Noto Sans Kannada", "Segoe UI", sans-serif';
    ctx.fillText('ಸಾಧನೆಯ ದರ್ಜೆ (Grade)', boxX + 1050, boxY + 45);
    ctx.fillStyle = isDistinction ? '#d97706' : (isFirstClass ? '#059669' : '#0284c7');
    ctx.font = '900 36px "Segoe UI", sans-serif';
    ctx.fillText(isDistinction ? '🏆 DISTINCTION' : (isFirstClass ? '★ 1st CLASS' : '✔ QUALIFIED'), boxX + 1050, boxY + 105);

    // 11. Congratulation Message
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 28px "Noto Sans Kannada", "Segoe UI", sans-serif';
    ctx.fillText('🎉 ಹೃತ್ಪೂರ್ವಕ ಅಭಿನಂದನೆಗಳು! (Hearty Congratulations)', width / 2, 955);

    ctx.fillStyle = '#475569';
    ctx.font = 'italic 23px "Noto Sans Kannada", "Segoe UI", sans-serif';
    ctx.fillText('ನಿಮ್ಮ ನಿರಂತರ ಅಧ್ಯಯನ, ಪರಿಶ್ರಮ ಮತ್ತು ಶ್ರದ್ಧೆಯು ಮುಂಬರುವ ಅಧಿಕೃತ ಸ್ಪರ್ಧಾತ್ಮಕ ಪರೀಕ್ಷೆಯಲ್ಲಿ ಉನ್ನತ ಹುದ್ದೆ ಗಳಿಸಲು ಸಹಕಾರಿಯಾಗಲಿ.', width / 2, 995);
    ctx.fillText('"May your dedication and perseverance lead to victory in upcoming competitive examinations."', width / 2, 1030);

    // 12. Bottom Footer: Verification, Date & Signatures
    const footY = 1170;

    // Left: Date & Certificate ID
    ctx.textAlign = 'left';
    ctx.fillStyle = '#475569';
    ctx.font = '20px "Noto Sans Kannada", "Segoe UI", sans-serif';
    ctx.fillText(`ದಿನಾಂಕ / Date: ${formattedDate} (${formattedDateEn})`, 120, footY);
    ctx.fillText(`Certificate ID: ${certId.slice(0, 26)}`, 120, footY + 30);
    ctx.fillText(`Portal: adhyayana-wheat.vercel.app`, 120, footY + 60);

    // Center: Official Seal Badge
    ctx.textAlign = 'center';
    ctx.save();
    ctx.translate(width / 2, footY + 25);
    ctx.fillStyle = '#065f46';
    ctx.beginPath();
    ctx.arc(0, 0, 52, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3.5;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText('ADHYAYANA', 0, -10);
    ctx.fillText('VERIFIED', 0, 10);
    ctx.fillText('SEAL 2026', 0, 28);
    ctx.restore();

    // Right: Authorized Signature
    ctx.textAlign = 'right';
    ctx.fillStyle = '#065f46';
    ctx.font = 'bold italic 34px cursive, serif';
    ctx.fillText('Savita G.K.', width - 120, footY + 10);

    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width - 340, footY + 25);
    ctx.lineTo(width - 120, footY + 25);
    ctx.stroke();

    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 20px "Noto Sans Kannada", "Segoe UI", sans-serif';
    ctx.fillText('Academic Director / ನಿರ್ದೇಶಕರು', width - 120, footY + 50);
    ctx.fillStyle = '#64748b';
    ctx.font = '16px "Noto Sans Kannada", "Segoe UI", sans-serif';
    ctx.fillText('ADHYAYANA Examination Board, Karnataka', width - 120, footY + 75);
  }, [displayName, testTitle, parsedScore, parsedTotalMarks, parsedAccuracy, parsedCorrect, parsedTotalQ, parsedWrong, percentage, isDistinction, isFirstClass, formattedDate, formattedDateEn, certId]);

  // Trigger celebration confetti & canvas render when opened
  useEffect(() => {
    if (isOpen) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
      // Render canvas immediately and after a short font-settle delay
      renderCertificateCanvas();
      const timer = setTimeout(renderCertificateCanvas, 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen, renderCertificateCanvas]);

  // Download Certificate as PNG Image
  const handleDownloadImage = () => {
    setIsGenerating(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const imageUri = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.download = `Adhyayana_Certificate_${displayName.replace(/\s+/g, '_')}_${Date.now()}.png`;
      link.href = imageUri;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloadSuccess('image');
      setTimeout(() => setDownloadSuccess(null), 4000);
    } catch (e) {
      console.error('Image export failed:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  // Download Certificate as PDF Document
  const handleDownloadPdf = () => {
    setIsGenerating(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const imageUri = canvas.toDataURL('image/jpeg', 0.95);
      
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Adhyayana_Certificate_${displayName}</title>
              <style>
                @page {
                  size: A4 landscape;
                  margin: 0;
                }
                body {
                  margin: 0;
                  padding: 0;
                  background-color: #ffffff;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  height: 100vh;
                  font-family: sans-serif;
                }
                img {
                  width: 100%;
                  max-width: 100vw;
                  max-height: 100vh;
                  object-fit: contain;
                }
              </style>
            </head>
            <body>
              <img src="${imageUri}" alt="Certificate of Excellence" onload="window.print();" />
            </body>
          </html>
        `);
        printWindow.document.close();
      } else {
        handleDownloadImage();
      }

      setDownloadSuccess('pdf');
      setTimeout(() => setDownloadSuccess(null), 4000);
    } catch (e) {
      console.error('PDF export failed:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  // Share on WhatsApp
  const handleShareWhatsApp = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://adhyayana-wheat.vercel.app';
    const text = 
      `🎓 *ಅಧ್ಯಯನ (ADHYAYANA) - ಸಾಧನಾ ಪ್ರಮಾಣಪತ್ರ* 🏆\n` +
      `━━━━━━━━━━━━━━━━━━━━━\n` +
      `👤 *ವಿದ್ಯಾರ್ಥಿ:* ${displayName}\n` +
      `📝 *ಪರೀಕ್ಷೆ:* ${testTitle}\n` +
      `🎯 *ಗಳಿಸಿದ ಅಂಕ:* ${parsedScore} / ${parsedTotalMarks} (${parsedAccuracy}% ನಿಖರತೆ)\n` +
      `🏅 *ದರ್ಜೆ:* ${isDistinction ? 'Distinction Grade' : (isFirstClass ? 'First Class' : 'Qualified')}\n` +
      `📅 *ದಿನಾಂಕ:* ${formattedDate}\n\n` +
      `🎉 *ಅಭಿನಂದನೆಗಳು!* ನಾನೂ ಕೂಡ ಅಧ್ಯಯನ ಮಾಕ್ ಟೆಸ್ಟ್ ಸರಣಿಯಲ್ಲಿ ಭಾಗವಹಿಸಿದ್ದೇನೆ.\n\n` +
      `🚀 *ನೀವು ಪರೀಕ್ಷೆ ಬರೆದು ಪ್ರಮಾಣಪತ್ರ ಪಡೆಯಿರಿ:* ${origin}`;

    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-emerald-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>ಸಾಧನಾ ಪ್ರಮಾಣಪತ್ರ</span>
                <span className="text-xs font-normal text-emerald-400 font-mono">/ Certificate of Excellence</span>
              </h3>
              <p className="text-xs text-slate-400">
                Official verified achievement credential for <strong className="text-emerald-300">{displayName}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Score Highlights Ribbon */}
        <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 p-3 px-6 border-b border-emerald-500/20 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-emerald-300 font-bold">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>🎉 ಹೃತ್ಪೂರ್ವಕ ಅಭಿನಂದನೆಗಳು! ನಿಮ್ಮ ಸಾಧನೆ ಹೀಗಿದೆ:</span>
          </div>

          <div className="flex items-center gap-3 font-mono">
            <span className="bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/30 font-bold">
              ಅಂಕಗಳು: {parsedScore} / {parsedTotalMarks}
            </span>
            <span className="bg-amber-400/15 text-amber-300 px-3 py-1 rounded-full border border-amber-400/30 font-bold">
              ನಿಖರತೆ: {parsedAccuracy}%
            </span>
            {parsedCorrect !== null && (
              <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full border border-blue-500/30 font-bold">
                ಸರಿ: {parsedCorrect}
              </span>
            )}
          </div>
        </div>

        {/* Certificate Preview Screen */}
        <div className="p-4 sm:p-6 bg-slate-950/40 flex flex-col items-center justify-center">
          <div className="w-full overflow-hidden rounded-2xl border border-slate-800 shadow-2xl bg-white">
            <canvas
              ref={canvasRef}
              className="w-full h-auto block"
              style={{ maxHeight: '58vh', objectFit: 'contain' }}
            />
          </div>

          {downloadSuccess && (
            <div className="mt-3 text-xs text-emerald-400 flex items-center gap-1.5 font-bold animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {downloadSuccess === 'image' ? 'ಚಿತ್ರವನ್ನು (PNG Image) ಯಶಸ್ವಿಯಾಗಿ ಡೌನ್‌ಲೋಡ್ ಮಾಡಲಾಗಿದೆ!' : 'PDF ಡೌನ್‌ಲೋಡ್ ಆರಂಭವಾಗಿದೆ!'}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons Bar */}
        <div className="p-4 sm:p-6 bg-slate-950/80 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>256-Bit SSL Verified • Digital Signature</span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Download as Image */}
            <button
              onClick={handleDownloadImage}
              disabled={isGenerating}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-600/20 cursor-pointer"
            >
              <ImageIcon className="w-4 h-4" />
              <span>ಚಿತ್ರ ಡೌನ್‌ಲೋಡ್ (PNG Image)</span>
            </button>

            {/* Download as PDF */}
            <button
              onClick={handleDownloadPdf}
              disabled={isGenerating}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-xl text-xs font-bold flex items-center gap-2 border border-slate-700 transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>PDF ಡೌನ್‌ಲೋಡ್ (Print / Save)</span>
            </button>

            {/* WhatsApp Share */}
            <button
              onClick={handleShareWhatsApp}
              className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>WhatsApp ನಲ್ಲಿ ಶೇರ್ ಮಾಡಿ</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
