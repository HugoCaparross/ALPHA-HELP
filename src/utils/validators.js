// src/utils/validators.js


// ======================================================
// EMAIL
// ======================================================

export function validateEmail(email = '') {
  const regex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return regex.test(email.trim());
}


// ======================================================
// PASSWORD
// ======================================================

export function validatePassword(password = '') {

  // Mínimo:
  // - 8 caracteres
  // - 1 mayúscula
  // - 1 número

  const regex =
    /^(?=.*[A-Z])(?=.*\d).{8,}$/;

  return regex.test(password);
}


// ======================================================
// REQUIRED
// ======================================================

export function validateRequired(value = '') {
  return value.trim().length > 0;
}


// ======================================================
// NAME
// ======================================================

export function validateName(name = '') {

  const regex =
    /^[A-Za-zÀ-ÿ\s'-]{2,50}$/;

  return regex.test(name.trim());
}


// ======================================================
// FULL NAME
// ======================================================

export function validateFullName(name = '') {

  const parts = name
    .trim()
    .split(' ')
    .filter(Boolean);

  return parts.length >= 2;
}


// ======================================================
// URL
// ======================================================

export function validateUrl(url = '') {

  try {
    new URL(url);
    return true;

  } catch {
    return false;
  }
}


// ======================================================
// YOUTUBE URL
// ======================================================

export function validateYoutubeUrl(url = '') {

  const regex =
    /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;

  return regex.test(url);
}


// ======================================================
// VIMEO URL
// ======================================================

export function validateVimeoUrl(url = '') {

  const regex =
    /^(https?:\/\/)?(www\.)?vimeo\.com\/.+$/;

  return regex.test(url);
}


// ======================================================
// PHONE
// ======================================================

export function validatePhone(phone = '') {

  const regex =
    /^[+]?[\d\s()-]{7,20}$/;

  return regex.test(phone.trim());
}


// ======================================================
// STRONG PASSWORD SCORE
// ======================================================

export function getPasswordStrength(password = '') {

  let score = 0;

  if (password.length >= 8) score++;

  if (/[A-Z]/.test(password)) score++;

  if (/[a-z]/.test(password)) score++;

  if (/\d/.test(password)) score++;

  if (/[^A-Za-z0-9]/.test(password)) score++;

  switch (score) {

    case 0:
    case 1:
      return {
        score,
        label: 'Muy débil'
      };

    case 2:
      return {
        score,
        label: 'Débil'
      };

    case 3:
      return {
        score,
        label: 'Media'
      };

    case 4:
      return {
        score,
        label: 'Fuerte'
      };

    case 5:
      return {
        score,
        label: 'Muy fuerte'
      };

    default:
      return {
        score: 0,
        label: 'Muy débil'
      };
  }
}


// ======================================================
// MATCH PASSWORDS
// ======================================================

export function validatePasswordsMatch(
  password,
  confirmPassword
) {
  return password === confirmPassword;
}


// ======================================================
// FILE SIZE
// ======================================================

export function validateFileSize(
  file,
  maxSizeMB = 5
) {

  if (!file) return false;

  const maxSize =
    maxSizeMB * 1024 * 1024;

  return file.size <= maxSize;
}


// ======================================================
// FILE TYPE
// ======================================================

export function validateFileType(
  file,
  allowedTypes = []
) {

  if (!file) return false;

  return allowedTypes.includes(file.type);
}


// ======================================================
// IMAGE FILE
// ======================================================

export function validateImageFile(file) {

  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/svg+xml'
  ];

  return (
    validateFileType(file, allowedTypes) &&
    validateFileSize(file, 3)
  );
}


// ======================================================
// PDF FILE
// ======================================================

export function validatePdfFile(file) {

  return (
    validateFileType(file, ['application/pdf']) &&
    validateFileSize(file, 20)
  );
}


// ======================================================
// TEXT LENGTH
// ======================================================

export function validateMinLength(
  text = '',
  min = 1
) {
  return text.trim().length >= min;
}

export function validateMaxLength(
  text = '',
  max = 255
) {
  return text.trim().length <= max;
}


// ======================================================
// SESSION TITLE
// ======================================================

export function validateSessionTitle(title = '') {

  return (
    validateRequired(title) &&
    validateMinLength(title, 5) &&
    validateMaxLength(title, 120)
  );
}


// ======================================================
// DESCRIPTION
// ======================================================

export function validateDescription(
  description = ''
) {

  return (
    validateRequired(description) &&
    validateMinLength(description, 10) &&
    validateMaxLength(description, 5000)
  );
}


// ======================================================
// REGION
// ======================================================

export function validateRegion(region = '') {

  const allowedRegions = [
    'ES',
    'LATAM'
  ];

  return allowedRegions.includes(region);
}


// ======================================================
// ANNOUNCEMENT TYPE
// ======================================================

export function validateAnnouncementType(
  type = ''
) {

  const allowedTypes = [
    'info',
    'warning',
    'success'
  ];

  return allowedTypes.includes(type);
}


// ======================================================
// SANITIZE INPUT
// ======================================================

export function sanitizeInput(value = '') {

  return value
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .trim();
}


// ======================================================
// FORM SANITIZATION
// ======================================================

export function sanitizeFormData(data = {}) {

  const sanitized = {};

  Object.keys(data).forEach(key => {

    const value = data[key];

    sanitized[key] =
      typeof value === 'string'
        ? sanitizeInput(value)
        : value;
  });

  return sanitized;
}