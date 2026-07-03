// src/utils/dbHelper.ts
// MySQL database utility class
// Used to verify data in database after UI actions
// Example: Add employee via UI → query DB → confirm record saved

import mysql, { Connection } from 'mysql2/promise';
import { ENV } from './env';

export class DBHelper {

  // conn holds the database connection
  // starts as null — means not connected yet
  private conn: Connection | null = null;

  // ── CONNECT ──────────────────────────────────────────────
  // Opens connection to MySQL database
  // Call this before running any query
  async connect(): Promise<void> {
    this.conn = await mysql.createConnection({
      host:     ENV.DB_HOST,  // where DB is running
      user:     ENV.DB_USER,  // DB username
      password: ENV.DB_PASS,  // DB password
      database: ENV.DB_NAME,  // which database to use
    });
    console.log('✅ Database connected successfully');
  }

  // ── QUERY ────────────────────────────────────────────────
  // Runs any SQL query and returns results
  // params = values to replace ? in SQL (prevents SQL injection)
  async query(sql: string, params: any[] = []): Promise<any[]> {

    // Safety check — make sure connect() was called first
    if (!this.conn) {
      throw new Error('DB not connected. Call connect() first.');
    }

    const [rows] = await this.conn.execute(sql, params);
    return rows as any[];
  }

  // ── GET EMPLOYEE BY NAME ─────────────────────────────────
  // Finds employee record in DB by first and last name
  // Used after adding employee via UI to verify it was saved
  async getEmployeeByName(
    firstName: string,
    lastName: string
  ): Promise<any> {
    const rows = await this.query(
      `SELECT * FROM hs_hr_employee
       WHERE emp_firstname = ?
       AND emp_lastname = ?`,
      [firstName, lastName]
    );
    return rows[0]; // return first matching record
  }

  // ── GET EMPLOYEE BY ID ───────────────────────────────────
  // Finds employee record in DB by employee ID
  async getEmployeeById(empId: string): Promise<any> {
    const rows = await this.query(
      `SELECT * FROM hs_hr_employee
       WHERE employee_id = ?`,
      [empId]
    );
    return rows[0];
  }

  // ── DISCONNECT ───────────────────────────────────────────
  // Closes DB connection after tests finish
  // Always call this in AfterAll hook
  async disconnect(): Promise<void> {
    await this.conn?.end();
    console.log('✅ Database disconnected');
  }
}