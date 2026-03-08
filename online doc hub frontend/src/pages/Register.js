import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/authService';

const Field = ({ label, name, type = 'text', icon, placeholder, formData, onChange }) => (
  <div>
    <label className="block text-sm font-semibold text-slate-300 mb-2">{label}</label>
    <div className="relative">
      {icon && <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">{icon}</span>}
      <input type={type} name={name} value={formData[name]} onChange={onChange}
        className={`input-field ${icon ? 'has-icon' : ''}`} placeholder={placeholder} required />
    </div>
  </div>
);

const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);
const LockIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);
const MailIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const Register = () => {
  const [formData, setFormData] = useState({ firstName:'', lastName:'', username:'', email:'', password:'', confirmPassword:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) { setError('Passwords do not match'); return; }
    setLoading(true); setError('');
    try {
      await register({ firstName: formData.firstName, lastName: formData.lastName, username: formData.username, email: formData.email, password: formData.password, roles: ['USER'] });
      navigate('/login');
    } catch { setError('Registration failed. Username or email may already be taken.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 relative overflow-hidden">
      <div className="bg-grid absolute inset-0 pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-violet-600/18 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-600/12 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-[72px] h-[72px] rounded-[22px] mb-5 animate-float"
            style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)' }}>
            <svg className="w-9 h-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Create account</h1>
          <p className="mt-2.5 text-slate-400 text-base">Join <span className="text-gradient font-semibold">DocHub</span> — it's free</p>
        </div>

        <div className="glass-card-static p-8">
          {error && <div className="alert-error mb-5">
            <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
            {error}
          </div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="First Name" name="firstName" placeholder="First" icon={<UserIcon />} formData={formData} onChange={handleChange} />
              <Field label="Last Name" name="lastName" placeholder="Last" icon={<UserIcon />} formData={formData} onChange={handleChange} />
            </div>
            <Field label="Username" name="username" placeholder="Choose a username" icon={<UserIcon />} formData={formData} onChange={handleChange} />
            <Field label="Email" name="email" type="email" placeholder="you@example.com" icon={<MailIcon />} formData={formData} onChange={handleChange} />
            <Field label="Password" name="password" type="password" placeholder="Create a password" icon={<LockIcon />} formData={formData} onChange={handleChange} />
            <Field label="Confirm Password" name="confirmPassword" type="password" placeholder="Repeat your password" icon={<LockIcon />} formData={formData} onChange={handleChange} />

            <button type="submit" className="btn-primary w-full py-3.5 mt-2" disabled={loading}>
              {loading ? (<><svg className="animate-spin mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>Creating account...</>) : 'Create account'}
            </button>
          </form>

          <hr className="divider" />
          <p className="text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">Sign in →</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;