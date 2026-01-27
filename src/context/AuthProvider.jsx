import React, { useEffect, useState } from 'react';
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
  console.log(user);

  //signup with email and pass
  const signUpWithEmailPass = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  //   Signin With Email and Pass
  const signInWithEmailPass = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // user verification email
  const userVerification = () => {
    if (!auth.currentUser) return Promise.reject('No current user');
    return sendEmailVerification(auth.currentUser);
  };

  // sign out
  const userSignOut = () => {
    setLoading(true);
    return signOut(auth);
  };

  // Update User
  const updateUserProfile = (profile) => {
    return updateProfile(auth.currentUser, profile);
  };

  // Reset Email
  const resetPassword = (email) => {
    setLoading(true);
    return sendPasswordResetEmail(auth, email);
  };

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

  const refreshUser = async () => {
    if (!auth.currentUser) return;
    await reload(auth.currentUser);
    setUser({ ...auth.currentUser });
  };

  const authInfo = {
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
  };
  return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
