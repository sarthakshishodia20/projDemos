const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");

app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
app.use(methodOverride("_method"));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));

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

// Index Route
app.get("/listings",async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("./listings/index.ejs",{ allListings });
})

// new Route
app.get("/listings/new",(req,res)=>{
    res.render("./listings/new.ejs");
});

// create route
app.post("/listings",async(req,res)=>{
    let newListing=await new Listing(req.body.listing);
    newListing.save();
    res.redirect("/listings");
})
  

// Edit route
app.get("/listings/:id/edit",async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("./listings/edit.ejs",{listing});
});

// Update Route
app.put("/listings/:id",async (req,res)=>{
    let{id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
})

app.delete("/listings/:id",async(req,res)=>{
    let{id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
})
// Show Route
app.get("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("./listings/show.ejs",{ listing });
});




app.get("/testListing",async(req,res)=>{
    let sampleListing=new Listing({
        title:"My new Villa",
        description:"By the Beach",
        price:1200,
        location:"Calangute,Goa",
        country:"India",
    });
    await sampleListing.save();
    console.log("Sample was saved");
    res.send("Successful testing");
})
app.get("/",(req,res)=>{
    res.send("Hi i am root");
})

app.listen(3000,()=>{
    console.log("Serve is listeninig on 8080");
})