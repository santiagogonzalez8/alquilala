// Lista de emails de administradores
export const ADMIN_EMAILS = [
  'gosanti2000@gmail.com'
];

// Función para verificar si un email es admin
export const isAdmin = (email) => {
  return ADMIN_EMAILS.includes(email?.toLowerCase());
};