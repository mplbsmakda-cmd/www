import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Target, Eye } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

interface AboutContent {
  title: string;
  description: string;
  vision: string;
  mission: string[];
}

const defaultContent: AboutContent = {
  title: 'Tentang SMK LPPMRI 2 KEDUNGREJA',
  description: 'SMK LPPMRI 2 KEDUNGREJA adalah institusi pendidikan kejuruan yang berdedikasi untuk mencetak lulusan yang kompeten di bidang teknologi dan industri. Dengan kurikulum yang selaras dengan kebutuhan industri terkini, kami memastikan setiap siswa mendapatkan bekal yang cukup untuk bersaing di dunia kerja.',
  vision: 'Menjadi sekolah kejuruan unggulan yang menghasilkan lulusan berakhlak mulia, profesional, dan mandiri.',
  mission: [
    'Menyelenggarakan pendidikan berbasis kompetensi industri.',
    'Membentuk karakter siswa yang disiplin dan bertanggung jawab.',
    'Menjalin kemitraan strategis dengan dunia usaha dan industri.'
  ]
};

export default function About() {
  const [content, setContent] = useState<AboutContent>(defaultContent);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const docRef = doc(db, 'settings', 'about');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.content) {
            setContent(JSON.parse(data.content));
          }
        }
      } catch (error) {
        console.error("Error fetching about content:", error);
      }
    };
    fetchAbout();
  }, []);

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:w-1/2"
          >
            <div className="relative">
              <img
                src="https://picsum.photos/seed/school/800/600"
                alt="Tentang SMK LPPMRI 2 KEDUNGREJA"
                className="rounded-3xl shadow-2xl relative z-10"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-blue-600 rounded-3xl -z-0" />
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-100 rounded-3xl -z-0" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:w-1/2"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">{content.title}</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              {content.description}
            </p>

            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="mt-1 bg-blue-100 p-2 rounded-lg text-blue-600">
                  <Eye className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Visi</h3>
                  <p className="text-gray-600 text-sm">
                    {content.vision}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="mt-1 bg-blue-100 p-2 rounded-lg text-blue-600">
                  <Target className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Misi</h3>
                  <ul className="text-gray-600 text-sm space-y-2">
                    {content.mission.map((m, i) => (
                      <li key={i} className="flex items-center">
                        <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                        {m}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
