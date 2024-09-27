import { connect, Schema, model } from 'mongoose';
import { join } from 'path';
import { config } from 'dotenv';
config({ path: join(__dirname, '../.env') });
import * as admin from 'firebase-admin';
import { randomFillSync } from 'node:crypto';

const generatePassword = (
  length = 30,
  characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@',
) =>
  Array.from(randomFillSync(new Uint32Array(length)))
    .map((x) => characters[x % characters.length])
    .join('');

const password = generatePassword();

export async function create_admin_user(
  firebaseApp: admin.app.App,
  adminEmail: string,
) {
  if (adminEmail === undefined || adminEmail === '') {
    console.log('Please provide an admin email address in the .env file');
    return;
  }

  const user = await firebaseApp
    .auth()
    .createUser({
      email: adminEmail,
      emailVerified: false,
      password: password,
      disabled: false,
    })
    .catch((error) => {
      if (error.code === 'auth/email-already-exists') {
        return firebaseApp.auth().getUserByEmail(adminEmail);
      }
    });

  if (!user) {
    return;
  }

  await firebaseApp.auth().setCustomUserClaims(user.uid, {
    admin: true,
  });

  await connect(process.env.MONGO_URL!, {
    dbName: process.env.MONGO_DB_NAME,
  });

  const UserSchema = new Schema({
    projects: [],
    humans: [],
    contracts: [],
    timesheets: [],
    email: String,
    role: String,
    uid: String,
  });
  const User = model('User', UserSchema);

  //Check if user already exists
  const existing = await User.findOne({ email: adminEmail });

  if (existing) {
    console.log(`Admin user already exists with email: ${adminEmail}`);
    return;
  }

  await User.create({
    projects: [],
    humans: [],
    contracts: [],
    timesheets: [],
    email: adminEmail,
    role: 'admin',
    uid: user.uid,
  });

  console.log(`Admin user created with email: ${adminEmail}`);
  return;
}

module.exports = { create_admin_user };
