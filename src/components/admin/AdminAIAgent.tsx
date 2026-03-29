import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Sparkles, Loader2, BrainCircuit, CheckCircle2, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { cn } from '../../lib/utils';
import { doc, setDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../firebase';

export default function AdminAIAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    { role: 'assistant', content: 'Halo Admin! Saya asisten AI khusus untuk membantu Anda mengelola dan mengatur Panel Admin SMK LPPMRI 2 KEDUNGREJA. Saya sekarang bisa membantu Anda memperbarui konten website secara langsung. Apa yang bisa saya bantu hari ini?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const executeToolCall = async (toolCall: any) => {
    const { name, arguments: argsString } = toolCall.function;
    const args = JSON.parse(argsString);

    try {
      if (name === 'update_about_section') {
        await setDoc(doc(db, 'settings', 'about'), {
          content: JSON.stringify(args),
          updatedAt: serverTimestamp()
        });
        return "Berhasil memperbarui bagian 'Tentang Kami'.";
      } else if (name === 'update_hero_section') {
        await setDoc(doc(db, 'settings', 'hero'), {
          content: JSON.stringify(args),
          updatedAt: serverTimestamp()
        });
        return "Berhasil memperbarui bagian 'Hero'.";
      } else if (name === 'update_contact_section') {
        await setDoc(doc(db, 'settings', 'contact'), {
          content: JSON.stringify(args),
          updatedAt: serverTimestamp()
        });
        return "Berhasil memperbarui informasi kontak.";
      } else if (name === 'create_news_article') {
        await addDoc(collection(db, 'news'), {
          ...args,
          authorUid: auth.currentUser?.uid,
          createdAt: serverTimestamp()
        });
        return `Berhasil membuat artikel berita baru: "${args.title}".`;
      } else if (name === 'add_faq_item') {
        await addDoc(collection(db, 'faqs'), {
          ...args,
          createdAt: serverTimestamp()
        });
        return `Berhasil menambahkan FAQ baru: "${args.question}".`;
      } else if (name === 'add_testimonial') {
        await addDoc(collection(db, 'testimonials'), {
          ...args,
          createdAt: serverTimestamp()
        });
        return `Berhasil menambahkan testimoni baru dari: "${args.name}".`;
      } else if (name === 'add_major') {
        await addDoc(collection(db, 'majors'), {
          ...args,
          createdAt: serverTimestamp()
        });
        return `Berhasil menambahkan jurusan baru: "${args.title}".`;
      }
      return "Fungsi tidak dikenal.";
    } catch (error) {
      console.error(`Error executing ${name}:`, error);
      throw error;
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);
    setStatus(null);

    try {
      const response = await fetch("/api/admin/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: messages.concat({ role: 'user', content: userMessage })
        }),
      });

      const data = await response.json();
      const message = data.choices?.[0]?.message;
      
      if (message?.tool_calls) {
        let toolResponses = [];
        for (const toolCall of message.tool_calls) {
          try {
            const result = await executeToolCall(toolCall);
            toolResponses.push(result);
            setStatus({ type: 'success', message: result });
          } catch (err) {
            setStatus({ type: 'error', message: `Gagal menjalankan perintah: ${toolCall.function.name}` });
          }
        }
        
        // After executing tools, we could send the results back to the AI for a final response,
        // but for simplicity, we'll just add a confirmation message.
        const finalContent = message.content || "Saya telah melaksanakan instruksi Anda.";
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: `${finalContent}\n\n**Hasil Eksekusi:**\n${toolResponses.join('\n')}` 
        }]);
      } else {
        const aiResponse = message?.content || "Maaf, saya tidak bisa memproses permintaan Anda saat ini.";
        setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
      }
    } catch (error) {
      console.error("AI Agent Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Maaf, terjadi kesalahan saat menghubungi AI Agent." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center space-x-2 px-4 py-2 rounded-xl transition-all shadow-lg",
          isOpen ? "bg-blue-600 text-white" : "bg-white text-blue-600 border border-blue-100 hover:bg-blue-50"
        )}
      >
        <BrainCircuit className="h-5 w-5" />
        <span className="font-bold text-sm">Bantuan AI Admin</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="absolute top-14 right-0 z-50 w-[350px] sm:w-[450px] h-[500px] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
          >
            <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5" />
                <span className="font-bold">Admin AI Setup Assistant</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-blue-500 p-1 rounded-lg transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-none'
                  }`}>
                    <div className="prose prose-sm max-w-none prose-p:leading-relaxed">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 rounded-tl-none flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                    <span className="text-xs text-gray-500">Berpikir & Menjalankan...</span>
                  </div>
                </div>
              )}
              {status && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex items-center space-x-2 p-3 rounded-xl text-xs font-medium",
                    status.type === 'success' ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-red-50 text-red-700 border border-red-100"
                  )}
                >
                  {status.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                  <span>{status.message}</span>
                </motion.div>
              )}
            </div>

            <div className="p-4 bg-white border-t border-gray-100">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Tanyakan bantuan setup..."
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
    </div>
  );
}
