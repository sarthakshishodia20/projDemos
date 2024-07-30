const mongoose=require("mongoose");
const initData=require("./data");
const Listing=require("../models/listing");

const MonogoURL="mongodb://127.0.0.1:27017/WanderLust";


main().then(()=>{
    console.log("Connected to db");
})
.catch((err)=>{
    console.log("Eror in connection");
})


async function main(){
    await mongoose.connect(MonogoURL);
}

const initDB=async()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("Data was initialised");
}


initDB();