const client = require('../lib/client');
const { getEmoji } = require('../lib/emoji.js');

// async/await needs to run in a function
run();

async function run() {

  try {
    // initiate connecting to db
    await client.connect();

    // run a query to create tables
    await client.query(`
      CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          email VARCHAR(256) NOT NULL,
          hash VARCHAR(512) NOT NULL
      );           
      CREATE TABLE categories (
        id SERIAL PRIMARY KEY NOT NULL,
        description VARCHAR(512) NOT NULL,
        user_id INTEGER NOT NULL REFERENCES users(id),
        parent_id INTEGER
      );
      CREATE TABLE purchases (
        id SERIAL PRIMARY KEY NOT NULL,
        cost MONEY NOT NULL,
        description VARCHAR(512) NOT NULL,
        timestamp BIGINT NOT NULL,
        category_id INTEGER NOT NULL REFERENCES categories(id),
        user_id INTEGER NOT NULL REFERENCES users(id)
      );
      CREATE TABLE recurring (
        id SERIAL PRIMARY KEY NOT NULL,
        cost MONEY NOT NULL,
        description VARCHAR(512) NOT NULL,
        start_timestamp BIGINT NOT NULL,
        stop_timestamp BIGINT,
        frequency VARCHAR(512) NOT NULL,
        category_id INTEGER NOT NULL REFERENCES categories(id),
        user_id INTEGER NOT NULL REFERENCES users(id)
      );
    `);

    console.log('create tables complete', getEmoji(), getEmoji(), getEmoji());
  }
  catch(err) {
    // problem? let's see the error...
    console.log(err);
  }
  finally {
    // success or failure, need to close the db connection
    client.end();
  }

}
