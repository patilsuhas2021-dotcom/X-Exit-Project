const mongoose = require("mongoose");
require("dotenv").config();

async function fixIndex() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
    
    const collection = mongoose.connection.collection("users");
    
    // Check if index exists and drop it
    const indexes = await collection.indexes();
    console.log("Current indexes:", JSON.stringify(indexes, null, 2));
    
    if (indexes.some(idx => idx.name === "email_1")) {
      await collection.dropIndex("email_1");
      console.log("Dropped index email_1");
    } else {
      console.log("Index email_1 not found");
    }

    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

fixIndex();
