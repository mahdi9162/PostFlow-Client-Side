import React, { useState } from 'react';
import Container from '../container/Container';
import { Link, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import useAuth from '../../hooks/useAuth';
import Loading from '../Loading/Loading';

const Signup = () => {
  const { signUpWithEmailPass, updateUserProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  //   regex
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passValidation = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}[\]:;"'<>,.?/\\|]).{8,15}$/;

  const handleUserSignup = async (data) => {
    const { email, password, fullName } = data;
    setLoading(true);
    try {
      const res = await signUpWithEmailPass(email, password);
      // eslint-disable-next-line no-unused-vars
      const userProfile = res.user;

      await updateUserProfile({ displayName: fullName });
      alert('Your profile is created!');
      navigate('/');
    } catch (error) {
      console.log(error);
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
          <div className="lg:col-span-5 order-2 lg:order-1 text-center lg:text-left px-4">
            <div className="flex items-center justify-center lg:justify-start gap-4 mb-6">
              <div
                className="
                  w-12 h-12 rounded-2xl flex items-center justify-center rotate-3
                  bg-[linear-gradient(135deg,#2f6bff_0%,#1a4cd3_100%)]
                  shadow-[0_10px_20px_rgba(47,107,255,0.2)]
                "
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>

              <div>
                <h1 className="text-3xl font-black tracking-tight text-secondary">PostFlow</h1>
                <p className="text-sm font-medium uppercase tracking-widest opacity-70">Planner Pro</p>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl md:text-4xl font-bold leading-tight text-secondary">
                Optimize your social <span className="text-primary">workflow.</span>
              </h2>

              <p className="text-base md:text-lg max-w-md mx-auto lg:mx-0 text-base-content/60">
                Plan captions once, let your team handle the rest. Simple, fast, and internal.
              </p>
            </div>

            <div className="mt-8 hidden lg:block">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/15">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-sm font-semibold text-secondary">Internal Team Access Only</span>
              </div>
            </div>
          </div>

          {/* Right Side: Form Card */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <div
              className="
                bg-base-100 rounded-3xl p-6 md:p-10 border
                shadow-2xl shadow-primary/10
                border-base-200
              "
            >
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-secondary">Create Account</h2>
                <p className="text-sm mt-1 text-base-content/60">Join your team to start planning</p>
              </div>

              <form onSubmit={handleSubmit(handleUserSignup)} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text font-semibold">Full Name</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      {...register('fullName', {
                        required: 'Full name is required',
                      })}
                      placeholder="Enter your name"
                      className="input input-bordered w-full bg-base-200/40 focus:bg-base-100 transition-all rounded-xl border-base-200"
                    />
                    {errors.fullName && <p className="text-left mt-1 text-xs text-red-400/80">{errors.fullName.message}</p>}
                  </div>

                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text font-semibold">Team Role</span>
                    </label>
                    <select
                      name="role"
                      {...register('role', {
                        required: 'Role is required',
                      })}
                      defaultValue=""
                      className="select select-bordered w-full bg-base-200 focus:bg-base-100 rounded-xl border-base-200 "
                    >
                      <option value="" disabled hidden>
                        Enter your role
                      </option>
                      <option>Creator</option>
                      <option>Helper</option>
                      <option>Admin</option>
                    </select>
                    {errors.role && <p className="text-left mt-1 text-xs text-red-400/80">{errors.role.message}</p>}
                  </div>
                </div>

                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-semibold">Email Address</span>
                  </label>
                  <input
                    name="email"
                    type="email"
                    {...register('email', { required: true, pattern: { value: emailRegex, message: 'Enter a valid email address' } })}
                    placeholder="name@company.com"
                    className="input input-bordered w-full bg-base-200/40 focus:bg-base-100 transition-all rounded-xl border-base-200"
                  />
                  {errors.email && <p className="text-left mt-1 text-xs text-red-400/80">{errors.email.message}</p>}
                </div>

                <div className="grid md:grid-cols-2 gap-5">
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
                      className="input input-bordered w-full bg-base-200/40 focus:bg-base-100 transition-all rounded-xl border-base-200"
                    />
                    {errors.password && <p className="text-left mt-1 text-xs text-red-400/80">{errors.password.message}</p>}
                  </div>

                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text font-semibold">Confirm Password</span>
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      {...register('confirmPassword', {
                        required: 'Please confirm your password',
                        // eslint-disable-next-line react-hooks/incompatible-library
                        validate: (value) => value === watch('password') || 'Passwords do not match',
                      })}
                      placeholder="••••••••"
                      className="input input-bordered w-full bg-base-200/40 focus:bg-base-100 transition-all rounded-xl border-base-200"
                    />
                    {errors.confirmPassword && (
                      <p className="text-left lg:ml-18 mt-1 text-xs text-red-400/80">{errors.confirmPassword.message}</p>
                    )}
                  </div>
                </div>

                <button
                  className="
                    btn btn-primary w-full h-14 text-white text-lg font-bold rounded-2xl
                    shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all border-none
                    bg-[linear-gradient(180deg,#2f6bff_0%,#1a56e8_100%)]
                  "
                >
                  Get Started
                </button>

                <p className="text-center text-sm font-medium mt-4 text-base-content/60">
                  Already have an account?
                  <Link to="/login" type="button" className="text-primary font-bold hover:underline">
                    Sign In
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

export default Signup;
