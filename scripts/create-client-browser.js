// Script para ejecutar en la consola del navegador
// Copia y pega este código en la consola del navegador cuando estés en la aplicación

// Datos del cliente de ejemplo
const sampleClient = {
  document_type: 'DNI',
  document_number: '12345678',
  full_name: 'Juan Pérez García',
  email: 'juan.perez@example.com',
  phone: '987654321',
  marital_status: 'married',
  dependents: 2,
  monthly_income: 5000,
};

// Función para crear el cliente
async function createSampleClient() {
  try {
    // Importar el servicio de supabase (que usa Firebase)
    const { supabase } = await import('/src/lib/supabase.ts');
    
    // Obtener el usuario actual del contexto de autenticación
    // Necesitarás estar autenticado en la aplicación
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session || !session.user) {
      console.error('❌ Debes estar autenticado para crear un cliente');
      return;
    }
    
    console.log('🚀 Creando cliente de ejemplo...');
    console.log('Usuario:', session.user.email);
    
    const { data, error } = await supabase.from('clients').insert({
      ...sampleClient,
      user_id: session.user.id,
    });
    
    if (error) {
      console.error('❌ Error:', error.message);
      return;
    }
    
    console.log('✅ ¡Cliente creado exitosamente!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 Detalles del cliente:');
    console.log('   Nombre:', sampleClient.full_name);
    console.log('   Documento:', `${sampleClient.document_type} ${sampleClient.document_number}`);
    console.log('   Email:', sampleClient.email);
    console.log('   Teléfono:', sampleClient.phone);
    console.log('   Ingreso Mensual: S/', sampleClient.monthly_income.toLocaleString('es-PE'));
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Recargar la página para ver el nuevo cliente
    console.log('🔄 Recargando página...');
    setTimeout(() => window.location.reload(), 1000);
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Ejecutar la función
createSampleClient();

