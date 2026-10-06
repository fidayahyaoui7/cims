# Medical Platform API

This is the backend API for the Medical Platform application, built with Node.js, Express, TypeScript, and PostgreSQL. It provides RESTful endpoints for managing users, threads, messages, and file uploads, along with real-time communication using WebSockets.

## Features

- User authentication and authorization
- Real-time messaging with WebSockets
- File uploads with S3-compatible storage (MinIO)
- RESTful API endpoints
- TypeScript for type safety
- PostgreSQL for data persistence
- Docker support

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- MinIO (or AWS S3)
- Docker (optional)

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd mon-app/api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up the database

1. Create a PostgreSQL database named `medPlatform`
2. Run the SQL script to create the schema:

```bash
psql -U postgres -d medPlatform -f sql/schema.sql
```

### 4. Configure environment variables

Copy the example environment file and update the values:

```bash
cp .env.example .env
```

### 5. Start the development server

```bash
npm run dev
```

The API will be available at `http://localhost:4000`

## API Documentation

### Authentication

All endpoints (except `/health`) require authentication. Include the JWT token in the `Authorization` header:

```
Authorization: Bearer <token>
```

### Endpoints

#### Health Check

- `GET /health` - Check if the API is running

#### Threads

- `GET /api/threads` - Get all threads
- `POST /api/threads` - Create a new thread
- `GET /api/threads/:id` - Get a thread by ID
- `PATCH /api/threads/:id` - Update a thread

#### Messages

- `POST /api/messages/:threadId` - Send a message in a thread
- `GET /api/messages/thread/:threadId` - Get messages in a thread
- `PUT /api/messages/:messageId` - Update a message
- `DELETE /api/messages/:messageId` - Delete a message

#### Uploads

- `POST /api/uploads` - Upload a file
- `GET /api/uploads/presigned-url` - Get a presigned URL for direct upload
- `GET /api/uploads` - List uploaded files
- `DELETE /api/uploads/:key` - Delete a file

## WebSocket Events

The WebSocket server is available at `/ws` and supports the following events:

- `joinThread` - Join a thread room
- `newMessage` - Receive new messages in real-time
- `updateMessage` - Receive message updates
- `deleteMessage` - Receive message deletions

## Running with Docker

1. Build the Docker image:

```bash
docker build -t medPlatform-api .
```

2. Run the container:

```bash
docker run -p 4000:4000 --env-file .env medPlatform-api
```

## Development

### Linting

```bash
npm run lint
```

### Testing

```bash
npm test
```

### Building for Production

```bash
npm run build
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Port to run the server on | `4000` |
| `NODE_ENV` | Node environment | `development` |
| `DATABASE_URL` | PostgreSQL connection URL | `postgresql://med:medpwd@localhost:5432/medPlatform` |
| `JWT_SECRET` | Secret for signing JWTs | `your_jwt_secret_here` |
| `JWT_ISSUER` | JWT issuer | `http://localhost:4000` |
| `JWT_AUDIENCE` | JWT audience | `http://localhost:3000` |
| `JWT_EXPIRES_IN` | JWT expiration time | `24h` |
| `S3_ENDPOINT` | S3-compatible storage endpoint | `http://localhost:9000` |
| `S3_ACCESS_KEY` | S3 access key | `minio` |
| `S3_SECRET_KEY` | S3 secret key | `minio123` |
| `STORAGE_BUCKET` | S3 bucket name | `uploads` |
| `S3_PUBLIC_URL` | Public URL for uploaded files | `http://localhost:9000/uploads` |
| `CORS_ORIGIN` | Allowed CORS origins | `http://localhost:3000` |
| `LOG_LEVEL` | Logging level | `debug` |
| `WS_PATH` | WebSocket path | `/ws` |
| `FRONTEND_URL` | Frontend URL for CORS and redirects | `http://localhost:3000` |

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
