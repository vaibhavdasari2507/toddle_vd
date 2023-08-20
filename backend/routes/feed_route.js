const router = require("express").Router();
const { isAuthenticated, isTeacher } = require("../middleware/authentication");
const {
    teacher_feed,
    student_feed,
} = require("../controllers/feed_controller");

router.get("/teacher_feed",isAuthenticated, isTeacher, teacher_feed);
router.get("/student_feed",isAuthenticated, student_feed);

module.exports = router;
