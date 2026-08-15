# Microservices Project

Node.js microservices architecture with API Gateway, Auth, Task, Media, and Workflow services using Express, TypeScript, PostgreSQL, Kafka, and AWS S3.

## 🏗️ Architecture

- **API Gateway** (Port 3000) → Routes to microservices
- **Auth Service** (Port 3001) → Authentication & JWT
- **Task Service** (Port 3002) → Task management
- **Media Service** (Port 3003) → File uploads & AWS S3
- **Workflow Service** (Port 3004) → Workflow events
- **Kafka** → Message broker
- **PostgreSQL** → Database

## 📋 Prerequisites

- Node.js v18+
- PostgreSQL 14+
- Docker & Docker Compose
- AWS S3 credentials (optional)

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Create .env file with required variables
DATABASE_URL=postgresql://user:password@localhost:5432/microservices_db
GATEWAY_SECRET=your-gateway-secret
JWT_SECRET=your-jwt-secret
KAFKA_BROKERS=localhost:9092

# Start Kafka
npm run kafka:up

# Run database migrations
npm run db:migrate

# Start services (in separate terminals)
npm run dev:gateway    # API Gateway (3000)
npm run dev:auth       # Auth Service (3001)
npm run dev:task       # Task Service (3002)
npm run dev:media      # Media Service (3003)
npm run dev:workflow   # Workflow Service (3004)
```

## 📁 Project Structure

```
microservices/
├── apps/
│   ├── api-gateway/              # Routes & RBAC
│   ├── auth-service/             # Authentication & JWT
│   ├── task-service/             # Task management
│   ├── media-service/            # File uploads & S3
│   └── workflow-service/         # Workflow events
├── packages/shared/              # Auth, DB, Kafka, Logging, Validation
├── docker/docker-compose.yml     # Kafka setup
├── sql/                          # Database migrations
└── scripts/db-migrate.ts         # Migration runner
```

## 🔌 Key Endpoints

- `POST /auth/register` - Register user
- `POST /auth/login` - Login
- `GET/POST /tasks` - Task management
- `POST /media/upload` - Upload file
- `GET /tasks/:taskId/workflows` - Workflow history

## 🔧 Common Commands

```bash
# Kafka management
npm run kafka:up      # Start Kafka
npm run kafka:down    # Stop Kafka
npm run kafka:logs    # View Kafka logs

# Database
npm run db:migrate    # Run migrations
```

## 🆘 Troubleshooting

**Kafka issues:** `npm run kafka:logs` then restart with `npm run kafka:down && npm run kafka:up`

**Database issues:** Check `.env` and run `npm run db:migrate`

**Port conflicts:** Ensure ports 3000-3004 are available
