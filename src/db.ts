import mongoose from 'mongoose';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

interface Connection {
  isConnected: boolean;
}

const connection: Connection = {
  isConnected: false,
};

async function connect() {
  if (connection.isConnected) {
    console.log('Already connected to MongoDB');
    return;
  }

  if (mongoose.connections.length > 0) {
    connection.isConnected = mongoose.connections[0].readyState === 1;
    if (connection.isConnected) {
      console.log('Using previous connection');
      return;
    }

    await mongoose.disconnect();
  }


  const db = await mongoose.connect(process.env.MONGO_URI || '');
  console.log('New connection established');
  connection.isConnected = mongoose.connections[0].readyState === 1;
}

async function disconnect() {
  if (connection.isConnected) {
    if (process.env.NODE_ENV === 'production') {
      await mongoose.disconnect();
      connection.isConnected = false;
    } else {
      console.log('Not disconnected in development');
    }
  }
}

const db = { connect, disconnect };

export default db;
