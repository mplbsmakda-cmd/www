import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import { auth, googleProvider, db } from '../firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { cn } from '../lib/utils';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAdmin } = useAuth();
  const location = useLocation();

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const userRef = doc(db, 'users', result.user.uid);
      const docSnap = await getDoc(userRef);

      if (!docSnap.exists()) {
        await setDoc(userRef, {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          role: result.user.email === 'mplbsmakda@gmail.com' ? 'admin' : 'user',
          createdAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navLinks = [
    { name: 'Beranda', path: '/' },
    { name: 'Tentang Kami', path: '/about' },
    { name: 'Jurusan', path: '/majors' },
    { name: 'Berita', path: '/news' },
    { name: 'PPDB', path: '/registration' },
    { name: 'Kontak', path: '/contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="https://ik.imagekit.io/zco6tu2vm/IMG-20251202-WA0110-removebg-preview.png?updatedAt=1773626170559" 
              alt="Logo SMK LPPMRI 2 KEDUNGREJA" 
              className="h-10 w-auto"
              referrerPolicy="no-referrer"
            />
            <span className="font-bold text-xl tracking-tight text-gray-900">SMK LPPMRI 2 KEDUNGREJA</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-blue-600",
                  location.pathname === link.path ? "text-blue-600" : "text-gray-600"
                )}
              >
                {link.name}
              </Link>
            ))}
            
            {isAdmin ? (
              <Link
                to="/admin"
                className={cn(
                  "inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                  location.pathname === '/admin' ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                )}
              >
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Admin
              </Link>
            ) : user && (
              <Link
                to="/dashboard"
                className={cn(
                  "inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                  location.pathname === '/dashboard' ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                )}
              >
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
            )}

            {user ? (
              <div className="flex items-center space-x-4">
                <img src={user.photoURL || ''} alt={user.displayName || ''} className="h-8 w-8 rounded-full border" />
                <button onClick={handleLogout} className="text-sm font-medium text-gray-600 hover:text-red-600">
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "block px-3 py-2 rounded-md text-base font-medium",
                    location.pathname === link.path ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"
                  )}
                >
                  {link.name}
                </Link>
              ))}
              
              {isAdmin ? (
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "block px-3 py-2 rounded-md text-base font-medium",
                    location.pathname === '/admin' ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"
                  )}
                >
                  Dashboard Admin
                </Link>
              ) : user && (
                <Link
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "block px-3 py-2 rounded-md text-base font-medium",
                    location.pathname === '/dashboard' ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"
                  )}
                >
                  Dashboard Siswa
                </Link>
              )}

              <div className="pt-4 border-t border-gray-100">
                {user ? (
                  <div className="flex items-center justify-between px-3">
                    <div className="flex items-center space-x-3">
                      <img src={user.photoURL || ''} alt={user.displayName || ''} className="h-10 w-10 rounded-full" />
                      <span className="text-sm font-medium text-gray-900">{user.displayName}</span>
                    </div>
                    <button onClick={handleLogout} className="text-gray-600 hover:text-red-600">
                      Keluar
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleLogin}
                    className="w-full text-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Login
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
