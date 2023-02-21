const express = require('express');
const router = express.Router();
const { CurriculumModel } = require("../model/curriculums");
const bodyparser = require('body-parser');
router.use(bodyparser.json());
router.use(bodyparser.urlencoded({ extented: true }));

const multer = require('multer');
const path = require('path');
router.use(express.static('public'));
let verifyToken =require('../routes/verifytoken');


let storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(__dirname, '../public/CurriculumFile'), function (error, success) {

      if (error) { console.log(error) } else { console.log("success") }
    });
  },
  filename: (req, file, callback) => {
    const name = Date.now() + '-' + file.originalname
    callback(null, name, function (error, success) {
      if (error) { console.log(error) } else { console.log("success") }
    });
  }
}
);
const upload = multer({ storage: storage })



router.post('/create',upload.single('file'),verifyToken,async (req,res)=>{   
  try
  {
   
console.log(req.body.hours);
        let data = new CurriculumModel({ 
          comments: req.body.comments,
      file: req.file.filename,
      user: req.body.user,
      requirement: req.body.requirement,
      isApproved: req.body.isApproved,
      name:req.body.name,
      area:req.body.area,
      category:req.body.category,
      institution:req.body.institution,
      hours:req.body.hours
      }
      
    )
    
    const postData= await data.save();
    res.status(200).send({success:true,msg:'postData',data:postData})
  }
  catch(err)
  {
    res.status(400).send({success:false,msg:err.message})
    console.log(err.message);
  }
})



/*

router.post('/create', upload.single('file'), async (req, res) => {
  try {

    let data = new CurriculumModel({
      comments: req.body.comments,
      file: req.file.filename,
      user: req.body.user,
      requirement: req.body.requirement,
      isApproved: req.body.isApproved,
     
    }
    )

    const postData = await data.save();
    res.status(200).send({ success: true, msg: 'postData', data: postData })
  }
  catch (err) {
    res.status(400).send({ success: false, msg: err.message })
    console.log(err.message);
  }
})

*/







    

  
  router.get('/getnew',async(req,res)=>{
    try
    {
     
        const data=await CurriculumModel.find({ "isApproved":false});
      res.send(data);   
    }
    catch(err)
    {
        res.status(400).json({error:"No requirement find"+ err.message});
    }
    })
    router.get('/read',async(req,res)=>{
      try
      {
          const data =await CurriculumModel.find()
          // .populate('requirement')
          // .populate({path: 'user', select:['userName']})
          // .populate({path:'requirement', select:['name','area','category','institute','hours']})
          res.send(data); 
      }
      catch(err)
      {
          res.status(400).json({error:err.message});
      }
      })
  
      router.get('/download/:file',async(req,res)=>
      {
        try
        {
          let file=req.params.file;
          res.download("../backend/public/CurriculumFile/"+file);
        
        }
        catch(err)
      {
          res.status(400).json({error:"Download Failed"});
      }
      })
  
      

  
  router.delete('/delete/:id',async(req,res)=>{           
        try
        {
           let id=req.params.id;
           const data= await CurriculumModel.findOneAndDelete({"_id":id});
           res.json({"status":"success"})
        }
        catch (error)
        {
            res.status(400).json({error:"No curriculum deleted"});
            console.log(error);
        }
    })
    router.get('/readone/:id',async(req,res)=>{
      try
      {
          let id=req.params.id;
          const data =await CurriculumModel.findOne({"_id": id});
         res.json(data);  
      }
      catch(err)
      {
          res.status(400).json({error:"No requirement find"});
      }
      })
      router.get('/readsingle/:id',async(req,res)=>{
        try
        {
            let id=req.params.id;
            const data =await CurriculumModel.findOne({"_id": id});
           res.send(data);  
        }
        catch(err)
        {
            res.status(400).json({error:"No requirement find"});
        }
        })

      router.get('/readbyuser/:user',async(req,res)=>{
        try
        {
            let user=req.params.user;
            const data =await CurriculumModel.find({"user": user});
           res.send(data);  
        }
        catch(err)
        {
            res.status(400).json({error:"No requirement find"});
        }
        })
        router.put('/update',upload.single('file'),verifyToken,async(req,res)=>{
          try {
        
            let data = new CurriculumModel({ 
              _id: req.body.id,
              comments:req.body.comments,
              file: req.body.file==''?'': (typeof(req.file)==="undefined"?req.body.file:req.file.filename) ,
              isApproved: req.body.isApproved
              // isApproved:true
            }
          )  
          
          let id = req.body.id;
          const postData= await CurriculumModel.updateOne({"_id": id},data);
      console.log(id);
          res.status(200).send({success:true,msg:'postData',data:postData})
          // res.send(postData)
        }
        catch (error)
        {
          res.status(400).send({success:false,msg:error.message})
          console.log(error.message);
        }
           
        })

module.exports = router;