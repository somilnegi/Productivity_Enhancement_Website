const mongoose = require("mongoose"); // library used to interact with a MongoDB database.
const conn = async() => {
    try{
        const response = await mongoose.connect(`${process.env.MONGO_URI}`);
        if(response){
            console.log("Connected to db")
        }
    }
    catch(error){
        console.log(error);
    }
};
conn();