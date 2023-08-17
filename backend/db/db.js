const mongoose = require('mongoose');
const dotenv = require("dotenv");

dotenv.config();
console.log(process.env.MONGO_URI)
const connectDB = async () => {
    try {
        const cn = await mongoose.connect(process.env.MONGO_URI,{
            useUnifiedTopology:true,
            useNewUrlParser:true,
            useCreateIndex:true
        }) 

        console.log(`MongoDB connected`)
    } catch (error) {
        console.error(`Error`)
        process.exit(1);
    }
}

module.exports  = connectDB;