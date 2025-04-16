// src/utils/auth.ts

export const setToken = (role: 'student' | 'instructor', token: string) => {
  // Clear any existing tokens and role
  localStorage.removeItem('student_token');
  localStorage.removeItem('instructor_token');
  localStorage.removeItem('role');
  
  // Set new token and role
  localStorage.setItem(`${role}_token`, token);
  localStorage.setItem('role', role);
};

export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  const role = localStorage.getItem('role');
  return role ? localStorage.getItem(`${role}_token`) : null;
};

export const removeToken = (role: 'student' | 'instructor') => {
  localStorage.removeItem(`${role}_token`);
  localStorage.removeItem('role');
};

// Add a function to check if user is logged in as a specific role
export const isLoggedInAs = (role: 'student' | 'instructor'): boolean => {
  if (typeof window === 'undefined') return false;
  const currentRole = localStorage.getItem('role');
  const token = localStorage.getItem(`${role}_token`);
  return currentRole === role && token !== null;
};

// Add a function to get current role
export const getCurrentRole = (): 'student' | 'instructor' | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('role') as 'student' | 'instructor' | null;
};
  