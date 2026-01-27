import React, { useState } from 'react';
import Container from '../container/Container';
import { Link, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import useAuth from '../../hooks/useAuth';
import Loading from '../Loading/Loading';
import { reload } from 'firebase/auth';
import { auth } from '../../firebase/firebase.config';
import toast from 'react-hot-toast';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signInWithEmailPass, refreshUser } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  //   regex
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passValidation = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}[\]:;"'<>,.?/\\|]).{8,15}$/;

  const handleUserLogin = async (data) => {
    const { email, password } = data;
    setLoading(true);

    try {
      await signInWithEmailPass(email, password);

      if (!auth.currentUser) throw new Error('No current user after login');

      await reload(auth.currentUser);

      if (!auth.currentUser.emailVerified) {
        toast.info('Please verify your email. We sent you a link.');
        navigate('/check-email', { replace: true });
        return;
      }

      await refreshUser();
      toast.success('You are logged in!');
      navigate('/', { replace: true });
    } catch (error) {
      console.log(error);
      toast.error('Login failed. Check email/password.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Container>
      <section className="py-6 md:py-16 px-3 lg:px-0 flex items-center justify-center">
        <div className="w-full flex flex-col-reverse lg:flex-row gap-8 justify-between items-center mt-6 md:mt-10">
          {/* left side */}
          <div className="flex-1 order-2 lg:order-1 text-center lg:text-left px-4">
            <div className="flex items-center justify-center lg:justify-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center rotate-3 bg-linear-to-br from-primary to-primary/70 shadow-[0_10px_20px_rgba(47,107,255,0.2)]">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>

              <div>
                <h1 className="text-3xl font-black tracking-tight text-secondary">PostFlow</h1>
                <p className="text-sm font-medium uppercase tracking-widest opacity-70">Post Planner</p>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl md:text-4xl font-bold leading-tight text-secondary">
                Sign in to keep the <span className="text-primary">flow</span>.
              </h2>
              <p className="text-base md:text-lg max-w-md mx-auto lg:mx-0 text-muted">
                Internal tool for team members — log in to copy captions and post fast.
              </p>
            </div>

            <div className="mt-8 hidden lg:block">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/15">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-sm font-semibold text-secondary">Internal Team Access Only</span>
              </div>
            </div>
          </div>

          {/* right side */}
          <div className="w-full flex-1 order-1 lg:order-2">
            <div className="bg-base-100 rounded-4xl p-6 md:p-10 border shadow-2xl shadow-primary/10 border-secondary/10">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-secondary">Sign in</h2>
                <p className="text-sm mt-1 text-muted">Use your team email to access the planner</p>
              </div>

              <form onSubmit={handleSubmit(handleUserLogin)} className="space-y-5">
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-semibold">Email</span>
                  </label>
                  <input
                    name="email"
                    type="email"
                    {...register('email', { required: true, pattern: { value: emailRegex, message: 'Enter a valid email address' } })}
                    placeholder="team@email.com"
                    className="input input-bordered w-full bg-base-200/40 focus:bg-base-100 transition-all rounded-xl border-base-300"
                  />
                  {errors.email && <p className="text-left mt-1 text-xs text-red-400/80">{errors.email.message}</p>}
                </div>

                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-semibold">Password</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    {...register('password', {
                      required: true,
                      pattern: {
                        value: passValidation,
                        message: 'Use 8–15 chars with uppercase, lowercase, number & special symbol.',
                      },
                    })}
                    placeholder="••••••••"
                    className="input input-bordered w-full bg-base-200/40 focus:bg-base-100 transition-all rounded-xl border-base-300"
                  />
                  {errors.password && <p className="text-left mt-1 text-xs text-red-400/80">{errors.password.message}</p>}
                </div>

                <div>
                  <Link to="/forgot-password" type="button" className="text-sm font-semibold text-primary hover:underline cursor-pointer">
                    Forgot password?
                  </Link>
                </div>

                <button className="btn btn-primary w-full h-14 text-white text-lg font-bold rounded-2xl shadow-lg shadow-primary/25 hover:shadow-primary/30 transition-all border-none bg-linear-to-b from-primary to-primary/80">
                  Log in
                </button>

                <p className="text-center text-sm font-medium mt-4 text-muted">
                  New here?{' '}
                  <Link to="/signup" type="button" className="text-primary font-bold hover:underline">
                    Create account
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Container>
  );
};

export default Login;
