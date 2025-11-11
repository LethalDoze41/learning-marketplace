import { auth, db } from './config/firebase';
import { collection, getDocs } from 'firebase/firestore';

async function testConnection() {
  try {
    // Test Firestore connection
    const querySnapshot = await getDocs(collection(db, 'courses'));
    console.log('✅ Firestore connected! Courses count:', querySnapshot.size);
    
    // Test Auth
    console.log('✅ Auth initialized:', auth.app.name);
    
  } catch (error) {
    console.error('❌ Firebase connection error:', error);
  }
}

testConnection();