# PostgreSQL Database Setup

This directory contains the PostgreSQL database configuration and setup for the medical platform application.

## Prerequisites

1. Install PostgreSQL (version 12 or higher)
2. Install Node.js (version 14 or higher)
3. Install the required npm packages:
   ```bash
   npm install pg dotenv
   ```

## Setup Instructions

1. **Install PostgreSQL**
   - Download and install PostgreSQL from [postgresql.org](https://www.postgresql.org/download/)
   - Note down the password you set for the 'postgres' superuser

2. **Create a new database**
   ```bash
   psql -U postgres -c "CREATE DATABASE medical_platform;"
   ```

3. **Set up environment variables**
   Create a `.env` file in your server directory with the following content:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=medical_platform
   DB_USER=postgres
   DB_PASSWORD=your_postgres_password
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```

4. **Initialize the database**
   ```bash
   # Connect to PostgreSQL
   psql -U postgres -d medical_platform -f server/database/schema.sql
   ```

## Database Schema

The database includes the following tables:

- `users`: Stores user accounts (patients, doctors, admins)
- `cities`: List of cities and regions
- `hospitals`: Hospital information
- `services`: Medical services offered
- `hospital_services`: Many-to-many relationship between hospitals and services
- `patient`: Patient-specific information
- `medecin`: Doctor-specific information
- `appointments`: Patient appointments with doctors
- `consultation`: Consultation details and notes
- `messages`: Private messages between users
- `radiology_results`: Radiology test results

## Using the Database in Your Application

### Basic Query Example

```javascript
const db = require('./server/database/db');

// Example: Get all users
async function getUsers() {
  try {
    const users = await db.getAll('SELECT * FROM users');
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

// Example: Get a single user by email
async function getUserByEmail(email) {
  try {
    const user = await db.getOne('SELECT * FROM users WHERE email = $1', [email]);
    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}
```

### Transaction Example

```javascript
const db = require('./server/database/db');

async function createUserWithProfile(userData, profileData) {
  const client = await db.beginTransaction();
  
  try {
    // Insert user
    const userResult = await client.query(
      'INSERT INTO users (name, email, password_hash, type) VALUES ($1, $2, $3, $4) RETURNING id',
      [userData.name, userData.email, userData.passwordHash, userData.type]
    );
    
    const userId = userResult.rows[0].id;
    
    // Insert profile
    await client.query(
      'INSERT INTO patient (user_id, date_of_birth, gender) VALUES ($1, $2, $3)',
      [userId, profileData.dateOfBirth, profileData.gender]
    );
    
    // Commit the transaction
    await db.commitTransaction(client);
    return userId;
  } catch (error) {
    // Rollback in case of error
    await db.rollbackTransaction(client);
    throw error;
  }
}
```

## Database Management

### Backing Up the Database

```bash
pg_dump -U postgres -d medical_platform > medical_platform_backup.sql
```

### Restoring the Database

```bash
psql -U postgres -d medical_platform < medical_platform_backup.sql
```

## Testing the Connection

```bash
node -e "require('./server/database/db').testConnection().then(() => process.exit()).catch(() => process.exit(1));"
```

## Default Users

The database comes with these default users:

- **Admin**: email: `admin@example.com`, password: `admin123`
- **Doctor**: email: `doctor@example.com`, password: `doctor123`
- **Patient**: email: `patient@example.com`, password: `patient123`

## Troubleshooting

- **Connection refused**: Make sure PostgreSQL is running and the credentials in `.env` are correct
- **Permission denied**: Ensure the database user has the correct permissions
- **Table does not exist**: Make sure you've run the schema.sql script

For more information, refer to the [PostgreSQL documentation](https://www.postgresql.org/docs/).
