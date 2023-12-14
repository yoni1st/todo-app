const { render } = require("@testing-library/react");
const { timeStamp } = require("console");
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const { title } = require("process");
const bodyParser = require("body-parser")
const moment = require("moment")

const PORT = 8000;

const connectUrl = "mongodb://localhost:27017/todoDb"

mongoose
    .connect(connectUrl)
    .then( () => console.log("Database Connection Successful") )
    .catch( (error) => console.log(error.message) )

    const todoSchema = mongoose.Schema( 
        { 
            title: { type: String, required: true },
            desc: String,
        }, 
        { timestamps: true }
    );

    const Todo = mongoose.model("todo", todoSchema);

// init app
const app = express();
app.use(express.static(path.join(__dirname, "public")));
//view engine
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded( { extended: true } ));

app.get("/", async(req, res, next) => {
    try {
        const todos = await Todo.find({}).sort( { createdAt: -1 } );

        res.locals.moment = moment
        res.render( "index", { title: "List todo", todos } )
    } catch (error) {
        res.status(500)
        .json( { message: error.message } )
    }
})

app.get("/add-todo", (req, res, next) => {
    try {
        res.render("newTodo", { title: "New todo" })
    } catch (error) {
        res.status(500)
        .json( { message: error.message } )
        
    }
})

app.get("/update-todo", (req, res, next) => {
    try {
        res.render("updateTodo", { title: "Update todo" })
    } catch (error) {
        res.status(500)
        .json( { message: error.message } )
    }
})

app.get("/delete-todo", (req, res, next) => {
    try {
        res.render("deleteTodo", { title: "Delete todo" })
    } catch (error) {
        res.status(500)
        .json( { message: error.message } )        
    }
})

app.post("/add-todo", async(req, res, next) =>{
    try {
        const {title, desc} = req.body;
        if(!title) {
            return res.status(400)
            .json( { message: "Title is required" } )
        }
        const newTodo = new Todo({title, desc});
        await newTodo.save();

        res.redirect("/");
        
    } catch (error) {
        res.status(500)
        .json( { message: error.message} )
        
    }
})

//listen server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})