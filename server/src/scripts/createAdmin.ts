import bcrypt from 'bcryptjs';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { connectDatabase, disconnectDatabase } from '../config/database';
import { Admin } from '../models/Admin';

async function main() {
  await connectDatabase();
  const rl = readline.createInterface({ input, output });
  const name = (await rl.question('Name: ')).trim() || 'Admin';
  const email = (await rl.question('Email: ')).trim().toLowerCase();
  const password = (await rl.question('Password (min 8): ')).trim();
  rl.close();

  if (!email || password.length < 8) {
    throw new Error('Email and a password of at least 8 characters are required.');
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await Admin.findOneAndUpdate(
    { email },
    { name, email, passwordHash, role: 'owner', isActive: true },
    { upsert: true, new: true },
  );
  console.log(`Admin ready: ${email}`);
  await disconnectDatabase();
}

main().catch(async (error) => {
  console.error(error);
  await disconnectDatabase();
  process.exit(1);
});
