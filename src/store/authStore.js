import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const API_URL = 'http://localhost:5000/api';

const useAuthStore = create(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            // Register new user
            register: async (email, password, name) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await fetch(`${API_URL}/auth/register`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, password, name })
                    });

                    const data = await response.json();

                    if (!response.ok) {
                        throw new Error(data.error || 'Registration failed');
                    }

                    set({
                        user: data.user,
                        token: data.token,
                        isAuthenticated: true,
                        isLoading: false
                    });

                    return data;
                } catch (error) {
                    set({ error: error.message, isLoading: false });
                    throw error;
                }
            },

            // Login user
            login: async (email, password) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await fetch(`${API_URL}/auth/login`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, password })
                    });

                    const data = await response.json();

                    if (!response.ok) {
                        throw new Error(data.error || 'Login failed');
                    }

                    set({
                        user: data.user,
                        token: data.token,
                        isAuthenticated: true,
                        isLoading: false
                    });

                    return data;
                } catch (error) {
                    set({ error: error.message, isLoading: false });
                    throw error;
                }
            },

            // Logout user
            logout: () => {
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    error: null
                });
            },

            // Get current user
            getCurrentUser: async () => {
                const token = get().token;
                if (!token) return null;

                try {
                    const response = await fetch(`${API_URL}/auth/me`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (!response.ok) {
                        get().logout();
                        return null;
                    }

                    const data = await response.json();
                    set({ user: data.user });
                    return data.user;
                } catch (error) {
                    get().logout();
                    return null;
                }
            },

            // Clear error
            clearError: () => set({ error: null })
        }),
        {
            name: 'synapse-auth',
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated
            })
        }
    )
);

export default useAuthStore;
