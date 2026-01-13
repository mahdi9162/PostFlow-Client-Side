import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { reload } from 'firebase/auth';
import { auth } from '../../../firebase/firebase.config';
import useAuth from '../../../hooks/useAuth';

const CheckEmail = () => {
  const { user, userVerification, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [sending, setSending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // verified
  useEffect(() => {
    if (user?.emailVerified) navigate('/', { replace: true });
  }, [user?.emailVerified, navigate]);

  // auto-check
  useEffect(() => {
    const interval = setInterval(async () => {
      if (!auth.currentUser) return;

      await reload(auth.currentUser);
      if (auth.currentUser.emailVerified) {
        await refreshUser();
        clearInterval(interval);
        navigate('/', { replace: true });
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [navigate, refreshUser]);

  //  resend cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((p) => p - 1), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const resend = async () => {
    setSending(true);
    try {
      await userVerification();
      setCooldown(30);
    } catch (e) {
      console.log(e);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="card bg-base-100 border border-base-200 p-6 max-w-md w-full">
        <h2 className="text-xl font-bold">Verify your email</h2>
        <p className="mt-2 text-base-content/60">Open the verification link we sent. This page will auto-continue once verified.</p>

        <div className="mt-4 flex items-center gap-2 text-sm text-base-content/60">
          <span className="loading loading-dots loading-sm"></span>
          <span>Waiting for verification…</span>
        </div>

        <button onClick={resend} className="btn btn-primary mt-5 w-full" disabled={sending || cooldown > 0}>
          {sending ? 'Sending...' : cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend email'}
        </button>

        <p className="mt-3 text-xs text-base-content/50">
          Tip: Check Spam/Promotions. If you typed the wrong email, log out and sign up again.
        </p>
      </div>
    </div>
  );
};

export default CheckEmail;
