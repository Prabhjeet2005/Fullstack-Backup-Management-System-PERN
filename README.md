# 🛡️ Secure Backup Management System
A full-stack solution for secure, automated PostgreSQL backups. This system features an intuitive interface for on-demand snapshots, scheduled backups, 
and auditing with role-based access control.

```https://fullstack-backup-management-system-flame.vercel.app/ ```

# ✨ Key Features
- 🔑 Secure Authentication: JWT-based authentication for authorized user access.
- 👤 Role-Based Access Control (RBAC): Distinct permissions for Admins (full control) and Auditors (view-only).
- 📦 On-Demand Snapshots: Admins can instantly create encrypted PostgreSQL backups using pg_dump.
- 🔐 AES-256 Encryption: All backup files are encrypted with a strong symmetric-key algorithm to ensure data privacy.
- ⏰ Flexible Backup Scheduler: Admins can configure automated backups to run daily, weekly, or monthly.
- 🔍 Audit Trail: A comprehensive log of all backup activities is available for auditing purposes.
- 🚀 Intuitive UI: A clean and responsive user interface built with React.
- 🛠️ Tech Stack & Architecture
- This project is built on the PERN stack for a high-performance and scalable application.
- Area Technology
- Frontend React.js
- Backend Node.js 
## How It Works
- Trigger: An Admin initiates a manual or scheduled backup.
- Snapshot: The server runs pg_dump to create a .sql database snapshot.
- Encryption: The snapshot is encrypted using AES-256-GCM with a secret key.
- Storage: The encrypted file is stored in a secure location (e.g., cloud storage).
- Logging: Backup metadata is saved to the database for the audit trail.
- Download: On request, the server decrypts the file and securely streams it to an authorized user.

# Roles & Permissions

The system uses two primary roles with a clear separation of duties.

## ROLES
- 👮 Admin
- 🕵️ Auditor

# Getting Started Locally
Follow these steps to run the project on your local machine.PrerequisitesNode.js (v18+)npm or yarnPostgreSQLInstallation & SetupClone the repository:git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
cd your-repo-name
- Setup Backend:cd server
- npm install
- Create a .env file in the server directory using the example below.Setup Frontend:cd ../client
npm install
- Create a .env.local file in the client directory with REACT_APP_API_URL=http://localhost:7000.
- Setup Database: Create a new PostgreSQL database and run any provided schema migrations.Run the application:In the server directory, run: npm startIn the client directory, run: npm startThe frontend will be available at http://localhost:3000 and the backend at http://localhost:7000.Environment Variables (.env)The backend .env file requires the following variables:# Server Configuration
- PORT=7000
- NODE_ENV=development
- CLIENT_URL=http://localhost:3000

# Database Connection
DATABASE_URL="postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE_NAME"

# Authentication
- JWT_SECRET="YOUR_SUPER_SECRET_JWT_KEY"
- JWT_EXPIRES_IN="1d"

# Encryption
- ENCRYPTION_SECRET_KEY="YOUR_32_CHARACTER_ENCRYPTION_SECRET"

# PG_DUMP Configuration (credentials for the database to be backed up)
- PG_HOST="TARGET_DB_HOST"
- PG_USER="TARGET_DB_USER"
- PG_PASSWORD="TARGET_DB_PASSWORD"
- PG_DATABASE="TARGET_DB_NAME"
- PG_PORT="5432"
