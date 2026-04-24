import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;

    if (!uri) {
      throw new Error("MONGO_URI is not defined in .env file");
    }

    // Mongoose connection options (modern version-e dorkar na holeo security-r jonno bhalo)
    const conn = await mongoose.connect(uri, {
      autoIndex: true, // Production-e index build nishchit kore
    });
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Connection error handle kora runtime-e
    mongoose.connection.on('error', err => {
      console.error(`❌ Mongoose runtime error: ${err}`);
    });

  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;