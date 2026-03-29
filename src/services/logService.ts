import { collection, addDoc, serverTimestamp, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

export interface SystemLog {
  id?: string;
  action: string;
  user: string;
  details: string;
  timestamp: any;
  type: 'info' | 'warning' | 'error' | 'success';
}

export const logAction = async (action: string, user: string, details: string, type: SystemLog['type'] = 'info') => {
  try {
    await addDoc(collection(db, 'system_logs'), {
      action,
      user,
      details,
      type,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error logging action:', error);
  }
};

export const subscribeToLogs = (callback: (logs: SystemLog[]) => void) => {
  const q = query(collection(db, 'system_logs'), orderBy('timestamp', 'desc'), limit(50));
  return onSnapshot(q, (snapshot) => {
    const logs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as SystemLog[];
    callback(logs);
  });
};
