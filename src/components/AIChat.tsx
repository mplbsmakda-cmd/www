import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Sparkles, Loader2, Image as ImageIcon, BrainCircuit } from 'lucide-react';
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import { cn } from '../lib/utils';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

const SYSTEM_INSTRUCTION = `Anda adalah asisten AI resmi untuk SMK LPPMRI 2 KEDUNGREJA. 
Tugas Anda adalah membantu calon siswa, orang tua, dan masyarakat umum dengan informasi akurat tentang sekolah.

Informasi Kunci:
- Nama: SMK LPPMRI 2 KEDUNGREJA
- Lokasi: Kedungreja, Cilacap, Jawa Tengah.
- Jurusan: Teknik Komputer dan Jaringan (TKJ), Teknik Kendaraan Ringan (TKR), Teknik Sepeda Motor (TSM), Teknik Instalasi Tenaga Listrik (TITL).
- Fasilitas: Bengkel standar industri, Lab Komputer High-Spec, Perpustakaan Digital, Lapangan Olahraga.
- Keunggulan: Lulusan siap kerja (95% terserap), beasiswa prestasi, kerjasama industri luas.
- Pendaftaran: Dibuka Januari - Juli 2026.

Gaya Komunikasi:
- Ramah, profesional, dan informatif.
- Gunakan Bahasa Indonesia yang baik dan benar.
- Jika ditanya tentang lokasi, berikan gambaran umum dan tawarkan bantuan navigasi.
- Jika ditanya tentang pendaftaran, jelaskan syarat dan arahkan ke tombol daftar.

Anda memiliki akses ke alat Google Search untuk berita terkini dan Google Maps untuk lokasi.`;

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([
    { role: 'ai', content: 'Halo! Saya asisten AI SMK LPPMRI 2 KEDUNGREJA. Ada yang bisa saya bantu hari ini?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || isLoading) return;

    const userMessage = input.trim();
    const imageToUpload = selectedImage;
    
    setInput('');
    setSelectedImage(null);
    
    setMessages(prev => [...prev, { 
      role: 'user', 
      content: userMessage || (imageToUpload ? "Menganalisis gambar..." : "") 
    }]);
    setIsLoading(true);

    try {
      const modelName = isThinking ? "gemini-3.1-pro-preview" : "gemini-3-flash-preview";
      const parts: any[] = [{ text: userMessage || "Menganalisis gambar..." }];

      if (imageToUpload) {
        parts.push({
          inlineData: {
            data: imageToUpload.split(',')[1],
            mimeType: "image/jpeg"
          }
        });
      }

      const response = await ai.models.generateContent({
        model: modelName,
        contents: [{ role: "user", parts }],
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          tools: [{ googleSearch: {} }, { googleMaps: {} }],
          thinkingConfig: isThinking ? { thinkingLevel: ThinkingLevel.HIGH } : undefined
        }
      });

      const aiResponse = response.text || "Maaf, saya tidak bisa memproses permintaan Anda saat ini.";
      setMessages(prev => [...prev, { role: 'ai', content: aiResponse }]);
    } catch (error) {
      console.error("Gemini Error:", error);
      setMessages(prev => [...prev, { role: 'ai', content: "Maaf, terjadi kesalahan teknis. Silakan coba lagi nanti." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:bg-blue-700 transition-all hover:scale-110 group"
      >
        <MessageSquare className="h-6 w-6 group-hover:rotate-12 transition-transform" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-24 right-6 z-50 w-[350px] sm:w-[450px] h-[600px] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
          >
            <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5" />
                <span className="font-bold">Asisten AI SMK</span>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setIsThinking(!isThinking)}
                  className={cn(
                    "p-2 rounded-lg transition-colors flex items-center space-x-1 text-xs font-medium",
                    isThinking ? "bg-white text-blue-600" : "bg-blue-500 text-white hover:bg-blue-400"
                  )}
                  title="Thinking Mode"
                >
                  <BrainCircuit className="h-4 w-4" />
                  <span>{isThinking ? 'High' : 'Normal'}</span>
                </button>
                <button onClick={() => setIsOpen(false)} className="hover:bg-blue-500 p-1 rounded-lg transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-none'
                  }`}>
                    <div className="prose prose-sm max-w-none prose-p:leading-relaxed prose-headings:mb-2">
                      <ReactMarkdown>
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 rounded-tl-none flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                    <span className="text-xs text-gray-500">{isThinking ? 'Berpikir mendalam...' : 'Mengetik...'}</span>
                  </div>
                </div>
              )}
            </div>

            {selectedImage && (
              <div className="px-4 py-2 bg-gray-100 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <img src={selectedImage} alt="Preview" className="h-10 w-10 object-cover rounded-lg border border-gray-300" />
                  <span className="text-xs text-gray-500">Gambar siap dianalisis</span>
                </div>
                <button onClick={() => setSelectedImage(null)} className="text-gray-400 hover:text-red-500">
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            <div className="p-4 bg-white border-t border-gray-100">
              <div className="flex items-center space-x-2">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                  title="Upload Gambar"
                >
                  <ImageIcon className="h-5 w-5" />
                </button>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Tanyakan sesuatu..."
                  className="flex-1 bg-gray-100 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading}
                  className="bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
