const mongoose=require('mongoose');
const RequirementSchema=mongoose.Schema(
    {
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
          },
          file : {
            type: String
           
          },
          isClosed: {
            type: Boolean,
            default: false
        }
    }
);
var RequirementModel=mongoose.model('Requirements',RequirementSchema);
module.exports=RequirementModel