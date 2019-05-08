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
  priority: String,//Change back to nnumber when properly converted
  dueDate: String, //Use JavaScript Date Object.
  status: Boolean,
  list: String,
});

let todoModel= new mongoose.model("notes", todoSchema);

//A post handler for creating notes
app.post("/createNote", (request,response)=>{
    console.log("Request sends the following", request.body);

    //creates a new mongoose object for a new note
    let newNote = new todoModel({
      username: request.body.username,
      title: request.body.title,
      description:request.body.description,
      priority:request.body.priority,
      dueDate:request.body.dueDate,
      status:request.body.status,
      list:null
    });

    //Save note to MongoDB
    newNote.save((error)=>{
      // if (error) {
      //   console.log("Something happened with mongoose", error);
      //   //Respond to front end if failed
      //   response.sendStatus(500);
      // }else {
      //   console.log("Saved mongoose document successfully");
      //   //Respond to front end if succeeded
      //   response.send({status:"Ok"}); //or send sendStatus(200) for status Ok
      // }
      //OR
      responseState(error, response, 200);
    });
});

//A post handler for reading notes from the db and sending them to the front end
app.post("/readNotes",(request, response)=>{
    //Searches the MongoDB database and get all the notes
    todoModel.find({}, (error, results)=>{
      // if (error) {
      //   // If there is an error, send to front end code 500
      //   console.log("Something happened with mongoose", error);
      //   response.sendStatus(500);
      // }else {
      //   // Otherwise send to front end what we got from database
      //   let dataToSend= {notes:results};
      //   response.send(dataToSend);
      // }
      //OR
      responseState(error, response, {notes:results});
    });
});

//A post handler for deleting a note from the database
app.post("/deleteNote",(request,response)=>{
  //Searches the MongoDB by an ID, and deletes this document.
  todoModel.findByIdAndDelete(request.body._id,(error, results)=>{
    // if (error) {
    //   //If there is an error, send to front end code 500
    //   console.log("Something happened with mongoose.", error);
    //   response.sendStatus(500);
    // }else {
    //   // Otherwise, send to front end, the item we deleted that is stored in the variable results
    //   response.send({deleted:results});
    // }
    //OR
    responseState(error,response, {deleted: results});
  });
});

app.post("/updateNote", (request, response)=>{

  let propertiesToUpdate = {
    username: request.body.username,
    title: request.body.title,
    description:request.body.description,
    priority:request.body.priority,
    dueDate:request.body.dueDate,
    status:request.body.status,
    list:null
  };
  todoModel.findByIdAndUpdate(request.body._id,propertiesToUpdate, (error,results)=>{
    // if (error) {
    //   console.log("something happened with mongoose", error);
    //   response.sendStatus(500);
    // }else {
    //   response.send({updated:results});
    // }
    //or
    responseState(error, response, {updated:results});
  });
});


/*
      newNote.save((error)=>{
        if (error) {
          console.log("Something happened with mongoose", error);
          response.sendStatus(500);
        }else {
          console.log("Saved mongoose document successfully");
          response.send({status:"Ok"}); //or send sendStatus(200) for status Ok
        }
      });

      todoModel.find({}, (error, results)=>{
        if (error) {
          console.log("Something happened with mongoose", error);
          response.sendStatus(500);
        }else {
          let dataToSend= {notes:results};
          response.send(dataToSend);
        }
      });

      todoModel.findByIdAndDelete(request.body._id,(error, results)=>{
        if (error) {
          console.log("Something happened with mongoose.", error);
          response.sendStatus(500);
        }else {
          response.send({deleted:results});
        }
      });


      todoModel.findByIdAndUpdate(request.body._id,propertiesToUpdate, (error,results)=>{
        if (error) {
          console.log("something happened with mongoose", error);
          response.sendStatus(500);
        }else {
          response.send({updated:results});
        }
      });
*/

function responseState(error, response, send){
  console.log("ran");
    if (error) {
      console.log("Something happened withj mongoose", error);
      response.sendStatus(500);
    }else {
      if (typeof send == "number") {
        response.sendStatus(send);
      }else if (typeof send == "object") {
        response.send(send);
      }
    }
};
