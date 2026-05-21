export const csrfService = {
  getToken() {
    let token = localStorage.getItem('csrf_token');
    if (!token) {
      token = crypto.randomUUID();
      localStorage.setItem('csrf_token', token);
    }
    return token;
  },
  validateToken(inputToken) {
    const storedToken = localStorage.getItem('csrf_token');
    return storedToken === inputToken;
  }
};
