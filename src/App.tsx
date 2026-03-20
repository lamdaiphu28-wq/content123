/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useCallback } from 'react';
import { 
  Search, 
  Upload, 
  FileText, 
  Tag, 
  Lightbulb, 
  Globe, 
  Image as ImageIcon, 
  X, 
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { analyzeLensProduct, SEOAnalysisResult } from './services/geminiService';

export default function App() {
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<{ data: string; type: string } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<SEOAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage({
          data: reader.result as string,
          type: file.type
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAnalyze = async () => {
    if (!description && !image) {
      setError('Vui lòng nhập mô tả sản phẩm hoặc tải lên hình ảnh.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const analysis = await analyzeLensProduct(description, image?.data, image?.type);
      if (analysis) {
        setResult(analysis);
      } else {
        setError('Không thể phân tích sản phẩm. Vui lòng thử lại.');
      }
    } catch (err) {
      setError('Đã xảy ra lỗi trong quá trình phân tích.');
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#1a1a1a] font-sans selection:bg-emerald-100">
      {/* Header */}
      <header className="bg-white border-b border-black/5 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-600/20">
              <Search size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Lens SEO Specialist</h1>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Content AI Assistant</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-sm font-medium text-gray-500">
            <span className="flex items-center gap-1.5"><Globe size={14} /> Nguồn tin cậy</span>
            <span className="flex items-center gap-1.5"><Tag size={14} /> Chuẩn SEO</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Input Section */}
          <div className="lg:col-span-5 space-y-8">
            <section className="bg-white rounded-3xl p-8 shadow-sm border border-black/5">
              <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <FileText size={20} className="text-emerald-600" />
                Thông tin sản phẩm
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Mô tả hoặc Tên sản phẩm</label>
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ví dụ: Lens xám tây 1 ngày, độ ẩm cao, chống tia UV..."
                    className="w-full h-32 px-4 py-3 rounded-2xl bg-gray-50 border border-transparent focus:border-emerald-500 focus:bg-white outline-none transition-all resize-none text-sm leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Hình ảnh sản phẩm (Tùy chọn)</label>
                  <div 
                    onClick={() => !image && fileInputRef.current?.click()}
                    className={`relative border-2 border-dashed rounded-2xl transition-all cursor-pointer overflow-hidden ${
                      image ? 'border-emerald-500 bg-emerald-50/30' : 'border-gray-200 hover:border-emerald-400 hover:bg-gray-50'
                    }`}
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    
                    {image ? (
                      <div className="relative aspect-video w-full">
                        <img src={image.data} alt="Preview" className="w-full h-full object-cover" />
                        <button 
                          onClick={(e) => { e.stopPropagation(); clearImage(); }}
                          className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full hover:bg-black transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="py-10 flex flex-col items-center justify-center text-gray-400">
                        <ImageIcon size={32} className="mb-2 opacity-50" />
                        <p className="text-sm font-medium">Kéo thả hoặc click để tải ảnh</p>
                        <p className="text-xs mt-1">Hỗ trợ JPG, PNG, WEBP</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white rounded-2xl font-bold shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        Đang phân tích...
                      </>
                    ) : (
                      <>
                        <Search size={20} />
                        Phân tích & Viết nội dung
                      </>
                    )}
                  </button>
                  <button 
                    onClick={() => {
                      setDescription('');
                      clearImage();
                      setResult(null);
                      setError(null);
                    }}
                    disabled={isAnalyzing}
                    className="px-6 py-4 bg-white border border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-2xl font-bold transition-all"
                    title="Làm mới"
                  >
                    <X size={20} />
                  </button>
                </div>

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-600 text-sm"
                  >
                    <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
                    <p>{error}</p>
                  </motion.div>
                )}
              </div>
            </section>

            <section className="bg-emerald-900 rounded-3xl p-8 text-white shadow-xl shadow-emerald-900/20">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <CheckCircle2 size={20} className="text-emerald-400" />
                Tại sao chọn chúng tôi?
              </h3>
              <ul className="space-y-4 text-sm text-emerald-100/80">
                <li className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-800 flex items-center justify-center text-emerald-400 text-[10px] font-bold shrink-0">01</div>
                  <p>Phân tích từ khóa dựa trên dữ liệu thực tế và xu hướng tìm kiếm.</p>
                </li>
                <li className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-800 flex items-center justify-center text-emerald-400 text-[10px] font-bold shrink-0">02</div>
                  <p>Tham chiếu từ các nguồn tin cậy về nhãn khoa và thời trang lens.</p>
                </li>
                <li className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-800 flex items-center justify-center text-emerald-400 text-[10px] font-bold shrink-0">03</div>
                  <p>Tối ưu hóa nội dung cho cả người dùng và công cụ tìm kiếm.</p>
                </li>
              </ul>
            </section>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  {/* Summary Card */}
                  <div className="bg-white rounded-3xl p-8 shadow-sm border border-black/5">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h2 className="text-2xl font-bold text-emerald-900">{result.productName}</h2>
                        <p className="text-gray-500 mt-1">{result.description}</p>
                      </div>
                      <div className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-widest rounded-full">
                        Phân tích hoàn tất
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-8">
                      {result.keywords.map((kw, idx) => (
                        <span key={idx} className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg border border-gray-200 flex items-center gap-1.5">
                          <Tag size={12} className="text-emerald-500" />
                          {kw}
                        </span>
                      ))}
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(result.keywords.join(', '));
                          alert('Đã sao chép bộ từ khóa!');
                        }}
                        className="px-3 py-1.5 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-lg border border-emerald-100 hover:bg-emerald-100 transition-colors"
                      >
                        Sao chép tất cả
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                        <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                          <Globe size={16} className="text-emerald-600" />
                          Phân tích nguồn tin
                        </h3>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          {result.competitorAnalysis}
                        </p>
                      </div>
                      <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
                        <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                          <Lightbulb size={16} className="text-emerald-600" />
                          Mẹo SEO tối ưu
                        </h3>
                        <ul className="space-y-2">
                          {result.seoTips.map((tip, idx) => (
                            <li key={idx} className="text-xs text-emerald-800 flex gap-2">
                              <span className="text-emerald-400">•</span>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Suggested Content */}
                  <div className="bg-white rounded-3xl p-8 shadow-sm border border-black/5">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-semibold flex items-center gap-2">
                        <FileText size={20} className="text-emerald-600" />
                        Nội dung mẫu chuẩn SEO
                      </h2>
                      <button 
                        onClick={() => navigator.clipboard.writeText(result.suggestedContent)}
                        className="text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
                      >
                        Sao chép nội dung
                      </button>
                    </div>
                    <div className="prose prose-sm prose-emerald max-w-none prose-p:leading-relaxed prose-headings:text-emerald-900">
                      <Markdown>{result.suggestedContent}</Markdown>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-12 bg-white/50 border-2 border-dashed border-gray-200 rounded-3xl">
                  {isAnalyzing ? (
                    <div className="space-y-4">
                      <Loader2 size={48} className="animate-spin text-emerald-600 mx-auto" />
                      <div>
                        <p className="text-lg font-bold text-emerald-900">Đang phân tích dữ liệu...</p>
                        <p className="text-sm text-gray-500 max-w-xs mx-auto mt-2">
                          Chúng tôi đang tìm kiếm thông tin từ các nguồn uy tín và tối ưu hóa từ khóa cho bạn.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
                        <Search size={32} />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-gray-400">Chưa có kết quả phân tích</p>
                        <p className="text-sm text-gray-400 max-w-xs mx-auto mt-2">
                          Nhập thông tin sản phẩm ở bên trái để bắt đầu tạo nội dung chuẩn SEO.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <footer className="py-12 border-t border-black/5 mt-12">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">
            © 2026 Lens SEO Specialist • Powered by Gemini AI
          </p>
        </div>
      </footer>
    </div>
  );
}
