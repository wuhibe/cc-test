# Coaching Central API

A NestJS-based API service that provides AI-powered comment reply suggestions and manages reply examples. The service uses OpenAI for generating contextual responses and includes vector similarity search for finding relevant reply examples.

## Features

- AI-powered comment reply suggestions
- Vector similarity search for finding relevant examples
- Example management system
- Swagger API documentation
- PostgreSQL database integration with Prisma ORM
- Input validation and sanitization

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- OpenAI API key

## Installation

1. Clone the repository:

```bash
git clone https://github.com/wuhibe/cc-test
cd cc-test
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/your_database"
OPENAI_API_KEY="your-openai-api-key"
PORT=3000
```

4. Initialize the database:

```bash
npx prisma migrate dev
```

## Running the Project

### Development Mode

```bash
# Watch mode
npm run start:dev

# Debug mode
npm run start:debug
```

### Production Mode

```bash
# Build the project
npm run build

# Start production server
npm run start:prod
```

### Testing

```bash
# e2e tests
npm run test:e2e
```

## API Documentation

Once the application is running, you can access the Swagger API documentation at:

```
http://localhost:3000/api
```

## Database Schema

The project uses a PostgreSQL database with the following main table:

- `reply_examples`: Stores example comments and replies with vector embeddings

## Next Steps

1. **Authentication & Authorization**
   - Implement JWT authentication
   - Add role-based access control

2. **Rate Limiting**
   - Add rate limiting for API endpoints
   - Implement request throttling

3. **Caching**
   - Add Redis caching for frequently accessed data
   - Implement response caching

4. **Monitoring & Logging**
   - Set up application monitoring
   - Implement structured logging
   - Add error tracking

5. **Testing**
   - Increase test coverage
   - Add integration tests
   - Implement load testing
