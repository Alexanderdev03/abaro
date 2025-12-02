import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { auth, googleProvider } from '../firebase/config';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const isRemoteUpdate = useRef(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                const appUser = {
                    uid: firebaseUser.uid,
                    name: firebaseUser.displayName,
                    email: firebaseUser.email,
                    photoURL: firebaseUser.photoURL,
                    role: 'client',
                    wallet: 0
                };

                const savedUser = localStorage.getItem('user');
                if (savedUser) {
                    try {
                        const parsed = JSON.parse(savedUser);
                        if (parsed.email === appUser.email) {
                            appUser.role = parsed.role || 'client';
                            appUser.wallet = parsed.wallet || 0;
                            appUser.coupons = parsed.coupons || [];
                        }
                    } catch (e) {
                        console.error("Error parsing saved user", e);
                    }
                }

                // Hardcoded Admin Access
                if (appUser.email && appUser.email.toLowerCase() === 'alexanderdayanperazacasanova@gmail.com') {
                    appUser.role = 'admin';
                }

                setUser(appUser);
                localStorage.setItem('user', JSON.stringify(appUser));
            } else {
                setUser(null);
                localStorage.removeItem('user');
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    // Listen to real-time updates from Firestore
    useEffect(() => {
        if (user?.email) {
            import('firebase/firestore').then(({ doc, onSnapshot }) => {
                import('../firebase/config').then(({ db }) => {
                    const userRef = doc(db, 'users', user.email);
                    const unsubscribe = onSnapshot(userRef, (doc) => {
                        if (doc.exists()) {
                            const userData = doc.data();
                            isRemoteUpdate.current = true; // Mark as remote update
                            setUser(prev => {
                                const updatedUser = {
                                    ...prev,
                                    ...userData,
                                    // Ensure critical fields are preserved if missing in DB
                                    role: userData.role || prev.role,
                                    // Prefer DB value if defined, otherwise keep local (prevents overwriting with 0 if missing)
                                    wallet: userData.wallet !== undefined ? userData.wallet : (prev.wallet || 0),
                                    coupons: userData.coupons || []
                                };
                                // Update local storage with the FRESH updatedUser
                                localStorage.setItem('user', JSON.stringify(updatedUser));
                                return updatedUser;
                            });
                        }
                    });
                    return () => unsubscribe();
                });
            });
        }
    }, [user?.email]); // Only re-subscribe if email changes

    // Sync user to Firestore whenever it changes LOCALLY
    useEffect(() => {
        if (user) {
            if (isRemoteUpdate.current) {
                isRemoteUpdate.current = false; // Reset flag and skip sync
                return;
            }
            import('../services/users').then(({ UserService }) => {
                UserService.syncUser(user);
            });
        }
    }, [user]);

    const loginWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            console.error("Error logging in with Google:", error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    const value = {
        user,
        setUser,
        loginWithGoogle,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading ? children : null}
        </AuthContext.Provider>
    );
}
