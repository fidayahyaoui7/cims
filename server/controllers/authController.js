const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { sendVerificationEmail } = require('../services/emailService');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Register a new user
const register = async (req, res) => {
    const { email, password, firstName, lastName, phone, role } = req.body;
    
    try {
        // Validate input
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        
        // Check if user already exists
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: 'Email already in use' });
        }
        
        // Create new user
        const user = await User.create({
            email,
            password,
            firstName,
            lastName,
            phone,
            role: role || 'patient'
        });
        
        // Send verification email
        try {
            await sendVerificationEmail(user.email, user.verification_token);
        } catch (emailError) {
            console.error('Failed to send verification email:', emailError);
            // Continue even if email fails
        }
        
        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        // Remove sensitive data before sending response
        const { password_hash, verification_token, ...userData } = user;
        
        res.status(201).json({
            success: true,
            token,
            user: userData
        }); 
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error registering user',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Login user
const login = useCallback(async (email, password, userType = 'patient') => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock login for development
      console.log('Mock login with:', { email, userType });
      
      // Mock user data
      const mockUser = {
        id: 'dev-user-123',
        email: email || 'dev@example.com',
        name: 'Dev User',
        role: userType || 'patient',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
        joinDate: new Date().toLocaleDateString(),
        lastLogin: new Date().toLocaleString(),
        phone: '+216 12 345 678',
        address: '123 Main St, Tunis, Tunisia'
      };
      
      // Mock token
      const mockToken = 'dev-mock-token';
      
      // Store mock data
      localStorage.setItem('access', mockToken);
      localStorage.setItem('token', mockToken); // for backward compatibility
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      // Update state
      setUser(mockUser);
      
      // Redirect to dashboard
      const from = location.state?.from?.pathname || `/${userType}/dashboard`;
      navigate(from, { replace: true });
      
      return mockUser;
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Login failed. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [navigate, location.state?.from?.pathname]);

// Verify email
const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;
        const isVerified = await User.verifyUser(token);
        
        if (!isVerified) {
            return res.status(400).json({ 
                success: false,
                message: 'Invalid or expired verification token' 
            });
        }
        
        res.json({ 
            success: true, 
            message: 'Email verified successfully' 
        });
        
    } catch (error) {
        console.error('Email verification error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error verifying email',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get current user profile
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            });
        }
        
        // Return user data without sensitive information
        const { password_hash, verification_token, ...userData } = user;
        res.json({
            success: true,
            user: userData
        });
        
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error fetching user profile',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ 
            success: false,
            message: 'Access token is required' 
        });
    }
    
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ 
                success: false,
                message: 'Invalid or expired token' 
            });
        }
        
        // Add user info to request object
        req.user = decoded;
        next();
    });
};

// Middleware to check user role
const authorizeRole = (roles = []) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }
        
        if (roles.length && !roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to access this resource'
            });
        }
        
        next();
    };
};

module.exports = {
    register,
    login,
    verifyEmail,
    getProfile,
    authenticateToken,
    authorizeRole
};
