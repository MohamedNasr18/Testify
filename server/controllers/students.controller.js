const httpstatus=require("../utilities/httpStatusText");
const Student=require('../models/student.model')
const bcrypt =require('bcrypt');
const jwt=require('jsonwebtoken')
require(`dotenv`).config();

const getAllStudents=async (req, res) => {
    try {
      const query=req.query;
      const limit=query.limit;
      const page=query.page;
      const skip=(page-1)*limit
      const students = await Student.find({},{"__v":false,'password':false}).limit(limit).skip(skip);
  
      if (!students || students.length === 0) {
        return res.json({status:httpstatus.FAIL,data:{course:"course not found"}});
      }
  
      res.json({status:httpstatus.SUCCESS, data:{students}});
      console.log(req.headers)
       
    } catch (error) {
      res.status(500).json({status:httpstatus.ERROR,data:null,message:error.message });
    }
  };
  


  const register = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    const image = req.file ? req.file.filename : null; 

    if (!password) {
        return res.status(400).json({ status: 'error', message: 'Password is required' });
    }

    try {
        
        const existingStudent = await Student.findOne({ email });
        if (existingStudent) {
            return res.status(400).json({ status: 'error', message: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10); 

        const newStudent = new Student({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            image 
        });

        const token = jwt.sign(
            { email: newStudent.email, id: newStudent._id }, 
            process.env.JWT_SECRET_KEY, 
            { expiresIn: "5d" }
        );

        newStudent.token = token;

        await newStudent.save();

        res.status(201).json({
            status: 'success',
            data: {
                firstName: newStudent.firstName,
                lastName: newStudent.lastName,
                email: newStudent.email,
                token: newStudent.token,
                image: newStudent.image
            },
            message: 'Registration successful'
        });
    } catch (error) {
        console.error('Registration error:', error); 
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
};


const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.json({ status: httpstatus.FAIL, message: 'Email and password are required' });
        }

        const student = await Student.findOne({ email });
        if (!student) {
            return res.json({ status: httpstatus.FAIL, message: 'User not found' });
        }

        const matchedPassword = await bcrypt.compare(password, student.password);
        if (matchedPassword) {

            const token = jwt.sign(
                { email: student.email, id: student._id },
                process.env.JWT_SECRET_KEY,
                { expiresIn: "5d" }
            );

            student.token = token;

            return res.json({
                status: httpstatus.SUCCESS,
                message: 'User logged in successfully',
                token,
                firstName: student.firstName,  
                lastName: student.lastName
            });
        } else {
            return res.json({ status: httpstatus.FAIL, message: 'Incorrect email or password' });
        }
    } catch (err) {
        return next({ status: httpstatus.ERROR, message: 'An error occurred' });
    }
};


module.exports={ 
    getAllStudents,
    register,
    login
}

