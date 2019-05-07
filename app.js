const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");

let app = express();
let http = require("http").Server(app);
let dbConnect = "mongodb+srv://todoappuser:user1234@cluster0-k8x6y.mongodb.net/test?retryWrites=true";

mongoose.connect(dbConnect, {useNewUrlParser:true}, (error) =>{
  if(error){
    console.log("There was an error connecting to MongoDB", error);
  }else {
    console.log("Successfully connected to MongoDB");
  }
});

mongoose.Promise = global.Promise;

let db = mongoose.connection;

db.on("error",console.error.bind(console,"MongoDB connection error:"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use("/",express.static("client/"));


const port = 3000;
http.listen(port);

console.log("Express is running on port"+ port);

// End of static Code. except for line 7 which needs to be customized

let Schema = mongoose.Schema;

let todoSchema = new Schema({
  username : String,
  title: String,
  description: String,
  priority: Number,//Change back to nnumber when properly converted
  dueDate: String, //Use JavaScript Date Object.
  status: Boolean,
  list: String,
});

let todoModel= new moongose.model("notes", todoSchema);
app.post("/createNote", (request,response)=>{
    console.log("Request sends the following", request.body);

    let newNote = new todoModel({
      username: request.bod.username,
      title: request.body.title,
      description:request.body.description,
      priority:request.body.priority,
      dueDate:request.body.dueDate,
      status:request.body.status,
      list:null,
    });
    newNote.save((error)=>{
      if (error) {
        console.log("Something happened with mongoose", error);
        response.sendStatus(500);
      }else {
        console.log("Saved mongoose document successfully");
        response.send({status:"Ok"});
      }
    });


});
