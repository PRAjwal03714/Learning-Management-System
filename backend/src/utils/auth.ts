export const getToken = () => {
    if (typeof window === 'undefined') return null;
    const role = localStorage.getItem('role');
    return role ? localStorage.getItem(`${role}_token`) : null;
  };
  
  export const setToken = (role: 'student' | 'instructor', token: string) => {
    localStorage.setItem(`${role}_token`, token);
    localStorage.setItem('role', role);
  };
  
  export const removeToken = (role: 'student' | 'instructor') => {
    localStorage.removeItem(`${role}_token`);
    localStorage.removeItem('role');
  };
  