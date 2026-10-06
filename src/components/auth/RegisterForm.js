import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    userType: 'patient',
    dateOfBirth: '',
    gender: '',
    address: '',
    speciality: '',
    license: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords don't match");
    }

    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    // Extra validation for doctors
    if (formData.userType === 'doctor') {
      if (!formData.speciality.trim() || !formData.license.trim()) {
        return setError('Speciality and license are required for doctors');
      }
    }

    setLoading(true);

    try {
      // Prepare user data mapped to backend expectations
      const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim();
      const userData = {
        name: fullName,
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        type: formData.userType,
      };

      if (formData.userType === 'doctor') {
        userData.speciality = formData.speciality.trim();
        userData.license = formData.license.trim();
      }

      try {
        // The register function in AuthContext will handle the redirection
        await register(userData);
        // No need for navigation here as it's handled in the AuthContext
      } catch (error) {
        console.error('Registration error:', error);
        setError(error.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create an account. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <h2>Create an Account</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              placeholder="First name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              placeholder="Last name"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone number (optional)"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Create a password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm password"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="userType">I am a</label>
            <select
              id="userType"
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="patient">Patient</option>
              <option value="doctor">Healthcare Professional</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="gender">Gender</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="form-select"
            >
              <option value="">Prefer not to say</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {formData.userType === 'doctor' && (
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="speciality">Speciality</label>
              <input
                type="text"
                id="speciality"
                name="speciality"
                value={formData.speciality}
                onChange={handleChange}
                required
                placeholder="e.g., Cardiology"
              />
            </div>

            <div className="form-group">
              <label htmlFor="license">License Number</label>
              <input
                type="text"
                id="license"
                name="license"
                value={formData.license}
                onChange={handleChange}
                required
                placeholder="e.g., DOC123456"
              />
            </div>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="dateOfBirth">Date of Birth</label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">Address</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Your address (optional)"
          />
        </div>

        <div className="form-group terms">
          <input type="checkbox" id="terms" required />
          <label htmlFor="terms">
            I agree to the <a href="/terms" target="_blank" rel="noopener noreferrer">Terms of Service</a> and <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
          </label>
        </div>

        <div className="form-group">
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </div>

        <div className="auth-links">
          <span>Already have an account? <Link to="/login">Sign In</Link></span>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
