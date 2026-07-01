import React from 'react';
import { TypingStats, TypingLayout } from '../../types';
import { getLayoutLabel, formatTime } from '../../utils/typingUtils';
import { FiRefreshCw, FiCheckCircle } from 'react-icons/fi';
import MistakeHeatmap from './MistakeHeatmap';

interface ResultModalProps {
  stats: TypingStats;
  layout: TypingLayout;
  onRetry: () => void;
  onNewTest: () => void;
  saving: boolean;
  keyMistakes: Record<string, number>;
  wpmHistory: { time: number; wpm: number }[];
  userName?: string;
}

const ResultModal = ({
  stats, layout, onRetry, onNewTest, saving,
  keyMistakes, wpmHistory, userName,
}: ResultModalProps) => {

  const hasMistakes = Object.keys(keyMistakes).length > 0;

  const handleDownloadCertificate = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 900;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 900, 600);

    // Outer blue border
    ctx.strokeStyle = '#1d4ed8';
    ctx.lineWidth = 20;
    ctx.strokeRect(10, 10, 880, 580);

    // Inner decorative border
    ctx.strokeStyle = '#93c5fd';
    ctx.lineWidth = 2;
    ctx.strokeRect(28, 28, 844, 544);

    // Subtle background pattern — light blue tint corners
    const grad = ctx.createRadialGradient(450, 300, 100, 450, 300, 500);
    grad.addColorStop(0, 'rgba(255,255,255,0)');
    grad.addColorStop(1, 'rgba(219,234,254,0.35)');
    ctx.fillStyle = grad;
    ctx.fillRect(30, 30, 840, 540);

    // Logo
    ctx.textAlign = 'center';
    ctx.fillStyle = '#1d4ed8';
    ctx.font = 'bold 26px Arial, sans-serif';
    ctx.fillText('HindiTypingPro', 450, 80);

    // Title
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 40px Georgia, serif';
    ctx.fillText('Typing Speed Certificate', 450, 155);

    // Divider line
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(150, 175);
    ctx.lineTo(750, 175);
    ctx.stroke();

    // Achievement statement
    const name = userName || 'Typist';
    ctx.fillStyle = '#374151';
    ctx.font = '20px Arial, sans-serif';
    ctx.fillText(`This certifies that ${name} achieved`, 450, 230);

    ctx.fillStyle = '#1d4ed8';
    ctx.font = 'bold 56px Arial, sans-serif';
    ctx.fillText(`${stats.wpm} WPM`, 450, 305);

    ctx.fillStyle = '#374151';
    ctx.font = '20px Arial, sans-serif';
    ctx.fillText(`at ${stats.accuracy}% accuracy`, 450, 350);

    // Layout and date
    ctx.fillStyle = '#6b7280';
    ctx.font = '17px Arial, sans-serif';
    ctx.fillText(`Layout: ${getLayoutLabel(layout)}`, 450, 405);

    const today = new Date().toLocaleDateString('en-IN', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
    ctx.fillText(`Date: ${today}`, 450, 435);

    // Seal circle
    ctx.beginPath();
    ctx.arc(790, 490, 68, 0, Math.PI * 2);
    ctx.fillStyle = '#eff6ff';
    ctx.fill();
    ctx.strokeStyle = '#1d4ed8';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Inner ring of seal
    ctx.beginPath();
    ctx.arc(790, 490, 58, 0, Math.PI * 2);
    ctx.strokeStyle = '#93c5fd';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#1d4ed8';
    ctx.font = 'bold 30px Arial, sans-serif';
    ctx.fillText(`${stats.wpm}`, 790, 488);
    ctx.font = '14px Arial, sans-serif';
    ctx.fillText('WPM', 790, 510);

    // Convert to blob and trigger download
    canvas.toBlob(blob => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'typing-certificate.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 'image/png');
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 max-w-2xl w-full my-4">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiCheckCircle className="text-green-500" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Test Complete!</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{getLayoutLabel(layout)}</p>
        </div>

        {/* Main stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-primary-50 dark:bg-primary-900/20 rounded-2xl p-4 text-center">
            <div className="text-4xl font-bold text-primary-600 dark:text-primary-400">{stats.wpm}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">WPM</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-4 text-center">
            <div className="text-4xl font-bold text-green-600 dark:text-green-400">{stats.accuracy}%</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Accuracy</div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 text-center">
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">{stats.cpm}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">CPM</div>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-4 text-center">
            <div className="text-4xl font-bold text-red-500 dark:text-red-400">{stats.mistakes}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Mistakes</div>
          </div>
        </div>

        {/* Secondary stats */}
        <div className="grid grid-cols-3 gap-3 mb-6 text-center text-sm">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3">
            <div className="font-semibold text-gray-800 dark:text-gray-200">{stats.correctChars}</div>
            <div className="text-gray-400">Correct</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3">
            <div className="font-semibold text-gray-800 dark:text-gray-200">{stats.wrongChars}</div>
            <div className="text-gray-400">Wrong</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3">
            <div className="font-semibold text-gray-800 dark:text-gray-200">{formatTime(stats.timeElapsed)}</div>
            <div className="text-gray-400">Time</div>
          </div>
        </div>

        {/* Mistake Heatmap */}
        {hasMistakes && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Mistake Heatmap</h3>
            <div className="overflow-x-auto">
              <MistakeHeatmap keyMistakes={keyMistakes} layout={layout} />
            </div>
          </div>
        )}

        {saving && (
          <p className="text-center text-sm text-gray-400 mb-4">Saving result...</p>
        )}

        {/* Certificate download */}
        {stats.wpm >= 20 && (
          <div className="mb-4 space-y-2">
            <button
              onClick={handleDownloadCertificate}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md"
            >
              🏆 Download Certificate
            </button>
            <button
              onClick={() => {
                const text = `🎯 I just scored ${stats.wpm} WPM at ${stats.accuracy}% accuracy on HindiTypingPro!\n\nPractice Hindi typing for SSC, HSSC & Court exams. Join me!\n👉 https://hindi-typing-prep.onrender.com`;
                window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-medium transition-all shadow-md"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Share on WhatsApp
            </button>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={onRetry}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-primary-600 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 font-medium transition-colors"
          >
            <FiRefreshCw size={18} />
            Retry
          </button>
          <button
            onClick={onNewTest}
            className="flex-1 px-4 py-3 rounded-xl bg-primary-600 text-white hover:bg-primary-700 font-medium transition-colors"
          >
            New Test
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultModal;
