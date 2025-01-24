const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://wolfydb_owner:jvMHiS16FLNG@ep-red-lake-a2drvaj3.eu-central-1.aws.neon.tech:5432/wolfydb?sslmode=require',
  ssl: { rejectUnauthorized: false },
});

client.connect()
  .then(() => {
    console.log('Connected to the database successfully!');
    return client.end();
  })
  .catch((err) => {
    console.error('Connection error:', err.message);
  });
