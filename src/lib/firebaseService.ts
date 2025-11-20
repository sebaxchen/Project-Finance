// Servicio Firebase que reemplaza Supabase
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  QueryConstraint,
} from 'firebase/firestore';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  UserCredential,
} from 'firebase/auth';
import { db, auth } from './firebase';

// Mapeo de tablas de Supabase a colecciones de Firestore
const COLLECTIONS = {
  profiles: 'profiles',
  clients: 'clients',
  property_units: 'property_units',
  credit_simulations: 'credit_simulations',
  payment_schedules: 'payment_schedules',
};

// Convertir Firestore timestamp a string ISO
function convertTimestamp(data: any): any {
  if (!data) return data;
  if (data instanceof Timestamp) {
    return data.toDate().toISOString();
  }
  if (Array.isArray(data)) {
    return data.map(convertTimestamp);
  }
  if (typeof data === 'object') {
    const converted: any = {};
    for (const key in data) {
      if (data[key] instanceof Timestamp) {
        converted[key] = data[key].toDate().toISOString();
      } else if (typeof data[key] === 'object' && data[key] !== null) {
        converted[key] = convertTimestamp(data[key]);
      } else {
        converted[key] = data[key];
      }
    }
    return converted;
  }
  return data;
}

// Cliente de base de datos que simula Supabase
class FirebaseSupabaseClient {
  private collectionName: string = '';
  private filters: Array<{ column: string; value: any }> = [];
  private orderByClause?: { column: string; ascending: boolean };
  private selectColumns?: string;
  private countMode: boolean = false;
  private headMode: boolean = false;
  private lastInsertedItem: any = null;

  from(table: string) {
    this.collectionName = COLLECTIONS[table as keyof typeof COLLECTIONS] || table;
    this.filters = [];
    this.orderByClause = undefined;
    this.selectColumns = undefined;
    this.countMode = false;
    this.headMode = false;
    this.lastInsertedItem = null;
    return this;
  }

  select(columns?: string, options?: { count?: string; head?: boolean }) {
    this.selectColumns = columns;
    if (options?.count) {
      this.countMode = true;
    }
    if (options?.head) {
      this.headMode = true;
    }
    // Retornar un objeto que sea "thenable" para soportar await, pero también permita encadenar métodos
    const self = this;
    const thenable = {
      // Métodos de encadenamiento
      eq: (column: string, value: any) => {
        self.eq(column, value);
        return thenable;
      },
      order: (column: string, options?: { ascending?: boolean }) => {
        self.order(column, options);
        return thenable;
      },
      single: () => self.single(),
      maybeSingle: () => self.maybeSingle(),
      // Hacer el objeto "thenable" para soportar await
      then: (onFulfilled?: (value: any) => any, onRejected?: (reason: any) => any) => {
        return self.executeQuery().then(onFulfilled, onRejected);
      },
      catch: (onRejected?: (reason: any) => any) => {
        return self.executeQuery().catch(onRejected);
      },
    };
    return thenable as any;
  }

  eq(column: string, value: any) {
    this.filters.push({ column, value });
    return this;
  }

  order(column: string, options?: { ascending?: boolean }) {
    this.orderByClause = { column, ascending: options?.ascending !== false };
    return this;
  }

  insert(data: any) {
    // Retornar un objeto que permita encadenar .select() después de insert
    const self = this;
    const insertPromise = (async () => {
      try {
        // Convertir fechas a Timestamp si es necesario
        const dataToInsert: any = { ...data };
        const { id, ...dataWithoutId } = dataToInsert;
        
        if (!dataToInsert.created_at) {
          dataToInsert.created_at = Timestamp.now();
        }
        if (!dataToInsert.updated_at) {
          dataToInsert.updated_at = Timestamp.now();
        }

        let docRef;
        // Si se proporciona un ID, usar setDoc en lugar de addDoc
        if (id) {
          docRef = doc(db, self.collectionName, id);
          await setDoc(docRef, {
            ...dataWithoutId,
            created_at: dataToInsert.created_at,
            updated_at: dataToInsert.updated_at,
          });
        } else {
          docRef = await addDoc(collection(db, self.collectionName), {
            ...dataWithoutId,
            created_at: dataToInsert.created_at,
            updated_at: dataToInsert.updated_at,
          });
        }

        const newItem = {
          ...dataWithoutId,
          id: docRef.id,
          created_at: dataToInsert.created_at.toDate().toISOString(),
          updated_at: dataToInsert.updated_at.toDate().toISOString(),
        };

        self.lastInsertedItem = newItem;
        return { data: newItem, error: null };
      } catch (error: any) {
        return { data: null, error };
      }
    })();

    // Retornar un objeto que permita encadenar .select()
    return {
      then: (onFulfilled?: (value: any) => any, onRejected?: (reason: any) => any) => {
        return insertPromise.then(onFulfilled, onRejected);
      },
      catch: (onRejected?: (reason: any) => any) => {
        return insertPromise.catch(onRejected);
      },
      select: (columns?: string) => {
        // Después de insert, select() debería retornar el item insertado en un array
        return {
          then: (onFulfilled?: (value: any) => any, onRejected?: (reason: any) => any) => {
            return insertPromise.then((result) => {
              if (result.error) {
                return onRejected ? onRejected(result.error) : Promise.reject(result.error);
              }
              // Retornar como array para ser consistente con Supabase
              const selectResult = { data: result.data ? [result.data] : [], error: null };
              return onFulfilled ? onFulfilled(selectResult) : selectResult;
            }, onRejected);
          },
          catch: (onRejected?: (reason: any) => any) => {
            return insertPromise.catch(onRejected);
          },
          single: async () => {
            const result = await insertPromise;
            if (result.error) {
              return { data: null, error: result.error };
            }
            return { data: result.data, error: null };
          },
          maybeSingle: async () => {
            const result = await insertPromise;
            if (result.error) {
              return { data: null, error: result.error };
            }
            return { data: result.data || null, error: null };
          },
        };
      },
    } as any;
  }

  delete(id?: string) {
    const self = this;
    
    // Si se proporciona un ID directamente, ejecutar la eliminación inmediatamente
    if (id) {
      const deletePromise = (async () => {
        try {
          const docRef = doc(db, this.collectionName, id);
          await deleteDoc(docRef);
          return { data: null, error: null };
        } catch (error: any) {
          return { data: null, error };
        }
      })();

      return {
        then: (onFulfilled?: (value: any) => any, onRejected?: (reason: any) => any) => {
          return deletePromise.then(onFulfilled, onRejected);
        },
        catch: (onRejected?: (reason: any) => any) => {
          return deletePromise.catch(onRejected);
        },
      } as any;
    }

    // Si no se proporciona ID, permitir encadenar con .eq()
    const deleteThenable = {
      eq: (column: string, value: any) => {
        self.eq(column, value);
        const deletePromise = (async () => {
          try {
            // Buscar el filtro de ID
            const idFilter = self.filters.find(f => f.column === 'id');
            if (!idFilter) {
              throw new Error('No se proporcionó un ID para eliminar');
            }

            const docRef = doc(db, self.collectionName, idFilter.value);
            await deleteDoc(docRef);

            return { data: null, error: null };
          } catch (error: any) {
            return { data: null, error };
          }
        })();

        return {
          then: (onFulfilled?: (value: any) => any, onRejected?: (reason: any) => any) => {
            return deletePromise.then(onFulfilled, onRejected);
          },
          catch: (onRejected?: (reason: any) => any) => {
            return deletePromise.catch(onRejected);
          },
        };
      },
    };

    return deleteThenable as any;
  }

  async executeQuery() {
    try {
      // Si hay un item insertado recientemente y no hay filtros, retornar ese item
      if (this.lastInsertedItem && this.filters.length === 0) {
        const item = this.lastInsertedItem;
        this.lastInsertedItem = null;
        return { data: [item], error: null };
      }

      const collectionRef = collection(db, this.collectionName);
      const constraints: QueryConstraint[] = [];

      // Aplicar filtros
      this.filters.forEach((filter) => {
        constraints.push(where(filter.column, '==', filter.value));
      });

      // Si hay filtros Y ordenamiento, Firestore requiere un índice compuesto
      // Para evitar esto, aplicaremos el ordenamiento en memoria después de obtener los datos
      const needsInMemorySort = this.filters.length > 0 && this.orderByClause !== undefined;

      // Solo aplicar ordenamiento en Firestore si no hay filtros (o si no necesitamos ordenar en memoria)
      if (this.orderByClause && !needsInMemorySort) {
        constraints.push(
          orderBy(
            this.orderByClause.column,
            this.orderByClause.ascending ? 'asc' : 'desc'
          )
        );
      }

      // Si es modo count, necesitamos obtener todos los documentos
      if (this.countMode) {
        const q = query(collectionRef, ...constraints);
        const querySnapshot = await getDocs(q);
        return { count: querySnapshot.size, error: null };
      }

      // Si es head mode, limitar a 1
      if (this.headMode) {
        constraints.push(limit(1));
      }

      const q = query(collectionRef, ...constraints);
      const querySnapshot = await getDocs(q);

      let items = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...convertTimestamp(doc.data()),
      }));

      // Ordenar en memoria si es necesario (para evitar requerir índice compuesto)
      if (needsInMemorySort && this.orderByClause) {
        items.sort((a, b) => {
          const aValue = a[this.orderByClause!.column];
          const bValue = b[this.orderByClause!.column];
          
          // Manejar valores nulos/undefined
          if (aValue == null && bValue == null) return 0;
          if (aValue == null) return 1;
          if (bValue == null) return -1;
          
          // Comparar valores
          if (aValue < bValue) return this.orderByClause!.ascending ? -1 : 1;
          if (aValue > bValue) return this.orderByClause!.ascending ? 1 : -1;
          return 0;
        });
      }

      // Manejar relaciones (ej: clients (full_name, document_number))
      if (this.selectColumns && this.selectColumns.includes('(')) {
        items = await this.loadRelations(items);
      }

      return { data: items, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  }

  private async loadRelations(items: any[]): Promise<any[]> {
    const relations = this.selectColumns!.match(/(\w+)\s*\(([^)]+)\)/g);
    if (!relations) return items;

    const results = await Promise.all(
      items.map(async (item) => {
        const result: any = { ...item };
        for (const rel of relations) {
          const match = rel.match(/(\w+)\s*\(([^)]+)\)/);
          if (match) {
            const tableName = match[1];
            const columns = match[2].split(',').map((c) => c.trim());
            const collectionName =
              COLLECTIONS[tableName as keyof typeof COLLECTIONS] || tableName;

            let relatedId: string | null = null;
            if (tableName === 'clients' && item.client_id) {
              relatedId = item.client_id;
            } else if (tableName === 'property_units' && item.property_id) {
              relatedId = item.property_id;
            }

            if (relatedId) {
              try {
                const docRef = doc(db, collectionName, relatedId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                  const relatedData: any = {};
                  const data = convertTimestamp(docSnap.data());
                  columns.forEach((col) => {
                    relatedData[col] = data[col];
                  });
                  result[tableName] = relatedData;
                }
              } catch (error) {
                console.error(`Error loading relation ${tableName}:`, error);
              }
            }
          }
        }
        return result;
      })
    );

    return results;
  }

  async single() {
    const result = await this.executeQuery();
    if (result.data && result.data.length > 0) {
      return { data: result.data[0], error: null };
    }
    return { data: null, error: { message: 'No rows found' } };
  }

  async maybeSingle() {
    const result = await this.executeQuery();
    return { data: result.data?.[0] || null, error: null };
  }
}

// Cliente de autenticación que simula Supabase Auth
class FirebaseAuthClient {
  async getSession() {
    return new Promise<{ data: { session: any }; error: null }>(async (resolve) => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        unsubscribe();
        if (user) {
          const token = await user.getIdToken().catch(() => '');
          const session = {
            user: {
              id: user.uid,
              email: user.email || '',
              created_at: user.metadata.creationTime || new Date().toISOString(),
            },
            access_token: token,
          };
          resolve({ data: { session }, error: null });
        } else {
          resolve({ data: { session: null }, error: null });
        }
      });
    });
  }

  async signInWithPassword(credentials: { email: string; password: string }) {
    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );
      const token = await userCredential.user.getIdToken();
      const session = {
        user: {
          id: userCredential.user.uid,
          email: userCredential.user.email || '',
          created_at: userCredential.user.metadata.creationTime || new Date().toISOString(),
        },
        access_token: token,
      };
      return { data: { session, user: session.user }, error: null };
    } catch (error: any) {
      // Mapear códigos de error de Firebase a mensajes más amigables
      let errorMessage = 'Error al iniciar sesión';
      const errorCode = error.code || '';
      
      if (errorCode === 'auth/user-not-found' || errorCode === 'auth/wrong-password') {
        errorMessage = 'Correo o contraseña incorrectos';
      } else if (errorCode === 'auth/invalid-email') {
        errorMessage = 'Correo electrónico inválido';
      } else if (errorCode === 'auth/too-many-requests') {
        errorMessage = 'Demasiados intentos fallidos. Intenta más tarde';
      } else if (errorCode === 'auth/network-request-failed') {
        errorMessage = 'Error de conexión. Verifica tu internet';
      } else if (errorCode === 'auth/user-disabled') {
        errorMessage = 'Esta cuenta ha sido deshabilitada';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return {
        data: null,
        error: { message: errorMessage, code: errorCode },
      };
    }
  }

  async signUp(credentials: { email: string; password: string }) {
    try {
      const userCredential: UserCredential = await createUserWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );
      const token = await userCredential.user.getIdToken();
      const session = {
        user: {
          id: userCredential.user.uid,
          email: userCredential.user.email || '',
          created_at: userCredential.user.metadata.creationTime || new Date().toISOString(),
        },
        access_token: token,
      };
      return { data: { user: session.user, session }, error: null };
    } catch (error: any) {
      // Mapear códigos de error de Firebase a mensajes más amigables
      let errorMessage = 'Error al registrar usuario';
      const errorCode = error.code || '';
      
      if (errorCode === 'auth/email-already-in-use') {
        errorMessage = 'Este correo electrónico ya está registrado';
      } else if (errorCode === 'auth/invalid-email') {
        errorMessage = 'Correo electrónico inválido';
      } else if (errorCode === 'auth/weak-password') {
        errorMessage = 'La contraseña es muy débil. Usa al menos 6 caracteres';
      } else if (errorCode === 'auth/network-request-failed') {
        errorMessage = 'Error de conexión. Verifica tu internet';
      } else if (errorCode === 'auth/operation-not-allowed') {
        errorMessage = 'El registro con email/password no está habilitado';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return {
        data: null,
        error: { message: errorMessage, code: errorCode },
      };
    }
  }

  async signOut() {
    try {
      await firebaseSignOut(auth);
      return { error: null };
    } catch (error: any) {
      return { error: { message: error.message } };
    }
  }

  onAuthStateChange(callback: (event: string, session: any) => void) {
    let isInitial = true;
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken().catch(() => '');
        const session = {
          user: {
            id: user.uid,
            email: user.email || '',
            created_at: user.metadata.creationTime || new Date().toISOString(),
          },
          access_token: token,
        };
        callback(isInitial ? 'INITIAL_SESSION' : 'SIGNED_IN', session);
      } else {
        callback(isInitial ? 'INITIAL_SESSION' : 'SIGNED_OUT', null);
      }
      isInitial = false;
    });

    return {
      data: {
        subscription: {
          unsubscribe,
        },
      },
    };
  }
}

// Cliente principal que simula Supabase
export class FirebaseSupabase {
  auth: FirebaseAuthClient;

  constructor() {
    this.auth = new FirebaseAuthClient();
  }

  from(table: string) {
    const client = new FirebaseSupabaseClient();
    return client.from(table);
  }
}

