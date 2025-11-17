// Script para crear un cliente de ejemplo en Firebase
// Este script crea un usuario de prueba y luego un cliente asociado
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Timestamp, getDocs, query, limit } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

// Configuración de Firebase (misma que en firebase.ts)
const firebaseConfig = {
  apiKey: 'AIzaSyBw9UZyZw02mqG8dX6lxG92pcuqsWTx_eY',
  authDomain: 'homecredit-1bac5.firebaseapp.com',
  projectId: 'homecredit-1bac5',
  storageBucket: 'homecredit-1bac5.firebasestorage.app',
  messagingSenderId: '963462956758',
  appId: '1:963462956758:web:deed9d5eba44bf3debab77',
  measurementId: 'G-7W678CJF14',
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Datos del usuario de prueba
const testUserEmail = 'test-agent@example.com';
const testUserPassword = 'test123456';
const testUserName = 'Agente de Prueba';

// Datos del cliente de ejemplo
const sampleClient = {
  document_type: 'DNI' as const,
  document_number: '12345678',
  full_name: 'Juan Pérez García',
  email: 'juan.perez@example.com',
  phone: '987654321',
  marital_status: 'married' as const,
  dependents: 2,
  monthly_income: 5000,
  created_at: Timestamp.now(),
  updated_at: Timestamp.now(),
};

async function getOrCreateTestUser() {
  try {
    // Primero intentar crear el usuario (si ya existe, fallará y lo intentaremos iniciar sesión)
    try {
      console.log('Intentando crear usuario de prueba...');
      const userCredential = await createUserWithEmailAndPassword(auth, testUserEmail, testUserPassword);
      console.log('✅ Usuario de prueba creado:', userCredential.user.uid);
      
      // Crear perfil
      await addDoc(collection(db, 'profiles'), {
        id: userCredential.user.uid,
        email: testUserEmail,
        full_name: testUserName,
        role: 'advisor',
        created_at: Timestamp.now(),
        updated_at: Timestamp.now(),
      });
      console.log('✅ Perfil creado para el usuario de prueba');
      
      return userCredential.user.uid;
    } catch (createError: any) {
      // Si el usuario ya existe, intentar iniciar sesión
      if (createError.code === 'auth/email-already-in-use') {
        console.log('Usuario ya existe, iniciando sesión...');
        try {
          const userCredential = await signInWithEmailAndPassword(auth, testUserEmail, testUserPassword);
          console.log('✅ Sesión iniciada con usuario existente:', userCredential.user.uid);
          
          // Verificar si existe el perfil
          const profilesQuery = query(
            collection(db, 'profiles'),
            limit(1)
          );
          const profilesSnapshot = await getDocs(profilesQuery);
          
          // Buscar el perfil del usuario actual
          let profileExists = false;
          profilesSnapshot.forEach((doc) => {
            if (doc.id === userCredential.user.uid || doc.data().id === userCredential.user.uid) {
              profileExists = true;
            }
          });
          
          if (!profileExists) {
            // Crear perfil si no existe
            await addDoc(collection(db, 'profiles'), {
              id: userCredential.user.uid,
              email: testUserEmail,
              full_name: testUserName,
              role: 'advisor',
              created_at: Timestamp.now(),
              updated_at: Timestamp.now(),
            });
            console.log('✅ Perfil creado para el usuario de prueba');
          }
          
          return userCredential.user.uid;
        } catch (signInError: any) {
          console.error('❌ Error al iniciar sesión:', signInError.message);
          throw signInError;
        }
      } else {
        throw createError;
      }
    }
  } catch (error: any) {
    console.error('❌ Error al obtener/crear usuario:', error.message);
    console.error('   Código:', error.code);
    throw error;
  }
}

async function createSampleClient() {
  try {
    console.log('🚀 Iniciando creación de cliente de ejemplo...\n');
    
    // Obtener o crear usuario de prueba
    const userId = await getOrCreateTestUser();
    
    // Crear cliente asociado al usuario
    console.log('\n📝 Creando cliente de ejemplo...');
    const clientData = {
      ...sampleClient,
      user_id: userId,
    };
    
    const docRef = await addDoc(collection(db, 'clients'), clientData);
    
    console.log('\n✅ ¡Cliente creado exitosamente!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 Detalles del cliente:');
    console.log('   ID:', docRef.id);
    console.log('   Nombre:', sampleClient.full_name);
    console.log('   Documento:', `${sampleClient.document_type} ${sampleClient.document_number}`);
    console.log('   Email:', sampleClient.email);
    console.log('   Teléfono:', sampleClient.phone);
    console.log('   Ingreso Mensual: S/', sampleClient.monthly_income.toLocaleString('es-PE'));
    console.log('   Estado Civil:', sampleClient.marital_status);
    console.log('   Dependientes:', sampleClient.dependents);
    console.log('   Usuario asociado:', userId);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    process.exit(0);
  } catch (error: any) {
    console.error('\n❌ Error al crear el cliente:', error.message);
    console.error('   Código:', error.code);
    process.exit(1);
  }
}

createSampleClient();

