import { motion } from 'motion/react';
import { Cpu, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { majors } from '../data/majors';

export default function Majors() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Program Keahlian</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Pilih jurusan yang sesuai dengan minat dan bakatmu untuk membangun karir impian di masa depan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {majors.map((major, index) => (
            <motion.div
              key={major.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group flex flex-col"
            >
              <div className={`w-12 h-12 ${major.color} rounded-xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform`}>
                <major.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{major.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow">
                {major.description}
              </p>
              <Link 
                to={`/majors/${major.id}`}
                className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center group/btn"
              >
                Selengkapnya
                <ArrowRight className="ml-1 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
