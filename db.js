const mongoose =require("mongoose");
const connect =mongoose.connect("mongodb+srv://handicrafts:test123@cluster0.uohcfax.mongodb.net/shop?connectTimeoutMS=30000");

connect.then(()=>{
    console.log("Database connected successfully");
})
.catch(()=>{
    console.log("Data base cannot be connected");
})

const LoginSchema=new mongoose.Schema({
    itemName: {
        type: String,
        required: true,
      },
      itemType: {
        type: String,
        required: true,
      },
      itemPrice: {
        type: String,
        required: true
      },
      itemImg: {
        type: String,
        required: true
      }
});

const collection=new mongoose.model("itemsdata",LoginSchema);

module.exports=collection;