// Servicio de almacenamiento local que reemplaza Supabase
// Todos los datos se guardan en localStorage

// Tipos básicos
interface LocalUser {
  id: string;
  email: string;
  created_at: string;
}

interface LocalSession {
  user: LocalUser;
  access_token: string;
}

// Almacenamiento de datos
const STORAGE_KEYS = {
  USERS: 'homecredit_users',
  PROFILES: 'homecredit_profiles',
  CLIENTS: 'homecredit_clients',
  PROPERTIES: 'homecredit_properties',
  SIMULATIONS: 'homecredit_simulations',
  SCHEDULES: 'homecredit_schedules',
  SESSION: 'homecredit_session',
};

// Utilidades para localStorage
function getItem<T>(key: string, defaultValue: T[] = []): T[] {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving to localStorage:`, error);
  }
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Cliente de base de datos local que simula Supabase
class LocalSupabaseClient {
  private table: string = '';
  private filters: Array<{ column: string; value: any }> = [];
  private orderBy?: { column: string; ascending: boolean };
  private selectColumns?: string;
  private countMode: boolean = false;
  private headMode: boolean = false;
  private lastInsertedItem: any = null;

  from(table: string) {
    this.table = table;
    this.filters = [];
    this.orderBy = undefined;
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
    return this;
  }

  eq(column: string, value: any) {
    this.filters.push({ column, value });
    return this;
  }

  order(column: string, options?: { ascending?: boolean }) {
    this.orderBy = { column, ascending: options?.ascending !== false };
    return this;
  }

  async insert(data: any) {
    const items = getItem<any>(this.getStorageKey(), []);
    const newItem = {
      ...data,
      id: data.id || generateId(),
      created_at: data.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    items.push(newItem);
    setItem(this.getStorageKey(), items);
    
    // Si se llama select() después, guardar el item insertado para retornarlo
    this.lastInsertedItem = newItem;
    
    return { data: newItem, error: null };
  }

  async select() {
    // Si hay un item insertado recientemente y no hay filtros, retornar ese item
    if (this.lastInsertedItem && this.filters.length === 0) {
      const item = this.lastInsertedItem;
      this.lastInsertedItem = null;
      return { data: [item], error: null };
    }
    
    let items = getItem<any>(this.getStorageKey(), []);

    // Aplicar filtros
    this.filters.forEach((filter) => {
      items = items.filter((item: any) => item[filter.column] === filter.value);
    });

    // Si es modo count, retornar solo el conteo
    if (this.countMode) {
      return { count: items.length, error: null };
    }

    // Aplicar ordenamiento
    if (this.orderBy) {
      items.sort((a: any, b: any) => {
        const aVal = a[this.orderBy!.column];
        const bVal = b[this.orderBy!.column];
        if (this.orderBy!.ascending) {
          return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
        } else {
          return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
        }
      });
    }

    // Manejar relaciones (ej: clients (full_name, document_number))
    if (this.selectColumns && this.selectColumns.includes('(')) {
      const relations = this.selectColumns.match(/(\w+)\s*\(([^)]+)\)/g);
      if (relations) {
        items = items.map((item: any) => {
          const result: any = { ...item };
          relations.forEach((rel) => {
            const match = rel.match(/(\w+)\s*\(([^)]+)\)/);
            if (match) {
              const tableName = match[1];
              const columns = match[2].split(',').map((c) => c.trim());
              const relatedItems = getItem<any>(this.getRelatedStorageKey(tableName), []);
              const relatedItem = relatedItems.find((r: any) => {
                // Buscar por foreign key común
                if (tableName === 'clients' && item.client_id) {
                  return r.id === item.client_id;
                }
                if (tableName === 'property_units' && item.property_id) {
                  return r.id === item.property_id;
                }
                return false;
              });
              if (relatedItem) {
                const relatedData: any = {};
                columns.forEach((col) => {
                  relatedData[col] = relatedItem[col];
                });
                result[tableName] = relatedData;
              }
            }
          });
          return result;
        });
      }
    }

    return { data: items, error: null };
  }

  async single() {
    const result = await this.select();
    if (result.data && result.data.length > 0) {
      return { data: result.data[0], error: null };
    }
    return { data: null, error: { message: 'No rows found' } };
  }

  async maybeSingle() {
    const result = await this.select();
    return { data: result.data?.[0] || null, error: null };
  }

  private getStorageKey(): string {
    const keyMap: Record<string, string> = {
      profiles: STORAGE_KEYS.PROFILES,
      clients: STORAGE_KEYS.CLIENTS,
      property_units: STORAGE_KEYS.PROPERTIES,
      credit_simulations: STORAGE_KEYS.SIMULATIONS,
      payment_schedules: STORAGE_KEYS.SCHEDULES,
    };
    return keyMap[this.table] || `homecredit_${this.table}`;
  }

  private getRelatedStorageKey(tableName: string): string {
    const keyMap: Record<string, string> = {
      profiles: STORAGE_KEYS.PROFILES,
      clients: STORAGE_KEYS.CLIENTS,
      property_units: STORAGE_KEYS.PROPERTIES,
      credit_simulations: STORAGE_KEYS.SIMULATIONS,
      payment_schedules: STORAGE_KEYS.SCHEDULES,
    };
    return keyMap[tableName] || `homecredit_${tableName}`;
  }
}

// Cliente de autenticación local
class LocalAuthClient {
  async getSession() {
    const session = getItem<LocalSession>(STORAGE_KEYS.SESSION, [])[0];
    return {
      data: {
        session: session || null,
      },
      error: null,
    };
  }

  async signInWithPassword(credentials: { email: string; password: string }) {
    const users = getItem<LocalUser & { password: string }>(STORAGE_KEYS.USERS, []);
    const user = users.find((u) => u.email === credentials.email);

    if (!user || user.password !== credentials.password) {
      return {
        data: null,
        error: { message: 'Email o contraseña incorrectos' },
      };
    }

    const session: LocalSession = {
      user: {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
      },
      access_token: `token-${user.id}`,
    };

    setItem(STORAGE_KEYS.SESSION, [session]);
    return { data: { session, user: session.user }, error: null };
  }

  async signUp(credentials: { email: string; password: string }) {
    const users = getItem<LocalUser & { password: string }>(STORAGE_KEYS.USERS, []);
    
    if (users.find((u) => u.email === credentials.email)) {
      return {
        data: null,
        error: { message: 'El email ya está registrado' },
      };
    }

    const newUser: LocalUser & { password: string } = {
      id: generateId(),
      email: credentials.email,
      password: credentials.password,
      created_at: new Date().toISOString(),
    };

    users.push(newUser);
    setItem(STORAGE_KEYS.USERS, users);

    const session: LocalSession = {
      user: {
        id: newUser.id,
        email: newUser.email,
        created_at: newUser.created_at,
      },
      access_token: `token-${newUser.id}`,
    };

    setItem(STORAGE_KEYS.SESSION, [session]);
    return {
      data: { user: session.user, session },
      error: null,
    };
  }

  async signOut() {
    setItem(STORAGE_KEYS.SESSION, []);
    return { error: null };
  }

  onAuthStateChange(callback: (event: string, session: any) => void) {
    // Simular cambio de estado de autenticación
    this.getSession().then(({ data }) => {
      callback('INITIAL_SESSION', data.session);
    });

    // También escuchar cambios en localStorage para detectar cambios de sesión
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.SESSION) {
        this.getSession().then(({ data }) => {
          callback('SIGNED_IN', data.session);
        });
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return {
      data: {
        subscription: {
          unsubscribe: () => {
            window.removeEventListener('storage', handleStorageChange);
          },
        },
      },
    };
  }
}

// Cliente principal que simula Supabase
export class LocalSupabase {
  auth: LocalAuthClient;
  
  constructor() {
    this.auth = new LocalAuthClient();
  }

  from(table: string) {
    const client = new LocalSupabaseClient();
    return client.from(table);
  }
}
