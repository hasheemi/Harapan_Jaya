// hooks/useAuth.ts
import { useState, useEffect } from "react";
import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../lib/firebase";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("user");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return { user, loading, logout };
};
