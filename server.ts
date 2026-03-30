import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // User AI Chat Proxy (Now using OpenRouter step-1-flash)
  app.post("/api/chat", async (req, res) => {
    const { messages } = req.body;
    
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://smk-lppmri-2.run.app",
          "X-Title": "SMK LPPMRI 2 User Assistant",
        },
        body: JSON.stringify({
          model: "stepfun/step-1-flash",
          messages: [
            {
              role: "system",
              content: `Anda adalah asisten AI resmi untuk SMK LPPMRI 2 KEDUNGREJA. 
Tugas Anda adalah membantu calon siswa, orang tua, dan masyarakat umum dengan informasi akurat tentang sekolah.

Informasi Kunci:
- Nama Sekolah: SMK LPPMRI 2 KEDUNGREJA
- Lokasi/Alamat: Jl. Raya Kedungreja No. 123, Kedungreja, Kabupaten Cilacap, Jawa Tengah.
- Jurusan: MPLB, AKL, TJKT.
- Fasilitas: Bengkel industri, Lab Komputer, Perpustakaan Digital, Lapangan Olahraga, Masjid, WiFi.
- Visi & Misi: Menyiapkan generasi unggul, terampil, berkarakter.
- Keunggulan: Lulusan siap kerja (95%), beasiswa, kerjasama industri luas.
- PPDB: Online via website atau offline di sekolah (Januari - Juli).

Gaya Komunikasi: Ramah, profesional, sopan, informatif. Gunakan Bahasa Indonesia yang baik.`
            },
            ...messages.map((msg: any) => ({
              role: msg.role === 'ai' ? 'assistant' : 'user',
              content: msg.content
            }))
          ]
        }),
      });

      const data = await response.json();
      const aiContent = data.choices?.[0]?.message?.content || "Maaf, saya tidak bisa memproses permintaan Anda saat ini.";
      res.json({ content: aiContent });
    } catch (error) {
      console.error("OpenRouter User Chat Error:", error);
      res.status(500).json({ error: "Failed to communicate with AI Agent" });
    }
  });

  // AI Agent Proxy for Admin Panel
  app.post("/api/admin/ai", async (req, res) => {
    const { messages } = req.body;
    
    const ADMIN_SYSTEM_PROMPT = `Anda adalah Asisten Setup Admin untuk Panel Admin SMK LPPMRI 2 KEDUNGREJA.
Tugas Anda adalah membantu administrator mengelola website dengan efisien.

Kemampuan Anda:
1. Menjelaskan cara mengelola berita (tambah, edit, hapus).
2. Membantu menganalisis pesan masuk dari formulir kontak.
3. Memberikan saran konten untuk artikel berita sekolah.
4. Menjelaskan struktur database (User, News, ContactMessages).
5. Memberikan panduan teknis tentang pengaturan panel admin.
6. **MENGIMPLEMENTASIKAN PERUBAHAN**: Anda dapat menyarankan dan langsung menerapkan perubahan pada berbagai bagian website:
   - Bagian 'Tentang Kami', 'Hero', dan 'Kontak'.
   - Menambahkan Berita, FAQ, Testimoni, Statistik, Fasilitas, Ekstrakurikuler, dan Jurusan.

Konteks Teknis:
- Backend: Express.js proxy ke OpenRouter.
- Database: Firestore.
- Frontend: React + Tailwind CSS.
- Admin Email Utama: mplbsmakda@gmail.com

Saat menyarankan perubahan konten, Anda dapat memanggil fungsi yang tersedia. Jawablah dalam Bahasa Indonesia yang profesional.`;

    const tools = [
      {
        type: "function",
        function: {
          name: "update_about_section",
          description: "Memperbarui konten bagian 'Tentang Kami' di website.",
          parameters: {
            type: "object",
            properties: {
              title: { type: "string", description: "Judul bagian Tentang Kami" },
              description: { type: "string", description: "Deskripsi utama sekolah" },
              vision: { type: "string", description: "Visi sekolah" },
              mission: { 
                type: "array", 
                items: { type: "string" },
                description: "Daftar misi sekolah"
              }
            },
            required: ["title", "description", "vision", "mission"]
          }
        }
      },
      {
        type: "function",
        function: {
          name: "update_hero_section",
          description: "Memperbarui konten bagian Hero (paling atas) di website.",
          parameters: {
            type: "object",
            properties: {
              title: { type: "string", description: "Judul utama Hero" },
              subtitle: { type: "string", description: "Sub-judul Hero" },
              ctaText: { type: "string", description: "Teks tombol aksi" },
              imageUrl: { type: "string", description: "URL gambar latar belakang" }
            },
            required: ["title", "subtitle", "ctaText", "imageUrl"]
          }
        }
      },
      {
        type: "function",
        function: {
          name: "update_contact_section",
          description: "Memperbarui informasi kontak sekolah.",
          parameters: {
            type: "object",
            properties: {
              address: { type: "string", description: "Alamat lengkap sekolah" },
              phone: { type: "string", description: "Nomor telepon sekolah" },
              email: { type: "string", description: "Email resmi sekolah" },
              mapUrl: { type: "string", description: "URL embed Google Maps" }
            },
            required: ["address", "phone", "email", "mapUrl"]
          }
        }
      },
      {
        type: "function",
        function: {
          name: "create_news_article",
          description: "Membuat artikel berita baru untuk sekolah.",
          parameters: {
            type: "object",
            properties: {
              title: { type: "string", description: "Judul berita" },
              content: { type: "string", description: "Isi konten berita (Markdown didukung)" },
              category: { type: "string", description: "Kategori berita (misal: Akademik, Prestasi, Kegiatan)" },
              imageUrl: { type: "string", description: "URL gambar untuk berita (opsional)" }
            },
            required: ["title", "content", "category"]
          }
        }
      },
      {
        type: "function",
        function: {
          name: "add_faq_item",
          description: "Menambahkan pertanyaan yang sering diajukan (FAQ) baru.",
          parameters: {
            type: "object",
            properties: {
              question: { type: "string", description: "Pertanyaan" },
              answer: { type: "string", description: "Jawaban" }
            },
            required: ["question", "answer"]
          }
        }
      },
      {
        type: "function",
        function: {
          name: "add_testimonial",
          description: "Menambahkan testimoni siswa atau alumni baru.",
          parameters: {
            type: "object",
            properties: {
              name: { type: "string", description: "Nama pemberi testimoni" },
              role: { type: "string", description: "Peran (misal: Alumni 2020, Siswa Kelas XII)" },
              content: { type: "string", description: "Isi testimoni" },
              avatar: { type: "string", description: "URL avatar (opsional)" }
            },
            required: ["name", "role", "content"]
          }
        }
      },
      {
        type: "function",
        function: {
          name: "add_major",
          description: "Menambahkan program keahlian (jurusan) baru.",
          parameters: {
            type: "object",
            properties: {
              title: { type: "string", description: "Nama jurusan" },
              description: { type: "string", description: "Deskripsi singkat" },
              longDescription: { type: "string", description: "Deskripsi lengkap" },
              icon: { type: "string", enum: ["Briefcase", "Calculator", "Laptop", "Code", "Settings", "PenTool", "Cpu"], description: "Ikon untuk jurusan" },
              color: { type: "string", description: "Kelas warna Tailwind (misal: bg-blue-500)" },
              skills: { type: "array", items: { type: "string" }, description: "Daftar kompetensi keahlian" },
              prospects: { type: "array", items: { type: "string" }, description: "Daftar prospek karir" }
            },
            required: ["title", "description", "longDescription", "icon", "color", "skills", "prospects"]
          }
        }
      }
    ];

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://smk-lppmri-2.run.app",
          "X-Title": "SMK LPPMRI 2 Admin Panel",
        },
        body: JSON.stringify({
          model: "stepfun/step-1-flash",
          messages: [
            {
              role: "system",
              content: ADMIN_SYSTEM_PROMPT
            },
            ...messages
          ],
          tools: tools,
          tool_choice: "auto"
        }),
      });

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("OpenRouter Error:", error);
      res.status(500).json({ error: "Failed to communicate with AI Agent" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
