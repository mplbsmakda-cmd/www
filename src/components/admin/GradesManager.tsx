import { useState, useEffect } from 'react';
import { collection, getDocs, doc, setDoc, getDoc, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { Loader2, Search, Save, CheckCircle2, AlertCircle, Users } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Student {
  id: string;
  fullName: string;
  nisn: string;
  major: string;
}

interface Grade {
  math: number;
  indonesian: number;
  english: number;
  science: number;
  average: number;
}

export default function GradesManager() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [grades, setGrades] = useState<Grade>({
    math: 0,
    indonesian: 0,
    english: 0,
    science: 0,
    average: 0
  });
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'registrations'));
        const studentData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Student[];
        setStudents(studentData);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const fetchGrades = async (studentId: string) => {
    try {
      const docRef = doc(db, 'grades', studentId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setGrades(docSnap.data() as Grade);
      } else {
        setGrades({ math: 0, indonesian: 0, english: 0, science: 0, average: 0 });
      }
    } catch (error) {
      console.error("Error fetching grades:", error);
    }
  };

  const handleStudentSelect = (student: Student) => {
    setSelectedStudent(student);
    fetchGrades(student.id);
    setStatus(null);
  };

  const handleGradeChange = (field: keyof Grade, value: string) => {
    const numValue = parseFloat(value) || 0;
    const newGrades = { ...grades, [field]: numValue };
    
    // Calculate average
    const { math, indonesian, english, science } = newGrades;
    newGrades.average = (math + indonesian + english + science) / 4;
    
    setGrades(newGrades);
  };

  const handleSave = async () => {
    if (!selectedStudent) return;
    setSaving(true);
    setStatus(null);
    try {
      await setDoc(doc(db, 'grades', selectedStudent.id), {
        ...grades,
        studentName: selectedStudent.fullName,
        updatedAt: new Date()
      });
      setStatus({ type: 'success', message: 'Nilai berhasil disimpan!' });
    } catch (error) {
      console.error("Error saving grades:", error);
      setStatus({ type: 'error', message: 'Gagal menyimpan nilai.' });
    } finally {
      setSaving(false);
    }
  };

  const filteredStudents = students.filter(s => 
    s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.nisn.includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Student List */}
      <div className="lg:col-span-1 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama atau NISN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
          />
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden max-h-[500px] overflow-y-auto">
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student) => (
              <button
                key={student.id}
                onClick={() => handleStudentSelect(student)}
                className={cn(
                  "w-full p-4 text-left transition-all border-b border-gray-50 last:border-none hover:bg-blue-50",
                  selectedStudent?.id === student.id ? "bg-blue-50 border-l-4 border-l-blue-600" : ""
                )}
              >
                <div className="font-bold text-gray-900">{student.fullName}</div>
                <div className="text-xs text-gray-500">NISN: {student.nisn}</div>
                <div className="text-xs text-blue-600 font-medium mt-1">{student.major}</div>
              </button>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500 text-sm">Tidak ada siswa ditemukan.</div>
          )}
        </div>
      </div>

      {/* Grades Form */}
      <div className="lg:col-span-2">
        {selectedStudent ? (
          <div className="bg-white border border-gray-100 rounded-3xl p-8 space-y-8 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedStudent.fullName}</h2>
                <p className="text-gray-500">Input Nilai Seleksi Masuk</p>
              </div>
              <div className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold">
                Rata-rata: {grades.average.toFixed(2)}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Matematika</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={grades.math}
                  onChange={(e) => handleGradeChange('math', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Bahasa Indonesia</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={grades.indonesian}
                  onChange={(e) => handleGradeChange('indonesian', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Bahasa Inggris</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={grades.english}
                  onChange={(e) => handleGradeChange('english', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">IPA</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={grades.science}
                  onChange={(e) => handleGradeChange('science', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            {status && (
              <div className={cn(
                "p-4 rounded-xl flex items-center space-x-3",
                status.type === 'success' ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
              )}>
                {status.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                <span className="text-sm font-medium">{status.message}</span>
              </div>
            )}

            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
              <span>Simpan Nilai</span>
            </button>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 p-12 text-center">
            <div className="bg-white p-4 rounded-full shadow-sm mb-4">
              <Users className="h-8 w-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Pilih Siswa</h3>
            <p className="text-gray-500 text-sm max-w-xs">Pilih siswa dari daftar di sebelah kiri untuk menginput atau memperbarui nilai mereka.</p>
          </div>
        )}
      </div>
    </div>
  );
}
