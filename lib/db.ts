import fs from 'fs';
import path from 'path';
import { sql } from '@vercel/postgres';
import { LessonPlan } from '@/types/plan';

export interface UserRecord {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  branch: string;
  createdAt: string;
}

export interface SavedPlanRecord {
  id: string;
  userId: string;
  title: string;
  subject: string;
  grade: string;
  planJson: LessonPlan;
  createdAt: string;
}

const DEV_DB_FILE = path.join('/tmp', 'masa5_dev_db.json');

interface LocalDbSchema {
  users: UserRecord[];
  savedPlans: SavedPlanRecord[];
}

function getLocalDb(): LocalDbSchema {
  try {
    if (fs.existsSync(DEV_DB_FILE)) {
      const data = fs.readFileSync(DEV_DB_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Local db read error:', e);
  }
  return { users: [], savedPlans: [] };
}

function saveLocalDb(data: LocalDbSchema) {
  try {
    fs.writeFileSync(DEV_DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('Local db write error:', e);
  }
}

// Detect if Vercel Postgres is configured
const hasPostgres = Boolean(
  process.env.POSTGRES_URL || process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL
);

let postgresInitialized = false;

async function ensurePostgresTables() {
  if (!hasPostgres || postgresInitialized) return;
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(64) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        name VARCHAR(255) NOT NULL,
        branch VARCHAR(100),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS saved_plans (
        id VARCHAR(64) PRIMARY KEY,
        user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        subject VARCHAR(100),
        grade VARCHAR(50),
        plan_json JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    postgresInitialized = true;
  } catch (err) {
    console.warn('Vercel Postgres table initialization error (will fallback to local store if needed):', err);
  }
}

export async function findUserByEmail(email: string): Promise<UserRecord | null> {
  const normalizedEmail = email.toLowerCase().trim();

  if (hasPostgres) {
    try {
      await ensurePostgresTables();
      const { rows } = await sql`
        SELECT id, email, password_hash as "passwordHash", name, branch, created_at as "createdAt"
        FROM users
        WHERE LOWER(email) = ${normalizedEmail}
        LIMIT 1;
      `;
      if (rows.length > 0) return rows[0] as UserRecord;
    } catch (e) {
      console.warn('Postgres query error, checking fallback store:', e);
    }
  }

  // Local fallback
  const db = getLocalDb();
  return db.users.find((u) => u.email.toLowerCase() === normalizedEmail) || null;
}

export async function createUser(user: UserRecord): Promise<UserRecord> {
  if (hasPostgres) {
    try {
      await ensurePostgresTables();
      await sql`
        INSERT INTO users (id, email, password_hash, name, branch, created_at)
        VALUES (${user.id}, ${user.email}, ${user.passwordHash}, ${user.name}, ${user.branch}, ${user.createdAt})
        ON CONFLICT (email) DO NOTHING;
      `;
      return user;
    } catch (e) {
      console.warn('Postgres insert error, saving to fallback store:', e);
    }
  }

  // Local fallback
  const db = getLocalDb();
  db.users.push(user);
  saveLocalDb(db);
  return user;
}

export async function findUserById(id: string): Promise<UserRecord | null> {
  if (hasPostgres) {
    try {
      await ensurePostgresTables();
      const { rows } = await sql`
        SELECT id, email, password_hash as "passwordHash", name, branch, created_at as "createdAt"
        FROM users
        WHERE id = ${id}
        LIMIT 1;
      `;
      if (rows.length > 0) return rows[0] as UserRecord;
    } catch (e) {
      console.warn('Postgres query error, checking fallback store:', e);
    }
  }

  const db = getLocalDb();
  return db.users.find((u) => u.id === id) || null;
}

export async function savePlanForUser(record: SavedPlanRecord): Promise<SavedPlanRecord> {
  if (hasPostgres) {
    try {
      await ensurePostgresTables();
      await sql`
        INSERT INTO saved_plans (id, user_id, title, subject, grade, plan_json, created_at)
        VALUES (${record.id}, ${record.userId}, ${record.title}, ${record.subject}, ${record.grade}, ${JSON.stringify(record.planJson)}, ${record.createdAt});
      `;
      return record;
    } catch (e) {
      console.warn('Postgres plan insert error, saving to fallback store:', e);
    }
  }

  const db = getLocalDb();
  db.savedPlans.unshift(record);
  saveLocalDb(db);
  return record;
}

export async function getPlansForUser(userId: string): Promise<SavedPlanRecord[]> {
  if (hasPostgres) {
    try {
      await ensurePostgresTables();
      const { rows } = await sql`
        SELECT id, user_id as "userId", title, subject, grade, plan_json as "planJson", created_at as "createdAt"
        FROM saved_plans
        WHERE user_id = ${userId}
        ORDER BY created_at DESC;
      `;
      return rows as SavedPlanRecord[];
    } catch (e) {
      console.warn('Postgres get plans error, checking fallback store:', e);
    }
  }

  const db = getLocalDb();
  return db.savedPlans.filter((p) => p.userId === userId);
}

export async function deletePlanForUser(userId: string, planId: string): Promise<boolean> {
  if (hasPostgres) {
    try {
      await ensurePostgresTables();
      await sql`
        DELETE FROM saved_plans
        WHERE id = ${planId} AND user_id = ${userId};
      `;
      return true;
    } catch (e) {
      console.warn('Postgres delete plan error, checking fallback store:', e);
    }
  }

  const db = getLocalDb();
  const index = db.savedPlans.findIndex((p) => p.id === planId && p.userId === userId);
  if (index !== -1) {
    db.savedPlans.splice(index, 1);
    saveLocalDb(db);
    return true;
  }
  return false;
}
