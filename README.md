
# Reaserch

## Table of Contents
- [Reaserch](#reaserch)
  - [Table of Contents](#table-of-contents)
  - [Tech Stack](#tech-stack)
  - [Tech Stack Versions](#tech-stack-versions)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
    - [Backend Folder](#backend-folder)
    - [Frontend Folder](#frontend-folder)
  - [Running](#running)
    - [Using Docker](#using-docker)
    - [Using Node](#using-node)
      - [Backend Folder](#backend-folder-1)
      - [Frontend Folder](#frontend-folder-1)
    - [Using PM2](#using-pm2)
      - [Backend Folder](#backend-folder-2)
      - [Frontend Folder](#frontend-folder-2)
  - [License](#license)
  - [Authors](#authors)


## Tech Stack

**Client:** React, TailwindCSS, NextJS

**Server:** Node, Express, NestJS

**Database:** MongoDB

**Authentication:** Firebase


## Tech Stack Versions
- **Node.js**: `v20.9.0`
- **npm**: `10.5.2`
- **NestJS**: `10.2.0`
- **NextJS**: `v14.2.13`
- **MongoDB**: `7.0.6`
## Installation

- Install [NodeJS](https://nodejs.org/en/download/package-manager#installing-nodejs-via-package-manager)

- Install [MongoDB](https://www.mongodb.com/docs/manual/administration/install-community/)
    
- Install NestJS globally with 
```bash
npm i -g @nestjs/cli
```

- Create and Setup a new [firebase project](https://console.firebase.google.com/u/4/)
## Environment Variables

### Backend Folder

&emsp; Need to generate a new private key and create a  `private_key.json` file with all the information from `Project settings` under the tab `Service Accounts`

&emsp; `.env.template` file includes `PORT` which defaults to 3000 if not entered and `MONGO_URL` which will default to a database named research locally. After you are done with the file rename it to `.env`

### Frontend Folder

&emsp; `next.config.mjs.template` file includes a `env` section that needs to be edited with the credentials from `Project settings` under the tab `General`. After you are done with the file rename it to `next.config.mjs`
## Running

### Using Docker

To run the project with docker-compose. **Please make sure you have filled all the environment variables**
```bash
  docker-compose up -d
```

### Using Node

#### Backend Folder

To install the dependecies
```bash
  npm install
```

To build the project
```bash
  npm run build
```

To start the project
```bash
  npm run start:prod
```

#### Frontend Folder

To install the dependecies
```bash
  npm install
```

To build the project
```bash
  npm run build
```

To start the project
```bash
  npm run start -- -p PORT_NUMBER
```

### Using PM2

#### Backend Folder

To install the dependecies
```bash
  npm install
```

To build the project
```bash
  npm run build
```

To start the project
```bash
  npm run pm2
```

#### Frontend Folder

To install the dependecies
```bash
  npm install
```

To build the project
```bash
  npm run build
```

To start the project
```bash
  npm run pm2 -- -p PORT_NUMBER
```

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

The MIT License is a permissive open-source license that allows for for-profit and non-profit use, redistribution, modification, and commercial distribution of the licensed software and its derivatives. By contributing to this project, you agree to the terms of the MIT License.

## Authors

- [@EliteOneTube](https://github.com/EliteOneTube)

