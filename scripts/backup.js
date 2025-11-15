require('dotenv').config();
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const backupDir = path.join(__dirname, '../backups');
if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir);

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupFile = `${backupDir}/backup-${timestamp}.gz`;

console.log('Memulai backup...');
exec(`mongodump --uri="${process.env.MONGO_URI}" --archive=${backupFile} --gzip`, (err, stdout) => {
  if (err) {
    console.error('Backup GAGAL:', err);
    process.exit(1);
  }
  console.log(`Backup BERHASIL: ${backupFile}`);
  console.log(`Ukuran: ${(fs.statSync(backupFile).size / 1024 / 1024).toFixed(2)} MB`);
  process.exit(0);
});
