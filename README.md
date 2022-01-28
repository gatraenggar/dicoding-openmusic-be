# Dicoding-OpenMusic-BE (Back-End)
## What is this ?
A music playlist collections app on Rest API using Hapi.js. This app provides an interface for users to have an authentication with their account, create & manage their song playlist, upload image as their playlist cover, and export the playlists to their email. It is defined as the completion criteria of project submission for Dicoding's Learning Back-end Application Fundamentals module.

This project is an implementation of the topics being taught in the learning module. The module covers about:
- data validation
- database normalization
- authentication & authorization
- message broker
- uploading file via HTTP
- caching

## How to run this app in your local environment ?
### Prerequisites Apps
#### 1. Memurai v.2.0.3 (*some lower versions may still works)
#### 2. RabbitMQ v.3.9.4 (*some lower versions may still works)
#### 3. Postgres (PostgreSQL) v.13.3 (*some lower versions may still works)
#### 4. https://github.com/gatraenggar/dicoding-openmusic-queue-consumer

### Installation
#### 1. `git clone https://github.com/gatraenggar/dicoding-openmusic-be.git`
#### 2. `cd dicoding-openmusic-be`
#### 3. `npm install` to install the all dependencies needed

### Configuration
#### 4. Create a PostgreSQL database
#### 5. Rename `example.env` to `.env`. Then change the    `db_user`, `db_password`, & `db_name` value in that `.env` file based on yours
#### 5.1. Change `access_token_key` and `refresh_token_key` in `.env` file with your generated encryption keys
You can generate your own encryption keys with following steps:
1. Enter this site https://www.allkeysgenerator.com/Random/Security-Encryption-Key-Generator.aspx
2. Choose `Encryption key`
3. Check the `Hex ?` field
4. Click the `512-bit` option
5. Click `Get new results` button, then copy the generated string to the config file

### Run the App
#### 7. `npm run migrate up` to migrate/create the database table
#### 8. Make sure your Memurai, RabbitMQ, & the queue consumer is running. Then run `npm run start-dev` to start the server for development
