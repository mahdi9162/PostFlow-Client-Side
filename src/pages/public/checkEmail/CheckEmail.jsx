import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { reload } from 'firebase/auth';
import { auth } from '../../../firebase/firebase.config';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import toast from 'react-hot-toast';

const CheckEmail = () => {
  const { user, userVerification, refreshUser } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [sending, setSending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const isVerified = !!user?.emailVerified;
  const intervalRef = useRef(null);

  // auto-check (reload user until verified)
  useEffect(() => {
    if (isVerified) return;

    // avoid multiple intervals
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(async () => {
      const current = auth.currentUser;
      if (!current) return;

      try {
        await reload(current);

        if (current.emailVerified) {
          await refreshUser();
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        }
        // eslint-disable-next-line no-unused-vars
      } catch (err) {
        // console.log(err);
      }
    }, 2000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [refreshUser, isVerified]);

  // resend cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;

    const t = setInterval(() => {
      setCooldown((p) => Math.max(p - 1, 0));
    }, 1000);

    return () => clearInterval(t);
  }, [cooldown]);

  const resend = async () => {
    if (sending) return;

    setSending(true);
    try {
      await userVerification();
      setCooldown(30);
      toast.success('Verification email sent again!');
    } catch (e) {
      if (e?.code === 'auth/too-many-requests') {
        toast.error('Too many attempts. Please try again later!');
      } else {
        toast.error('Failed to resend email. Try again.');
      }
    } finally {
      setSending(false);
    }
  };

  const submitAccessRequest = async () => {
    if (!isVerified) return;

    const role = localStorage.getItem('requestedRole');
    if (!role) {
      toast.error('Role not found. Please sign up again.');
      return;
    }

    if (submitting) return;

    setSubmitting(true);
    try {
      await axiosSecure.post('/api/users', { role });
      toast.success('Access request submitted!');
      navigate('/pending-approval', { replace: true });
      // eslint-disable-next-line no-unused-vars
    } catch (e) {
      toast.error('Request failed. Please try again.');
      // console.log(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="card bg-base-100 border border-base-200 p-6 max-w-md w-full">
        <h2 className="text-xl font-bold">Verify your email</h2>
        <p className="mt-2 text-base-content/60">Open the verification link we sent. This page will update once verified.</p>

        <div className="mt-4 flex items-center gap-2 text-sm text-base-content/60">
          {!isVerified ? (
            <>
              <span className="loading loading-dots loading-sm"></span>
              <span>Waiting for verification…</span>
            </>
          ) : (
            <>
              <span className="badge badge-success badge-sm"></span>
              <span>Email verified ✅</span>
            </>
          )}
        </div>

        {!isVerified ? (
          <button onClick={resend} className="btn btn-primary mt-5 w-full" disabled={sending || cooldown > 0}>
            {sending ? 'Sending...' : cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend email'}
          </button>
        ) : (
          <button onClick={submitAccessRequest} className="btn btn-primary mt-5 w-full" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit access request'}
          </button>
        )}

        <p className="mt-3 text-xs text-base-content/50">
          Tip: Check Spam/Promotions. If you typed the wrong email, log out and sign up again.
        </p>
      </div>
    </div>
  );
};

export default CheckEmail;
