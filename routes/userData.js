const express = require('express');
const router = express.Router();
const UserModel = require('../model/user');
const bodyparser = require('body-parser');
router.use(bodyparser.json());
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')



router.use(bodyparser.urlencoded({ extented: false }));


// var cors = require('cors');

// router.use(cors());

// const path = require('path');
// const User = require("../model/user");

// mongoose.connect("mongodb+srv://Smita_08:Chennai88@cluster0.7vhoi24.mongodb.net/LoginRegistration?retryWrites=true&w=majority",
//     { useNewUrlParser: true }
// );


router.post("/signup", async (req, res) => {

    let data = new UserModel({
        userName: req.body.userName,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        address: req.body.address,
        phoneNumber: req.body.phoneNumber,
        gender: req.body.gender,
        qualification: req.body.qualification,
        experience: req.body.experience,
        userType: req.body.userType
    });
    console.log(data);
    await data.save();
    res.json({ "status": "success", "data": data })

})



router.post("/signin", async (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    let result = UserModel.find({ email: email }, (err, data) => {

        if (data.length > 0) {
            const passwordValidator = bcrypt.compareSync(password, data[0].password)
            if (passwordValidator) {

                jwt.sign({ email: email, id: data[0]._id }, "myKey", { expiresIn: "1d" },
                    (err, token) => {
                        if (err) {
                            res.json({ "status": "error", "error": err })

                        } else {
                            res.json({ "status": "success", "data": data, "token": token })
                        }
                    })
            }
            else {
                res.json({ "status": "failed", "data": "invalid password" })
            }
        }
        else {
            res.json({ "status": "failed", "data": "invalid email id" })
        }
    })
})
router.post("/passwordCheck", async (req, res) => {
    console.log("fgdh");
    var password = req.body.password;
    var currentPassword=req.body.currentPassword;
    
    
            const passwordValidator = bcrypt.compareSync(password,currentPassword)
            if (passwordValidator) {                
                res.json({ "status": "success", "data": data, "token": token })                      
            }
            else {
                res.json({ "status": "failed", "data": "invalid password" })
            }       
  
})
router.put("/passwordChange", async (req, res) => {

    let data = new UserModel({
        
        password: bcrypt.hashSync(req.body.password, 10),
      
    });

    let id=req.body.id; 
     const postData= await RequirementModel.updateOne({"_id": id},data);    
     res.status(200).send({success:true,msg:'postData',data:postData})

})
router.get('/readone/:id',async(req,res)=>{
    try
    {
        let id=req.params.id;
        const data =await UserModel.findOne({"_id": id});
       res.json(data);  
       
    }
    catch(err)
    {
        res.status(400).json({error:"No User find"});
    }
    })

// router.get('/', async (req, res) => {
//     try {
//         const data = await UserModel.find()
//         res.send(data);
//         res.status(200).json({ message: "Success" });
//     }
//     catch (err) {
//         res.status(400).json({ error: "No requirement find" });
//     }
// })
router.post('/logincheck',(req,res)=>{

    jwt.verify(req.body.token,"myKey",(err,decoded)=>{
        if(decoded && decoded.email){
            res.json({"status":"success"})
        }
        else{
            res.json({"status":"Unauthorised user"})
    
        }
       })
    })
module.exports = router;

