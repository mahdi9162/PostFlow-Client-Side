import React from 'react';
import Container from '../container/Container';

const Signup = () => {
  return (
    <Container>
      <section className="py-6 md:py-16 px-3 lg:px-0 flex items-center justify-center">
        <div className="w-full flex flex-col-reverse lg:flex-row gap-8 justify-between items-center mt-6 md:mt-10">
          {/* left side */}
          <div className="lg:col-span-5 order-2 lg:order-1 text-center lg:text-left px-4">
            <div className="flex items-center justify-center lg:justify-start gap-4 mb-6">
              {/* icon */}
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center rotate-3 bg-linear-to-br from-primary to-primary/70 shadow-[0_10px_20px_rgba(47,107,255,0.2)]">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
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
              <p className="text-base md:text-lg max-w-md mx-auto lg:mx-0 text-muted">
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
            <div className="bg-base-100 rounded-4xl p-6 md:p-10 border shadow-2xl shadow-primary/10 border-secondary/10">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-secondary">Create Account</h2>
                <p className="text-sm mt-1 text-muted">Join your team to start planning</p>
              </div>

              <form className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text font-semibold">Full Name</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your name"
                      className="input input-bordered w-full bg-base-200/40 focus:bg-base-100 transition-all rounded-xl border-base-300"
                    />
                  </div>

                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text font-semibold">Team Role</span>
                    </label>
                    <select className="select select-bordered w-full bg-base-200 focus:bg-base-100 rounded-xl border-base-300">
                      <option>Creator</option>
                      <option>Helper</option>
                      <option>Admin</option>
                    </select>
                  </div>
                </div>

                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-semibold">Email Address</span>
                  </label>
                  <input
                    type="email"
                    placeholder="name@company.com"
                    className="input input-bordered w-full bg-base-200/40 focus:bg-base-100 transition-all rounded-xl border-base-300"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text font-semibold">Password</span>
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="input input-bordered w-full bg-base-200/40 focus:bg-base-100 transition-all rounded-xl border-base-300"
                    />
                  </div>

                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text font-semibold">Confirm Password</span>
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="input input-bordered w-full bg-base-200/40 focus:bg-base-100 transition-all rounded-xl border-base-300"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 py-2">
                  <input type="checkbox" className="checkbox checkbox-primary checkbox-sm rounded-md" />
                  <span className="text-sm cursor-pointer select-none text-muted">
                    I agree to the internal tool guidelines.
                  </span>
                </div>

                {/* button */}
                <button
                  type="button"
                  className="btn btn-primary w-full h-14 text-white text-lg font-bold rounded-2xl shadow-lg shadow-primary/25 hover:shadow-primary/30 transition-all border-none bg-linear-to-b from-primary to-primary/80"
                >
                  Get Started
                </button>

                <p className="text-center text-sm font-medium mt-4 text-muted">
                  Already have an account?{' '}
                  <button type="button" className="text-primary font-bold hover:underline">
                    Sign In
                  </button>
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
