// src/components/forms.js

import {
  validateEmail,
  validatePassword,
  validateRequired,
  validateName
} from '../utils/validators.js';

import { showToast } from './ui.js';


// ======================================================
// HELPERS
// ======================================================

function setFieldError(input, message) {
  const formGroup = input.closest('.form-group');

  if (!formGroup) return;

  formGroup.classList.add('has-error');

  let errorElement = formGroup.querySelector('.form-error');

  if (!errorElement) {
    errorElement = document.createElement('span');
    errorElement.className = 'form-error';
    formGroup.appendChild(errorElement);
  }

  errorElement.textContent = message;
}

function clearFieldError(input) {
  const formGroup = input.closest('.form-group');

  if (!formGroup) return;

  formGroup.classList.remove('has-error');

  const errorElement = formGroup.querySelector('.form-error');

  if (errorElement) {
    errorElement.textContent = '';
  }
}

function clearFormErrors(form) {
  const errors = form.querySelectorAll('.form-error');

  errors.forEach(error => {
    error.textContent = '';
  });

  const groups = form.querySelectorAll('.has-error');

  groups.forEach(group => {
    group.classList.remove('has-error');
  });
}


// ======================================================
// REALTIME VALIDATION
// ======================================================

export function enableRealtimeValidation(form) {
  const inputs = form.querySelectorAll('input, textarea, select');

  inputs.forEach(input => {
    input.addEventListener('input', () => {
      validateInput(input);
    });

    input.addEventListener('blur', () => {
      validateInput(input);
    });
  });
}


// ======================================================
// VALIDATE SINGLE INPUT
// ======================================================

export function validateInput(input) {
  const value = input.value.trim();
  const type = input.dataset.validate;

  clearFieldError(input);

  switch (type) {
    case 'required':
      if (!validateRequired(value)) {
        setFieldError(input, 'Este campo es obligatorio');
        return false;
      }
      break;

    case 'email':
      if (!validateEmail(value)) {
        setFieldError(input, 'Introduce un email válido');
        return false;
      }
      break;

    case 'password':
      if (!validatePassword(value)) {
        setFieldError(
          input,
          'La contraseña debe tener mínimo 8 caracteres, mayúscula y número'
        );
        return false;
      }
      break;

    case 'name':
      if (!validateName(value)) {
        setFieldError(input, 'Nombre no válido');
        return false;
      }
      break;

    default:
      break;
  }

  return true;
}


// ======================================================
// VALIDATE COMPLETE FORM
// ======================================================

export function validateForm(form) {
  clearFormErrors(form);

  let isValid = true;

  const inputs = form.querySelectorAll('[data-validate]');

  inputs.forEach(input => {
    const valid = validateInput(input);

    if (!valid) {
      isValid = false;
    }
  });

  return isValid;
}


// ======================================================
// SERIALIZE FORM
// ======================================================

export function serializeForm(form) {
  const formData = new FormData(form);

  return Object.fromEntries(formData.entries());
}


// ======================================================
// HANDLE SUBMIT
// ======================================================

export function handleFormSubmit(form, callback) {
  if (!form) return;

  enableRealtimeValidation(form);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const submitButton = form.querySelector(
      'button[type="submit"]'
    );

    try {
      submitButton?.setAttribute('disabled', true);

      const isValid = validateForm(form);

      if (!isValid) {
        showToast('error', 'Revisa los campos del formulario');
        return;
      }

      const data = serializeForm(form);

      await callback(data, form);

    } catch (error) {
      console.error(error);

      showToast(
        'error',
        error.message || 'Ha ocurrido un error'
      );

    } finally {
      submitButton?.removeAttribute('disabled');
    }
  });
}


// ======================================================
// PASSWORD TOGGLE
// ======================================================

export function initPasswordToggles() {
  const toggles = document.querySelectorAll(
    '[data-password-toggle]'
  );

  toggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const targetId = toggle.dataset.passwordToggle;

      const input = document.getElementById(targetId);

      if (!input) return;

      const isPassword = input.type === 'password';

      input.type = isPassword ? 'text' : 'password';

      toggle.classList.toggle('is-visible', isPassword);
    });
  });
}


// ======================================================
// RESET FORM
// ======================================================

export function resetForm(form) {
  form.reset();
  clearFormErrors(form);
}


// ======================================================
// CHECKBOX VALIDATION
// ======================================================

export function validateCheckbox(
  checkbox,
  message = 'Debes aceptar este campo'
) {
  clearFieldError(checkbox);

  if (!checkbox.checked) {
    setFieldError(checkbox, message);
    return false;
  }

  return true;
}


// ======================================================
// LOGIN FORM
// ======================================================

export function initLoginForm(onSubmit) {
  const form = document.getElementById('login-form');

  if (!form) return;

  handleFormSubmit(form, onSubmit);
}


// ======================================================
// REGISTER FORM
// ======================================================

export function initRegisterForm(onSubmit) {
  const form = document.getElementById('register-form');

  if (!form) return;

  handleFormSubmit(form, async (data, currentForm) => {

    const privacy = currentForm.querySelector(
      '#accept-privacy'
    );

    const terms = currentForm.querySelector(
      '#accept-terms'
    );

    const gdpr = currentForm.querySelector(
      '#accept-gdpr'
    );

    const validPrivacy = validateCheckbox(
      privacy,
      'Debes aceptar la política de privacidad'
    );

    const validTerms = validateCheckbox(
      terms,
      'Debes aceptar los términos y condiciones'
    );

    const validGdpr = validateCheckbox(
      gdpr,
      'Debes aceptar el consentimiento RGPD'
    );

    if (!validPrivacy || !validTerms || !validGdpr) {
      return;
    }

    await onSubmit(data, currentForm);
  });
}


// ======================================================
// FORGOT PASSWORD FORM
// ======================================================

export function initForgotPasswordForm(onSubmit) {
  const form = document.getElementById(
    'forgot-password-form'
  );

  if (!form) return;

  handleFormSubmit(form, onSubmit);
}


// ======================================================
// RESET PASSWORD FORM
// ======================================================

export function initResetPasswordForm(onSubmit) {
  const form = document.getElementById(
    'reset-password-form'
  );

  if (!form) return;

  handleFormSubmit(form, onSubmit);
}


// ======================================================
// PROFILE FORM
// ======================================================

export function initProfileForm(onSubmit) {
  const form = document.getElementById('profile-form');

  if (!form) return;

  handleFormSubmit(form, onSubmit);
}


// ======================================================
// CHANGE PASSWORD FORM
// ======================================================

export function initChangePasswordForm(onSubmit) {
  const form = document.getElementById(
    'change-password-form'
  );

  if (!form) return;

  handleFormSubmit(form, onSubmit);
}