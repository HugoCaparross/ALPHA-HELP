import { supabase } from '@/services/supabase/client.js';
import { validatePasswordStrength } from '@/utils/password-validator.js';

document.getElementById('frm-register')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('txt-reg-email').value;
  const password = document.getElementById('txt-reg-password').value;

  const pwdCheck = validatePasswordStrength(password);
  if (!pwdCheck.isValid) {
    alert('Contraseña insegura: ' + pwdCheck.errors.join(', '));
    return;
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: window.location.origin + '/src/pages/public/login.html'
    }
  });

  if (error) alert(error.message);
  else alert('Registro exitoso. Revisa tu email para verificar la cuenta.');
});
