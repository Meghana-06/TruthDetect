import React, { useState, useRef, ChangeEvent, KeyboardEvent } from 'react';
import { User } from '../types';
import Modal from '../components/Modal';

interface RegistrationPageProps {
  onRegister: (email: string) => void;
  onSwitchToLogin: () => void;
  onLogin: (credentials: { googleUser?: Partial<User> }) => void;
}

const RegistrationPage: React.FC<RegistrationPageProps> = ({ onRegister, onSwitchToLogin, onLogin }) => {
  const [registrationType, setRegistrationType] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [error, setError] = useState('');
  const [registrationStep, setRegistrationStep] = useState<'details' | 'otp'>('details');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (registrationType === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (registrationType === 'phone' && !phone) {
        setError('Phone number is required.');
        return;
    }
    if (registrationType === 'phone' && !/^\+?[1-9]\d{1,14}$/.test(phone)) {
        setError('Please enter a valid phone number including country code (e.g., +1234567890).');
        return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    
    setIsSubmitting(true);
    // Simulate sending OTP
    setTimeout(() => {
        const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedOtp(newOtp);
        const destination = registrationType === 'email' ? email : phone;
        console.log(`Simulating OTP sent to ${destination}. OTP is ${newOtp}`);
        setRegistrationStep('otp');
        setIsOtpModalOpen(true);
        setIsSubmitting(false);
    }, 1500);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otp.join('');
    if (enteredOtp.length < 6) {
        setError('Please enter the full 6-digit OTP.');
        return;
    }
    
    setIsVerifying(true);
    // Simulate OTP verification
    setTimeout(() => {
        if (enteredOtp === generatedOtp) {
          setError('');
          if (registrationType === 'email') {
              onRegister(email);
          } else {
              onLogin({});
          }
        } else {
          setError('Invalid OTP. Please try again.');
          setIsVerifying(false);
        }
    }, 1500);
  };
  
  const handleGoogleLogin = () => {
    setIsGoogleLoading(true);
    setIsAuthModalOpen(true);
    setTimeout(() => {
        setIsAuthModalOpen(false);
        onLogin({ googleUser: { email: 'gia.lee.goog@example.com' } });
    }, 2500);
  };

  const handleOtpChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <>
    <Modal isOpen={isAuthModalOpen} onClose={() => {}} title="Connecting to Google">
        <div className="flex flex-col items-center justify-center p-4 text-center">
            <svg className="w-16 h-16 mb-4" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" /><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" /><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" /><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.23,4.142-4.064,5.541l6.19,5.238C39.712,35.619,44,29.567,44,24C44,22.659,43.862,21.35,43.611,20.083z" /></svg>
            <p className="mt-2 text-lg font-medium text-black dark:text-white">Authenticating with Google</p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Please wait while we securely connect to your account.</p>
            <div className="mt-6">
                <svg className="animate-spin h-8 w-8 text-black dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
        </div>
    </Modal>
    <Modal isOpen={isOtpModalOpen} onClose={() => setIsOtpModalOpen(false)} title="OTP Sent">
        <div className="text-center">
            <p className="text-gray-600 dark:text-gray-300 mb-4">For demonstration purposes, your One-Time Password is:</p>
            <p className="text-3xl font-bold tracking-widest bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">{generatedOtp}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">Please enter this code on the verification screen.</p>
        </div>
    </Modal>
    <div className="flex flex-col items-center justify-center text-center">
      <div className="max-w-4xl w-full bg-white/70 dark:bg-black/70 backdrop-blur-2xl rounded-2xl p-10 md:p-16 border border-gray-200 dark:border-gray-800 shadow-2xl">
        {registrationStep === 'details' ? (
          <>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-black dark:text-white">Create Your Account</h1>
            <div className="max-w-sm mx-auto">
              <div className="flex justify-center mb-4 border border-gray-300 dark:border-gray-700 rounded-lg p-1">
                <button onClick={() => setRegistrationType('email')} className={`w-1/2 py-2 rounded-md transition ${registrationType === 'email' ? 'bg-black text-white dark:bg-white dark:text-black' : 'text-gray-500'}`}>Email</button>
                <button onClick={() => setRegistrationType('phone')} className={`w-1/2 py-2 rounded-md transition ${registrationType === 'phone' ? 'bg-black text-white dark:bg-white dark:text-black' : 'text-gray-500'}`}>Phone</button>
              </div>
              <form onSubmit={handleDetailsSubmit}>
                {registrationType === 'email' ? (
                  <div className="mb-4">
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email Address" className="w-full px-4 py-3 bg-gray-200/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 rounded-lg text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition" />
                  </div>
                ) : (
                  <div className="mb-4">
                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone Number" className="w-full px-4 py-3 bg-gray-200/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 rounded-lg text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition" />
                  </div>
                )}
                <div className="mb-4">
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="w-full px-4 py-3 bg-gray-200/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 rounded-lg text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition" />
                </div>
                <div className="mb-6">
                  <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm Password" className="w-full px-4 py-3 bg-gray-200/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 rounded-lg text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition" />
                </div>
                {error && <p className="text-red-500 dark:text-red-400 text-sm mb-4">{error}</p>}
                <button type="submit" disabled={isSubmitting} className="w-full bg-black hover:bg-gray-800 text-white dark:bg-white dark:hover:bg-gray-200 dark:text-black font-bold py-3 px-4 rounded-lg transition duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                  {isSubmitting ? (
                      <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                          Processing...
                      </>
                  ) : (
                      "Continue"
                  )}
                </button>
              </form>
              <div className="my-6 flex items-center justify-center">
                <span className="w-full h-px bg-gray-300 dark:bg-gray-700"></span>
                <span className="mx-4 text-gray-500 dark:text-gray-400">OR</span>
                <span className="w-full h-px bg-gray-300 dark:bg-gray-700"></span>
              </div>
              <button onClick={handleGoogleLogin} disabled={isGoogleLoading} className="w-full bg-gray-100 hover:bg-gray-200 border border-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-700 text-black dark:text-white font-bold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                {isGoogleLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Signing up...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48" width="30px" height="30px"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" /><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" /><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" /><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.23,4.142-4.064,5.541l6.19,5.238C39.712,35.619,44,29.567,44,24C44,22.659,43.862,21.35,43.611,20.083z" /></svg>
                    Sign up with Google
                  </>
                )}
              </button>
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <button onClick={onSwitchToLogin} className="font-medium text-black dark:text-white underline hover:opacity-80">
                  Login here
                </button>
              </p>
            </div>
          </>
        ) : (
          <div className="max-w-sm mx-auto">
            <h1 className="text-3xl font-bold mb-4 text-black dark:text-white">Verify Your {registrationType === 'email' ? 'Email' : 'Phone'}</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Enter the 6-digit code we sent to {registrationType === 'email' ? email : phone}.
            </p>
            <form onSubmit={handleOtpSubmit}>
              <div className="flex justify-center space-x-2 mb-6">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={el => { if (el) otpInputRefs.current[index] = el; }}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOtpChange(e, index)}
                    onKeyDown={e => handleOtpKeyDown(e, index)}
                    className="w-12 h-12 text-center text-2xl font-bold bg-gray-200/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 rounded-lg text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"
                    autoComplete="one-time-code"
                  />
                ))}
              </div>
              {error && <p className="text-red-500 dark:text-red-400 text-sm mb-4">{error}</p>}
              <button type="submit" disabled={isVerifying} className="w-full bg-black hover:bg-gray-800 text-white dark:bg-white dark:hover:bg-gray-200 dark:text-black font-bold py-3 px-4 rounded-lg transition duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                {isVerifying ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Verifying...
                    </>
                ) : (
                    "Verify"
                )}
              </button>
            </form>
             <button onClick={() => setRegistrationStep('details')} className="mt-4 text-sm font-medium text-black dark:text-white underline hover:opacity-80">
                Back to details
            </button>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default RegistrationPage;