const ATTEMPTS_LIMIT = 5;
const LOCK_TIME = 1000 * 60 * 15; // 15 mins

export const rateLimitService = {
  checkBruteForce(email) {
    const key = `login_attempts_${email}`;
    const data = JSON.parse(localStorage.getItem(key) || '{"attempts": 0, "lockedUntil": 0}');
    
    if (data.lockedUntil > Date.now()) {
      const rem = Math.ceil((data.lockedUntil - Date.now()) / (1000 * 60));
      throw new Error(`Cuenta bloqueada temporalmente. Inténtalo de nuevo en ${rem} minutos.`);
    }
    return true;
  },
  
  registerFailAttempt(email) {
    const key = `login_attempts_${email}`;
    const data = JSON.parse(localStorage.getItem(key) || '{"attempts": 0, "lockedUntil": 0}');
    
    data.attempts += 1;
    if (data.attempts >= ATTEMPTS_LIMIT) {
      data.lockedUntil = Date.now() + LOCK_TIME;
      data.attempts = 0;
    }
    localStorage.setItem(key, JSON.stringify(data));
  },
  
  clearAttempts(email) {
    const key = `login_attempts_${email}`;
    localStorage.removeItem(key);
  }
};
