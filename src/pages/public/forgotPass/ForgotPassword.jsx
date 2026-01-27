import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import Container from '../../../components/container/Container';
import useAuth from '../../../hooks/useAuth';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const { resetPassword, setLoading } = useAuth();
  const navigate = useNavigate();

  const handleResetButton = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    try {
      await resetPassword(email);
      toast.success('Password reset email sent. Check inbox or spam folder.');
      setEmail('');
      navigate('/login');
    } catch (error) {
      toast.error(error.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };
  return (
    <Container>
      <section className="flex items-center justify-center md:my-12 py-10 px-4 md:px-6 lg:px-8">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden rounded-[2.5rem] border border-base-200 shadow-2xl bg-base-100">
          {/* Left: Content Section */}
          <div className="relative p-8 md:p-14 lg:p-16 flex flex-col justify-center bg-linear-to-br from-primary/5 via-transparent to-secondary/5 border-b lg:border-b-0 lg:border-r border-base-200">
            {/* Subtle Background Element */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-primary/10 blur-[80px] rounded-full -translate-x-1/2 -translate-y-1/2" />

            <div className="relative">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-primary/10 border border-primary/20 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Security Portal</span>
              </div>

              <h2 className="text-2xl md:text-5xl font-extrabold tracking-tight text-secondary leading-[1.1]">
                Reset your
                <span className="text-primary/60 italic md:block"> password.</span>
              </h2>

              <p className="mt-6 text-sm md:text-base text-base-content/70 leading-relaxed max-w-sm">
                Enter your email address below and we'll send a secure reset link to your inbox.
              </p>

              <div className="mt-10 flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-base-200 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <svg
                    className="w-5 h-5 text-base-content/60 group-hover:text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="text-sm font-medium text-base-content/50 leading-snug">
                  Tip: Use the same email you <br /> used during signup.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Form Section */}
          <div className="p-8 md:p-14 lg:p-16 bg-base-100 flex flex-col justify-center">
            <div className="mb-10 text-center lg:text-left">
              <h3 className="text-2xl font-bold text-secondary">Account Recovery</h3>
              <p className="text-base-content/60 mt-2 font-medium">Please verify your identity</p>
            </div>

            <form onSubmit={handleResetButton} className="space-y-6">
              <div className="form-control w-full">
                <label className="label mb-1">
                  <span className="label-text font-bold text-secondary/80 tracking-wide">Enter Your Email</span>
                </label>
                <input
                  type="email"
                  placeholder="name@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="
                    input input-bordered h-14 w-full rounded-xl
                    bg-base-200/30 border-base-200/60
                    focus:bg-white focus:border-primary
                    focus:ring-4 focus:ring-primary/5
                    transition-all duration-300 outline-none
                  "
                />
              </div>

              <button
                type="submit"
                className="
                  btn w-full h-10 md:h-14 rounded-xl border-0 text-white text-base font-bold tracking-wide
                  bg-primary/60 hover:bg-primary-focus
                  shadow-xl shadow-primary/20 hover:shadow-primary/30
                  hover:-translate-y-0.5 active:translate-y-0
                  transition-all duration-300
                "
              >
                Send reset link
              </button>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-between gap-4 pt-4 border-t border-base-100">
                <Link
                  to="/login"
                  className="text-sm font-bold text-primary/80 hover:text-primary transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Return to login
                </Link>
                <Link to="/signup" className="text-sm font-bold text-base-content/40 hover:text-base-content transition-colors">
                  Create an account
                </Link>
              </div>
            </form>
          </div>
        </div>
      </section>
    </Container>
  );
};

export default ForgotPassword;
