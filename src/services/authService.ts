
import { v4 as uuidv4 } from 'uuid';

// User interface
export interface User {
  id: string;
  email: string;
  name: string;
}

// Authentication state
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

// User credentials for login/signup
export interface UserCredentials {
  email: string;
  password: string;
  name?: string;
}

// Initialize auth state
const getInitialAuthState = (): AuthState => {
  const savedUser = localStorage.getItem('travel-checklist-user');
  if (savedUser) {
    try {
      const user = JSON.parse(savedUser);
      return { user, isAuthenticated: true };
    } catch (error) {
      localStorage.removeItem('travel-checklist-user');
    }
  }
  return { user: null, isAuthenticated: false };
};

// Get current auth state
export const getAuthState = (): AuthState => {
  return getInitialAuthState();
};

// Login user
export const loginUser = (credentials: UserCredentials): User | null => {
  const users = JSON.parse(localStorage.getItem('travel-checklist-users') || '[]');
  const user = users.find(
    (u: UserCredentials) => u.email === credentials.email && u.password === credentials.password
  );
  
  if (user) {
    const { password, ...userWithoutPassword } = user;
    localStorage.setItem('travel-checklist-user', JSON.stringify(userWithoutPassword));
    return userWithoutPassword;
  }
  
  return null;
};

// Register user
export const registerUser = (credentials: UserCredentials): User | null => {
  const users = JSON.parse(localStorage.getItem('travel-checklist-users') || '[]');
  
  // Check if user already exists
  if (users.some((u: UserCredentials) => u.email === credentials.email)) {
    return null;
  }
  
  // Create new user
  const newUser = {
    id: uuidv4(),
    email: credentials.email,
    password: credentials.password,
    name: credentials.name || credentials.email.split('@')[0]
  };
  
  users.push(newUser);
  localStorage.setItem('travel-checklist-users', JSON.stringify(users));
  
  // Return user without password
  const { password, ...userWithoutPassword } = newUser;
  localStorage.setItem('travel-checklist-user', JSON.stringify(userWithoutPassword));
  
  return userWithoutPassword;
};

// Logout user
export const logoutUser = (): void => {
  localStorage.removeItem('travel-checklist-user');
};
