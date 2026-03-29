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
6. **MENGIMPLEMENTASIKAN PERUBAHAN**: Anda dapat menyarankan dan langsung menerapkan perubahan pada bagian 'Tentang Kami' atau membuat artikel berita baru jika diminta.

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
          model: "stepfun/step-flash-free",
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
