const { query } = require('../database/db');
const axios = require('axios');
const bcrypt = require('bcryptjs');

// Configuration
const BASE_URL = 'http://localhost:5000/api';
const TEST_EMAIL = `testuser_${Date.now()}@example.com`;
const TEST_PASSWORD = 'Test@1234';
let authToken = '';
let testHospitalId = null;

// Test helper functions
const testEndpoint = async (name, method, path, data = null, token = null) => {
  const config = {
    method,
    url: `${BASE_URL}${path}`,
    headers: {},
    validateStatus: () => true // Don't throw on HTTP error status
  };

  if (data) {
    config.data = data;
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  console.log(`\n[TEST] ${name}`);
  console.log(`${method} ${config.url}`);
  if (data) {
    console.log('Request:', JSON.stringify(data, null, 2));
  }

  const response = await axios(config);
  
  console.log(`Status: ${response.status}`);
  console.log('Response:', JSON.stringify(response.data, null, 2));
  
  return response;
};

// Clean up test data
const cleanupTestData = async () => {
  try {
    // Delete test user if exists
    await query('DELETE FROM users WHERE email LIKE $1', ['testuser_%@example.com']);
    
    // Delete test hospitals if any
    await query("DELETE FROM hospitals WHERE name LIKE 'Test Hospital%'");
    
    console.log('\n[INFO] Cleaned up test data');
  } catch (error) {
    console.error('Error cleaning up test data:', error);
  }
};

// Test suite
const runTests = async () => {
  console.log('Starting API tests...\n');

  try {
    // Clean up any existing test data
    await cleanupTestData();

    // 1. Test registration
    console.log('\n=== Testing Registration ===');
    const registerResponse = await testEndpoint(
      'Register new user',
      'post',
      '/auth/register',
      {
        name: 'Test User',
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
        phone: '1234567890',
        type: 'patient'
      }
    );

    if (registerResponse.status !== 201) {
      throw new Error('Registration failed');
    }

    authToken = registerResponse.data.data.token;
    console.log('✅ Registration successful');

    // 2. Test login
    console.log('\n=== Testing Login ===');
    const loginResponse = await testEndpoint(
      'Login with credentials',
      'post',
      '/auth/login',
      {
        email: TEST_EMAIL,
        password: TEST_PASSWORD
      }
    );

    if (loginResponse.status !== 200) {
      throw new Error('Login failed');
    }

    console.log('✅ Login successful');

    // 3. Test getting current user profile
    console.log('\n=== Testing User Profile ===');
    const profileResponse = await testEndpoint(
      'Get current user profile',
      'get',
      '/auth/me',
      null,
      authToken
    );

    if (profileResponse.status !== 200) {
      throw new Error('Failed to get user profile');
    }

    console.log('✅ User profile retrieved successfully');

    // 4. Test hospital endpoints
    console.log('\n=== Testing Hospital Endpoints ===');
    
    // Get all hospitals
    const hospitalsResponse = await testEndpoint(
      'Get all hospitals',
      'get',
      '/hospitals'
    );

    if (hospitalsResponse.status !== 200) {
      throw new Error('Failed to get hospitals');
    }

    console.log('✅ Retrieved hospitals list');

    // Get hospital types
    const typesResponse = await testEndpoint(
      'Get hospital types',
      'get',
      '/hospitals/types'
    );

    if (typesResponse.status !== 200) {
      throw new Error('Failed to get hospital types');
    }

    console.log('✅ Retrieved hospital types');

    // Get hospital services
    const servicesResponse = await testEndpoint(
      'Get hospital services',
      'get',
      '/hospitals/services/all'
    );

    if (servicesResponse.status !== 200) {
      throw new Error('Failed to get hospital services');
    }

    console.log('✅ Retrieved hospital services');

    // Get cities with hospitals
    const citiesResponse = await testEndpoint(
      'Get cities with hospitals',
      'get',
      '/hospitals/cities'
    );

    if (citiesResponse.status !== 200) {
      throw new Error('Failed to get cities with hospitals');
    }

    console.log('✅ Retrieved cities with hospitals');

    // Search hospitals
    const searchResponse = await testEndpoint(
      'Search hospitals',
      'get',
      '/hospitals/search?query=hospital'
    );

    if (searchResponse.status !== 200) {
      throw new Error('Failed to search hospitals');
    }

    console.log('✅ Hospital search successful');

    console.log('\n✅ All tests passed successfully!');
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  } finally {
    // Clean up test data
    await cleanupTestData();
    process.exit(0);
  }
};

// Run the tests
runTests();
