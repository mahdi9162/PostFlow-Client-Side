import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { AuthContext } from './AuthContext';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  reload,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { auth } from '../firebase/firebase.config';

const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // signup with email and pass
  const signUpWithEmailPass = useCallback((email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  }, []);

  // Signin With Email and Pass
  const signInWithEmailPass = useCallback((email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  }, []);

  // user verification email
  const userVerification = useCallback(() => {
    if (!auth.currentUser) return Promise.reject('No current user');
    return sendEmailVerification(auth.currentUser);
  }, []);

  // sign out
  const userSignOut = useCallback(() => {
    setLoading(true);
    return signOut(auth);
  }, []);

  // Update User
  const updateUserProfile = useCallback((profile) => {
    return updateProfile(auth.currentUser, profile);
  }, []);

  // Reset Email
  const resetPassword = useCallback((email) => {
    setLoading(true);
    return sendPasswordResetEmail(auth, email);
  }, []);

  // observer
  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => {
      unSubscribe();
    };
  }, []);

  const refreshUser = useCallback(async () => {
    if (!auth.currentUser) return;
    await reload(auth.currentUser);
    setUser({ ...auth.currentUser });
  }, []);

  const authInfo = useMemo(() => ({
    user,
    loading,
    signUpWithEmailPass,
    signInWithEmailPass,
    userVerification,
    userSignOut,
    updateUserProfile,
    refreshUser,
    resetPassword,
    setLoading,
  }), [
    user,
    loading,
    signUpWithEmailPass,
    signInWithEmailPass,
    userVerification,
    userSignOut,
    updateUserProfile,
    refreshUser,
    resetPassword,
  ]);

  return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
