// defines two key routes for user authentication: Sign-In and Log-In. 
const router = require("express").Router();
const User = require("../models/user")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");

// Sign in api
router.post("/sign-in", async(req, res) => {
    console.log(req.body);
    try{
        const {username} = req.body;
        const {email} = req.body;
        const existingUser = await User.findOne({username});
        const existingEmail = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"Username already exists."});
        }
        else if(username.length < 4){
            return res.status(400).json({message:"Username should be atleast of length 4."});
        }
    
        if(existingEmail){
            return res.status(400).json({message:"Email already exists."});
        }
        const hashPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new User({
            username: req.body.username, 
            email: req.body.email, 
            password: hashPassword,
        });
        await newUser.save();
        return res.status(200).json({message: "Login successfull"})
    }
    catch(error){
        console.log(error);
        res.status(400).json({message: "Internal server error."})
    }
});

router.post("/log-in", async(req, res) => {
    const {username, password} = req.body;
    const existingUser = await User.findOne({username});
    if(!existingUser){
        return res.status(400).json({message: "Invalid credentials"});
    }
    bcrypt.compare(password, existingUser.password, (err, data) => {
        if(data){
            const authClaims = [{name: username}, {jti: jwt.sign({}, "100MIL")}]
            const token = jwt.sign({authClaims}, "100MIL", {expiresIn: "2d"});
            res.status(200).json({id: existingUser.id, token: token});
        }
        else{
            return res.status(400).json({message: "Invalid credentials"});
        }
    });
});

module.exports = router;
