const mongoose = require('mongoose');
require('dotenv').config()
const admin = require("firebase-admin");
const crypto = require('node:crypto');

const adminEmail = ''

const generatePassword = (
    length = 30,
    characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@'
  ) =>
    Array.from(crypto.randomFillSync(new Uint32Array(length)))
      .map((x) => characters[x % characters.length])
      .join('')

const password = generatePassword()

run().catch(error => console.log(error.stack));

async function run() {
    const firebaseApp = admin.initializeApp({
        credential: admin.credential.cert('../private_key.json'),
     });
    
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
           return firebaseApp
              .auth()
              .getUserByEmail(adminEmail);
        }
     });

    await mongoose.connect(process.env.MONGO_URL);

    const UserSchema = new mongoose.Schema({
        projects: [],
        humans: [],
        wps: [],
        contracts: [],
        email: String,
        role: String,
        uid: String
    });
    const User = mongoose.model('User', UserSchema);

    User.create({
        projects: [],
        humans: [],
        wps: [],
        contracts: [],
        email: adminEmail,
        role: "admin",
        uid: user.uid
    })
}