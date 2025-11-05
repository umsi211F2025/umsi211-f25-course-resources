// Script to initialize and seed the SQLite database
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'survey.db');
const schemaPath = path.join(__dirname, 'schema.sql');
const seedPath = path.join(__dirname, 'seed.sql');

const db = new sqlite3.Database(dbPath);

const runSqlFile = (filePath) => {
  const sql = fs.readFileSync(filePath, 'utf8');
  return new Promise((resolve, reject) => {
    db.exec(sql, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

(async () => {
  try {
    await runSqlFile(schemaPath);
    await runSqlFile(seedPath);
    console.log('Database initialized and seeded.');
    db.close();
  } catch (err) {
    console.error('Error initializing DB:', err);
    db.close();
    process.exit(1);
  }
})();
