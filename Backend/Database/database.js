import mongoose from 'mongoose';

export async function connectionDB(connStr){
    try{
        await mongoose.connect(connStr);
        console.log("Connected to database...");
    }catch(err){
        console.log("Connection Failed",err);
    }
}
