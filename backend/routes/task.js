// defines a set of Express.js API routes for managing tasks in your application.
const router = require("express").Router();
const Task = require("../models/task");
const User = require("../models/user");
const { authenticateToken } = require("./auth");

// Create-task
router.post("/create-task", authenticateToken, async(req, res) => {
    try{
        const {title, desc} = req.body;
        const {id} = req.headers;
        const newTask = new Task({title: title, desc: desc});
        const saveTask = await newTask.save();
        const taskId = saveTask._id;
        await User.findByIdAndUpdate(id, {$push:{tasks: taskId._id}});
        res.status(200).json({message: "Task created."});
    }
    catch(error){
        console.log(error);
        res.status(400).json({message: "Internal server error."})
    }
});

// Get all tasks
router.get("/get-all-tasks", authenticateToken, async(req, res) => {
    // console.log("Request reached");
    try{
        const {id} = req.headers;
        const userData = await User.findById(id).populate({path:"tasks", options: {sort: {createdAt: 1}}});
        res.status(200).json({data: userData});
    }
    catch(error){
        console.log(error);
        res.status(400).json({message: "Internal server error."})
    }
});

// Delete task
router.delete("/delete-task/:id", authenticateToken, async(req, res) => {
    // console.log("Request reached");
    try{
        const {id} = req.params;
        const userId = req.headers.id;
        await Task.findByIdAndDelete(id);
        await User.findByIdAndUpdate(userId,{$pull: {tasks: id}});
        res.status(200).json({message: "Task deleted successfully."});
    }
    catch(error){
        console.log(error);
        res.status(400).json({message: "Internal server error."})
    }
});

// Update task
router.put("/update-task/:id", authenticateToken, async(req, res) => {
    // console.log("Request reached");
    try{
        const {id} = req.params;
        const {title, desc} = req.body;
        await Task.findByIdAndUpdate(id, {title: title, desc: desc})
        res.status(200).json({message: "Task updated successfully."});
    }
    catch(error){
        console.log(error);
        res.status(400).json({message: "Internal server error."})
    }
});

// Update importance
router.put("/update-imp-task/:id", authenticateToken, async(req, res) => {
    // console.log("Request reached");
    try{
        const {id} = req.params;
        const taskData = await Task.findById(id);
        const impTask = taskData.important;
        await Task.findByIdAndUpdate(id, {important: !impTask})
        res.status(200).json({message: "Task updated successfully."});
    }
    catch(error){
        console.log(error);
        res.status(400).json({message: "Internal server error."})
    }
});

// Update completed
router.put("/update-comp-task/:id", authenticateToken, async(req, res) => {
    // console.log("Request reached");
    try{
        const {id} = req.params;
        const taskData = await Task.findById(id);
        const compTask = taskData.complete;
        await Task.findByIdAndUpdate(id, {complete: !compTask})
        res.status(200).json({message: "Task updated successfully."});
    }
    catch(error){
        console.log(error);
        res.status(400).json({message: "Internal server error."})
    }
});

// Get important tasks
router.get("/get-imp-tasks", authenticateToken, async(req, res) => {
    // console.log("Request reached");
    try{
        const {id} = req.headers;
        const Data = await User.findById(id).populate({path:"tasks", match: {important: true}, options: {sort: {createdAt: 1}}});
        const impTaskData = Data.tasks;
        res.status(200).json({data: impTaskData});
    }
    catch(error){
        console.log(error);
        res.status(400).json({message: "Internal server error."})
    }
});

// Get completed tasks
router.get("/get-comp-tasks", authenticateToken, async(req, res) => {
    // console.log("Request reached");
    try{
        const {id} = req.headers;
        const Data = await User.findById(id).populate({path:"tasks", match: {complete: true}, options: {sort: {createdAt: 1}}});
        const compTaskData = Data.tasks;
        res.status(200).json({data: compTaskData});
    }
    catch(error){
        console.log(error);
        res.status(400).json({message: "Internal server error."})
    }
});

// Get incompleted tasks
router.get("/get-incomp-tasks", authenticateToken, async(req, res) => {
    // console.log("Request reached");
    try{
        const {id} = req.headers;
        const Data = await User.findById(id).populate({path:"tasks", match: {complete: false}, options: {sort: {createdAt: 1}}});
        const incompTaskData = Data.tasks;
        res.status(200).json({data: incompTaskData});
    }
    catch(error){
        console.log(error);
        res.status(400).json({message: "Internal server error."})
    }
});

module.exports = router;
