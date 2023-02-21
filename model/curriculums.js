const mongoose=require('mongoose');
const CurriculumSchema=mongoose.Schema(
    {
        comments: {
            type: String,
            required: true
          },
        file : {
          type: String,
          required: true
        },
        user:{type:mongoose.Schema.Types.ObjectId, ref:'User'},
        requirement:{type:mongoose.Schema.Types.ObjectId, ref:'Requirements'},

        isApproved: {
          type: Boolean,
          default: false
        },
        name: {
          type: String,
          required: true
        },
      area : {
        type: String,
        required: true
      },
      institution:{
          type: String,
          required: true
        },
      category : {
          type: String,
          required: true
        },
        hours : {
          type: Number,
          required: true
        }
    }
);
var CurriculumModel=mongoose.model('Curriculums',CurriculumSchema);
module.exports={CurriculumModel}


