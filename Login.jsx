import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tag, Smartphone, KeyRound } from 'lucide-react';

export default function Login({ onLogin }) {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    
    if (phone.length < 10) {
      return setError('Please enter a valid 10-digit mobile number.');
    }

    try {
      const res = await fetch('http://localhost:5000/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      // Simulate receiving an SMS
      alert(`📱 SMS Received on ${phone}:\n\nYour PriceHunt OTP is: ${data.otp}`);
      
      setStep(2);
    } catch (err) {
      setError(err.message || 'Failed to send OTP');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      localStorage.setItem('auth_token', data.token);
      onLogin();
      navigate('/');
    } catch (err) {
      setError(err.message || 'Invalid OTP');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card glass-panel">
        <div className="login-logo">
          <Tag size={36} color="#3b82f6" />
          <h1>PriceHunt</h1>
        </div>
        <p className="login-subtitle">Find the Best Deals Across Platforms</p>
        
        {error && <div className="login-error">{error}</div>}

        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="login-form">
            <label>Mobile Number</label>
            <div className="input-group">
              <Smartphone size={20} className="input-icon" />
              <input 
                type="tel" 
                placeholder="Enter 10-digit number" 
                value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                maxLength={10}
                required
              />
            </div>
            <button type="submit" className="login-btn">Send OTP</button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="login-form">
            <label>Enter OTP sent to {phone}</label>
            <div className="input-group">
              <KeyRound size={20} className="input-icon" />
              <input 
                type="text" 
                placeholder="4-digit OTP" 
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                maxLength={4}
                required
              />
            </div>
            <button type="submit" className="login-btn">Verify & Proceed</button>
            <button type="button" className="text-btn" onClick={() => setStep(1)}>Change Number</button>
          </form>
        )}
      </div>
    </div>
  );
}
