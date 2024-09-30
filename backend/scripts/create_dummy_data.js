// dummyData.js
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const admin = require('firebase-admin');
const crypto = require('node:crypto');

const generatePassword = (
  length = 30,
  characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@',
) =>
  Array.from(crypto.randomFillSync(new Uint32Array(length)))
    .map((x) => characters[x % characters.length])
    .join('');

// 1. Define Mongoose Models

// Interval Schema
const IntervalSchema = new mongoose.Schema({
  startDate: { type: String, required: true },
  duration: { type: Number, required: true },
});

// Work Package (Wp) Schema
const WpSchema = new mongoose.Schema({
  title: { type: String, required: true },
  activeIntervals: { type: [IntervalSchema], default: [] },
});
const Wp = mongoose.model('Wp', WpSchema);

// Project Schema
const ProjectSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  wps: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Wp', required: true }],
  interval: { type: IntervalSchema, required: true },
});
const Project = mongoose.model('Project', ProjectSchema);

// Human Schema
const HumanSchema = new mongoose.Schema({
  lastName: { type: String, required: true },
  firstName: { type: String, required: true },
  vat: { type: String, required: true },
});
const Human = mongoose.model('Human', HumanSchema);

// Contract Schema
const ContractSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  human: { type: mongoose.Schema.Types.ObjectId, ref: 'Human', required: true },
  wps: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Wp', required: true }],
  interval: { type: IntervalSchema, required: true },
  hourlyRate: { type: Number, required: true },
  totalCost: { type: Number, required: true },
});
const Contract = mongoose.model('Contract', ContractSchema);

// Day Schema
const WorkPackageSchema = new mongoose.Schema({
  wp: { type: WpSchema, required: true },
  hours: { type: Number, required: true },
});

const DaySchema = new mongoose.Schema({
  date: { type: String, required: true },
  workPackages: { type: [WorkPackageSchema], default: [] },
});

// Timesheet Schema
const TimesheetSchema = new mongoose.Schema({
  days: { type: [DaySchema], default: [] },
  contract: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contract',
    required: true,
  },
  timestamp_created: { type: String, required: true },
});
const Timesheet = mongoose.model('Timesheet', TimesheetSchema);

// User Schema
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  role: { type: String, required: true },
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
  humans: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Human' }],
  wps: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Wp' }],
  contracts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Contract' }],
  timesheets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Timesheet' }],
  uid: { type: String, required: true },
});
const User = mongoose.model('User', UserSchema);

// 2. Dummy Data Creation Functions

function createInterval(isWp = false) {
  //if it is a wp startDate should be in the format of MXX where XX is the month
  let startDate = faker.date.past().getTime().toString();

  if (isWp) {
    const month = faker.number.int({ min: 1, max: 12 });

    if (month < 10) {
      startDate = 'M0' + month;
    } else {
      startDate = 'M' + month;
    }
  }

  return {
    startDate: startDate,
    duration: faker.number.int({ min: 1, max: 12 }),
  };
}

function createWp() {
  return {
    title: faker.lorem.words(3),
    activeIntervals: [createInterval(true), createInterval(true)],
  };
}

function createProject() {
  return {
    id: faker.string.uuid(),
    title: faker.commerce.productName(),
    description: faker.lorem.sentences(),
    wps: [createWp(), createWp()],
    interval: createInterval(),
  };
}

function createHuman() {
  return {
    lastName: faker.person.lastName(),
    firstName: faker.person.firstName(),
    vat: faker.number.int({ min: 100000000, max: 999999999 }).toString(),
  };
}

function createContract(project, human) {
  //fill wps with random wps from the project
  return {
    project: project._id,
    human: human._id,
    wps: faker.helpers.arrayElements(project.wps),
    interval: createInterval(),
    hourlyRate: faker.number.float({ min: 20, max: 150 }),
    totalCost: faker.number.float({ min: 500, max: 10000 }),
  };
}

function createTimesheet(contract) {
  const days = [
    {
      date: faker.date.past().toISOString(),
      workPackages: [{ wp: createWp(), hours: 5 }],
    },
    {
      date: faker.date.past().toISOString(),
      workPackages: [{ wp: createWp(), hours: 3 }],
    },
  ];
  return {
    days,
    contract: contract._id,
    timestamp_created: faker.date.past().getTime().toString(),
  };
}

function createUser() {
  return {
    email: faker.internet.email(),
    role: faker.helpers.arrayElement(['Admin', 'User']),
    projects: [],
    humans: [],
    wps: [],
    contracts: [],
    timesheets: [],
  };
}

// 3. Main Function to Insert Dummy Data

async function insertDummyData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL, {
      dbName: process.env.MONGO_DB_NAME,
    });
    console.log('Connected to MongoDB');

    // Create and save Users
    const users = [];

    const firebaseApp = admin.initializeApp({
      credential: admin.credential.cert('../private_key.json'),
    });

    for (let i = 0; i < 5; i++) {
      //create new user
      const user = new User(createUser());

      const firebaseUser = await firebaseApp
        .auth()
        .createUser({
          email: user.email,
          emailVerified: false,
          password: generatePassword(),
          disabled: false,
        })
        .catch((error) => {
          if (error.code === 'auth/email-already-exists') {
            return firebaseApp.auth().getUserByEmail(adminEmail);
          }
        });

      if (!firebaseUser) {
        continue;
      }

      user.uid = firebaseUser.uid;

      // Create Projects and Wps for the user
      for (let j = 0; j < 2; j++) {
        const projectData = createProject();
        const wps = projectData.wps;
        projectData.wps = [];
        const project = new Project(projectData);
        project.wps = [];
        for (const wpData of wps) {
          const wp = new Wp(wpData);
          await wp.save();
          project.wps.push(wp);
        }

        await project.save();
        user.projects.push(project);
      }

      // Create Humans for the user
      for (let k = 0; k < 2; k++) {
        const humanData = createHuman();
        const human = new Human(humanData);
        await human.save();
        user.humans.push(human);
      }

      // Create Contracts and Timesheets for the user
      for (let l = 0; l < 2; l++) {
        const project = user.projects[l];
        const human = user.humans[l];
        const contractData = createContract(project, human);
        const contract = new Contract(contractData);
        await contract.save();
        user.contracts.push(contract);

        const timesheetData = createTimesheet(contract);
        const timesheet = new Timesheet(timesheetData);
        await timesheet.save();
        user.timesheets.push(timesheet);
      }

      await user.save();
      users.push(user);
    }

    console.log('Dummy data successfully inserted');
  } catch (error) {
    console.error('Error inserting dummy data:', error);
  } finally {
    mongoose.connection.close();
  }
}

// 4. Call the Main Function
insertDummyData();
