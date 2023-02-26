const express = require('express');
const router = express.Router();
const RequirementModel = require('../model/requirements');
const bodyparser = require('body-parser');
router.use(bodyparser.json());
const { stringify } = require('querystring');
let verifyToken = require('../routes/verifytoken');
const bcrpt = require('bcrypt')
const jwt = require('jsonwebtoken')

router.use(bodyparser.urlencoded({ extented: true }));
const multer = require('multer');
const path = require('path');
router.use(express.static('tmp'));



const fileUpload = require('express-fileupload');

// default options
//router.use(fileUpload());
router.use(fileUpload({
  useTempFiles: true,
  tempFileDir: "/tmp",
}))

router.get('/', (req, res) => {
  res.sendFile(__dirname + "/index.html")
})

router.post('/create', (req, res) => {
  console.log("hgf");
  let sampleFile;
  let uploadPath;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  sampleFile = req.files.file
  uploadPath = path.join(__dirname, '../tmp/RequirementFile/') + sampleFile.name;
  console.log(uploadPath);
  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv(uploadPath, function (err) {
    if (err)
      return res.status(500).send(err);
    else {
      let data = new RequirementModel({
        name: req.body.name,
        area: req.body.area,
        institution: req.body.institution,
        category: req.body.category,
        hours: req.body.hours,
        file: sampleFile.name,
        isClosed: req.body.isClosed
      })
      const postData = data.save();
      res.status(200).send({ success: true, msg: 'postData', data: postData })
    }
  });
});




let storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(__dirname, '../public/RequirementFile'), function (error, success) {

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













router.post('/create1', upload.single('file'), verifyToken, async (req, res) => {
  try {

    console.log("running");
    let data = new RequirementModel({
      name: req.body.name,
      area: req.body.area,
      institution: req.body.institution,
      category: req.body.category,
      hours: req.body.hours,
      file: req.body.file == '' ? '' : req.file.filename,
      isClosed: req.body.isClosed
    })
    const postData = await data.save();
    res.status(200).send({ success: true, msg: 'postData', data: postData })


  }
  catch (err) {
    res.status(400).send({ success: false, msg: err.message })
  }
})


// router.post('/create',upload.single('file'), (req,res)=>{   
//   try
//   {

//     jwt.verify(req.body.token,"myKey",(err,decoded)=>{
//       if(decoded && decoded.email){


//             let data = new RequirementModel({ 
//             name:req.body.name,
//             area:req.body.area,
//             institution:req.body.institution,  
//             category:req.body.category,
//             hours:req.body.hours,
//             file: req.body.file==''?'': req.file.filename,
//             isClosed:req.body.isClosed } )
//             const postData=  data.save();
//             res.status(200).send({success:true,msg:'postData',data:postData})
//     }
//       else{
//         res.json({"status":"Unauthorised user"});

//     }
//   }) 
//   }
//   catch(err)
//   {
//     res.status(400).send({success:false,msg:err.message})
//   }
// })

router.get('/read', verifyToken, async (req, res) => {
  try {
    const data = await RequirementModel.find();
    res.send(data);
  }
  catch (err) {
    res.status(400).json({ error: "No requirement find" + err.message });
  }
})
router.get('/readone/:id', verifyToken, async (req, res) => {
  try {
    let id = req.params.id;
    const data = await RequirementModel.findOne({ "_id": id });
    res.json(data);
  }
  catch (err) {
    res.status(400).json({ error: "No requirement find" });
  }
})

router.get('/download/:file', async (req, res) => {
  try {
    let file = req.params.file;
    res.download("../tmp/RequirementFile/" + file);

  }
  catch (err) {
    res.status(400).json({ error: "Download Failed" });
  }
})

router.put('/updateStatus', async (req, res) => {
  try {

    let data = new RequirementModel({
      _id: req.body._id,
      isClosed: req.body.isClosed
    }
    )
    let id = req.body._id;
    const postData = await RequirementModel.findByIdAndUpdate({ "_id": id }, data);
    res.status(200).send({ success: true, msg: 'postData', data: postData })
    console.log(req.body.isClosed);
  }
  catch (error) {
    res.status(400).send({ success: false, msg: error.message })
    console.log(error.message);
  }
})

router.put('/update', upload.single('file'), verifyToken, async (req, res) => {
  try {

    // jwt.verify(req.body.token,"myKey",(err,decoded)=>{
    //   if(decoded && decoded.email){
    let data = new RequirementModel({
      _id: req.body.id,
      name: req.body.name,
      area: req.body.area,
      institution: req.body.institution,
      category: req.body.category,
      hours: req.body.hours,
      // file: typeof(req.file.filename)==="undefined"?'': req.file.filename  
      file: req.body.file == '' ? '' : (typeof (req.file) === "undefined" ? req.body.file : req.file.filename),
      isClosed: req.body.isClosed
    }
    )
    let id = req.body.id;
    const postData = await RequirementModel.updateOne({ "_id": id }, data);
    res.status(200).send({ success: true, msg: 'postData', data: postData })
    //   }
    //   else{
    //     res.json({"status":"Unauthorised user"});

    // }
    // }) 
  }
  catch (error) {
    res.status(400).send({ success: false, msg: error.message })

  }
})

router.delete('/delete/:id', verifyToken, async (req, res) => {
  try {
    let id = req.params.id;
    const data = await RequirementModel.findOneAndDelete({ "_id": id });
    res.json({ "status": "success" })
  }
  catch (error) {
    res.status(400).json({ error: "No requirement deleted" });
    console.log(error);
  }
})

router.get('/getnew', async (req, res) => {
  try {

    const data = await RequirementModel.find({ "isClosed": false });
    res.send(data);
  }
  catch (err) {
    res.status(400).json({ error: "No requirement find" + err.message });
  }
})

module.exports = router;