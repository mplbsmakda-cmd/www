import { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { UserProfile } from '../types';

export function useAuth() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (!firebaseUser) {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (user) {
      const unsubscribeProfile = onSnapshot(doc(db, 'users', user.uid), (docSnap) => {
        if (docSnap.exists()) {
          setProfile(docSnap.data() as UserProfile);
        } else {
          // If profile doesn't exist, it might be a new user
          // We don't create it here to avoid infinite loops or permission issues
          // But we can infer basic info if needed
          setProfile(null);
        }
        setLoading(false);
      }, (error) => {
        console.error("Error fetching profile:", error);
        setLoading(false);
      });
      return () => unsubscribeProfile();
    }
  }, [user]);

  const isAdmin = profile?.role === 'admin' || (user?.email === 'mplbsmakda@gmail.com' && user?.emailVerified);
  const isMajorAdmin = profile?.role === 'major_admin';
  const majorId = profile?.majorId;

  return { user, profile, isAdmin, isMajorAdmin, majorId, loading };
}
