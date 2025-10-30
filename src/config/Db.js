import mongoose from "mongoose";

const ConnectDb  = async ()=>{
    try{
        mongoose.connect("mongodb://localhost:27017/Node2025")
        console.log("db connected successfully");
        
    }catch(err){
      console.log("error occue" , err);
      process.exit(1)
      
    }
}
export default ConnectDb;