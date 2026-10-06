# Database Setup Guide

## Overview

This project now includes a complete backend database system with SQLite to replace all hardcoded data. The database includes:

- **Users** (patients and doctors)
- **Cities** and regions
- **Medical Centers** with services
- **Appointments** with booking system
- **Authentication** with JWT tokens

## Database Schema

### Tables

1. **users** - User accounts (patients, doctors, admins)
2. **cities** - Cities with regions and coordinates
3. **medical_centers** - Medical facilities with details
4. **services** - Available medical services
5. **center_services** - Many-to-many relationship between centers and services
6. **doctors** - Doctor profiles linked to users and centers
7. **appointments** - Booking system for appointments

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Backend Server

```bash
npm run server
```

The server will start on `http://localhost:5000` and automatically:
- Create the SQLite database file (`server/database/medical_centers.db`)
- Initialize all tables
- Insert sample data

### 3. Start the Frontend

In a new terminal:

```bash
npm start
```

Or run both together:

```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Cities
- `GET /api/cities` - Get all cities
- `GET /api/cities/:id` - Get city by ID
- `GET /api/cities/name/:name` - Get city by name
- `GET /api/cities/region/:region` - Get cities by region
- `GET /api/cities/regions/all` - Get all regions

### Medical Centers
- `GET /api/centers` - Get all centers
- `GET /api/centers/:id` - Get center by ID
- `GET /api/centers/city/:cityName` - Get centers by city
- `GET /api/centers/service/:serviceName` - Get centers by service
- `GET /api/centers/nearby/:lat/:lng` - Get nearby centers
- `GET /api/centers/services/all` - Get all services
- `PUT /api/centers/:id/rating` - Update center rating

### Appointments
- `GET /api/appointments` - Get user's appointments
- `GET /api/appointments/:id` - Get appointment by ID
- `POST /api/appointments` - Create new appointment
- `PUT /api/appointments/:id/status` - Update appointment status
- `DELETE /api/appointments/:id` - Cancel appointment
- `GET /api/appointments/slots/:doctorId/:date` - Get available time slots
- `GET /api/appointments/doctor/:doctorId` - Get doctor's appointments

### Users
- `GET /api/users/doctors` - Get all doctors
- `GET /api/users/doctors/:id` - Get doctor by ID
- `GET /api/users/doctors/center/:centerId` - Get doctors by center
- `GET /api/users/doctors/specialty/:specialty` - Get doctors by specialty
- `GET /api/users/specialties` - Get all specialties
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/appointments` - Get user's appointments
- `GET /api/users/doctor/appointments` - Get doctor's appointments

## Sample Data

The database comes pre-populated with:

### Cities
- Tunis (North)
- Bizerte (North)
- Sousse (Central)
- Sfax (South)
- Le Kef (North)

### Medical Centers
- Medical Center Principal - Tunis
- Health Center - La Marsa
- Medical Center Principal - Sousse
- Health Center - Hammam Sousse
- Medical Center Principal - Le Kef

### Services
- General Medicine
- Cardiology
- Pediatrics
- Gynecology
- Dermatology
- Ophthalmology
- Orthopedics
- Neurology
- Pulmonology
- Gastroenterology
- Emergency

## Frontend Integration

The frontend has been updated to use the API instead of hardcoded data:

### API Service (`src/services/api.js`)
- Centralized API calls
- Authentication token management
- Error handling

### Updated Components
- `HomePage.js` - Now fetches cities from database
- `CityPage.js` - Now fetches medical centers from database
- Authentication components use real backend

## Adding New Data

### Add a New City
```sql
INSERT INTO cities (name, region, description, latitude, longitude) 
VALUES ('New City', 'north', 'Description', 36.0, 10.0);
```

### Add a New Medical Center
```sql
INSERT INTO medical_centers (name, city_id, address, phone, latitude, longitude, hours, rating) 
VALUES ('New Center', 1, 'Address', '+216 71 000 000', 36.0, 10.0, '8h-18h', 4.5);
```

### Add a New Service
```sql
INSERT INTO services (name, description) 
VALUES ('New Service', 'Description');
```

### Link Service to Center
```sql
INSERT INTO center_services (center_id, service_id) 
VALUES (1, 1);
```

## Environment Variables

Create a `.env` file in the server directory:

```env
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

## Database File Location

The SQLite database file is created at:
`server/database/medical_centers.db`

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation
- SQL injection prevention
- CORS configuration

## Production Considerations

1. **Database**: Consider using PostgreSQL or MySQL for production
2. **Environment Variables**: Use proper secrets management
3. **HTTPS**: Enable HTTPS in production
4. **Rate Limiting**: Add rate limiting for API endpoints
5. **Logging**: Add proper logging
6. **Backup**: Set up database backups

## Troubleshooting

### Database Connection Issues
- Check if the server directory exists
- Ensure write permissions in the server directory
- Check console for database initialization errors

### API Connection Issues
- Verify the server is running on port 5000
- Check CORS configuration
- Ensure the API base URL is correct in `src/services/api.js`

### Authentication Issues
- Check JWT secret configuration
- Verify token storage in localStorage
- Check token expiration

## Next Steps

1. **Add More Data**: Populate the database with more cities, centers, and doctors
2. **User Management**: Add admin panel for managing users
3. **Advanced Booking**: Add recurring appointments, waitlists
4. **Notifications**: Add email/SMS notifications
5. **Reviews**: Add patient reviews and ratings
6. **Analytics**: Add usage analytics and reporting 