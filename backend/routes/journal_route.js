const router = require("express").Router();
const { isAuthenticated, isTeacher } = require("../middleware/authentication");
const multer = require("multer");
const {
    create_journal,
    get_journal,
    delete_journal,
    update_journal,
} = require("../controllers/journal_controller");
const upload = multer({ storage: multer.memoryStorage() });

router.post(
    "/create_journal",
    isAuthenticated,
    isTeacher,
    upload.single("attach_url"),
    create_journal
);
router.get("/get_journal", get_journal);
router.delete(
    "/delete_journal/:jid",
    isAuthenticated,
    isTeacher,
    delete_journal
);
router.post(
    "/update_journal/:jid",
    isAuthenticated,
    isTeacher,
    upload.single("attach_url"),
    update_journal
);

module.exports = router;
