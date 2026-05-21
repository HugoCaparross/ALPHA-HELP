// Robust password validator satisfying the exact security rules:
// - Minimum 12 characters
// - At least one uppercase letter
// - At least one lowercase letter
// - At least one number
// - At least one special symbol
export function validatePasswordStrength(password) {
  const errors = [];
  if (password.length < 12) {
    errors.push('La contraseña debe tener al menos 12 caracteres.');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Debe contener al menos una mayúscula.');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Debe contener al menos una minúscula.');
  }
  if (!/\d/.test(password)) {
    errors.push('Debe contener al menos un número.');
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Debe contener al menos un símbolo especial.');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}
