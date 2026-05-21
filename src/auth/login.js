import { supabase } from '@/services/supabase/client.js';
import { csrfService } from '@/services/security/csrf.service.js';

document.getElementById('frm-login')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('txt-email').value;
  const password = document.getElementById('txt-password').value;
  
  if (!csrfService.validateToken()) {
    alert('CSRF validation failed');
    return;
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) alert(error.message);
  else window.location.href = '../protected/dashboard.html';
});
