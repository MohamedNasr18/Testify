const {validationResult}=require(`express-validator`)
const Course=require(`../models/course.model`)
const httpstatus=require("../utilities/httpStatusText");
const getAllCourses = async (req, res) => {
  try {
    const query=req.query; //req.query contains limit and page
    const limit=query.limit;
    const page=query.page;
    const skip=(page-1)*limit
    const courses = await Course.find({},{"__v":false}).limit(limit).skip(skip);

    if (!courses || courses.length === 0) {
      return res.json({status:httpstatus.FAIL,data:{course:"course not found"}});
    }

    res.json({status:httpstatus.SUCCESS, data:{courses}});
  } catch (error) {
    res.status(500).json({status:httpstatus.ERROR,data:null,message:error.message });
  }
};
          

const getSingleCourse = async  (req, res) => {
   const course = await Course.findById(req.params.courseId)
 
  if (!course) {
    return res.json({status:httpstatus.FAIL, data: {course:"no courses found"} });
  }
  res.json({status:httpstatus.SUCCESS,data:{course}});
};

const addCourse = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: httpstatus.ERROR,data:null,message:errors.message});
  }
   const newCourse = new Course(req.body); //new instance of the course model named newCourse, req.body is the object sent to the Course model
   await newCourse.save();
 
  res.json({status:httpstatus.SUCCESS,data:{newCourse}});
};

const updateCourse = async (req, res) => {
  try{
    const updatedCourse=await Course.findByIdAndUpdate(
      req.params.courseId,
      {$set:{...req.body}},
      {$new:true})
      if (!updatedCourse) {
        return res.status(400).json({status:httpstatus.FAIL,data:null});
      }
      res.status(200).json({status:httpstatus.SUCCESS,data:{updatedCourse}});
  }catch(error){
    return res.json({Status:httpstatus.ERROR,data:null,message:error.message})
  }
  
};

const deleteCourse = async(req, res) => {
  await Course.deleteOne({_id:req.params.courseId})
  res.status(200).json({ status:httpstatus.SUCCESS,data:null });
};

module.exports={
    getAllCourses,
    getSingleCourse,
    addCourse,
    updateCourse,
    deleteCourse
}
