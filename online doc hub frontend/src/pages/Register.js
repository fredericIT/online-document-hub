import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/authService';
import { uploadAvatar } from '../services/api';

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
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const { register, verify } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Professional Validation (Logic only, no hints on UI)
    const emailRegex = /^[a-zA-Z][a-zA-Z0-9._%+-]*@gmail\.com$/;
    if (!emailRegex.test(formData.email)) {
      setError('Invalid email format. Must be @gmail.com and cannot start with a number.');
      return;
    }

    const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\S+$).{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      setError('Password is too weak. Must include uppercase, lowercase, numbers, and special characters.');
      return;
    }

    if (formData.password !== formData.confirmPassword) { setError('Passwords do not match'); return; }
    setLoading(true); setError('');
    try {
      const userData = { 
        firstName: formData.firstName, 
        lastName: formData.lastName, 
        username: formData.username, 
        email: formData.email, 
        password: formData.password, 
        roles: ['USER'] 
      };

      const submitData = new FormData();
      submitData.append('userData', new Blob([JSON.stringify(userData)], { type: 'application/json' }));
      if (avatarFile) {
        submitData.append('avatar', avatarFile);
      }

      await register(submitData);
      setShowVerification(true);
    } catch (err) { 
      setError(err.response?.data?.message || 'Registration failed. Username or email may already be taken.'); 
    }
    finally { setLoading(false); }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await verify(verificationCode);
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Verification failed. Please check the code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex-grow flex items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <img src="/bg-auth.png" alt="Background" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[2px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-[72px] h-[72px] rounded-[22px] mb-5 animate-float"
            style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)' }}>
            {!showVerification ? (
              <svg className="w-9 h-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            ) : (
              <svg className="w-9 h-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            {!showVerification ? 'Create account' : 'Verify Email'}
          </h1>
          <p className="mt-2.5 text-slate-400 text-base">
            {!showVerification ? (
              <>Join <span className="text-gradient font-semibold">DocHub</span> — it's free</>
            ) : (
              <>Almost there! Check your <span className="text-indigo-400 font-semibold">Inbox</span></>
            )}
          </p>
        </div>

        <div className="glass-card-static p-8">
          {error && <div className="alert-error mb-5">
            <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
            {error}
          </div>}

          {!showVerification ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Avatar Upload */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-indigo-500/50 bg-slate-800 flex items-center justify-center">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <svg className="w-12 h-12 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 bg-indigo-600 p-1.5 rounded-full cursor-pointer hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/30">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                  </label>
                </div>
                <p className="text-xs text-slate-500 mt-2">Add a profile picture</p>
              </div>

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
          ) : (
            <form onSubmit={handleVerify} className="space-y-6">
              <div className="text-center mb-4">
                <p className="text-slate-300">A 6-digit verification code has been sent to your email.</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Verification Code</label>
                <input
                  type="text"
                  maxLength="6"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                  className="input-field text-center text-2xl tracking-[1em] font-bold"
                  placeholder="000000"
                  required
                />
              </div>
              <button type="submit" className="btn-primary w-full py-3.5" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify Code'}
              </button>
              <button
                type="button"
                onClick={() => setShowVerification(false)}
                className="text-sm text-slate-400 hover:text-white w-full text-center transition-colors"
              >
                ← Back to registration
              </button>
            </form>
          )}

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