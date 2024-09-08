const express = require(`express`);
const router = express.Router();
const studentController=require('../controllers/students.controller')
const {verifyToken}=require('../controllers/middleware/verifyToken')

router
  .route(`/`)
  .get(verifyToken,studentController.getAllStudents)

router
.route(`/register`)
.post(studentController.register)

router
.route(`/login`)
.post(studentController.login)



module.exports = router;
