const express = require(`express`);
const router = express.Router();
const { body } = require(`express-validator`);
const courseController = require(`../controllers/courses.controller`);

router
  .route(`/`)
  .get(courseController.getAllCourses)
  .post(
    [
      body("title")
        .notEmpty()
        .withMessage("Title is required")
        .isLength({ min: "2" })
        .withMessage("min length is 2 digits"),
      body("price")
        .notEmpty()
        .withMessage("Price is required")
        .isNumeric()
        .withMessage("Price must be a number"),
    ],
    courseController.addCourse
  );
router
  .route(`/:courseId`)
  .get(courseController.getSingleCourse)
  .patch(courseController.updateCourse)
  .delete(courseController.deleteCourse);

module.exports = router;
