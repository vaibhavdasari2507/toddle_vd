const k = require("knex");
const config = require("../config/knexfile");
const db = k(config.development);

exports.teacher_feed = async (req, res, next) => {
    try {
        const tid = req.user.id;
        const teacherfeed = await db("journal")
            .where("journal.tid", tid)
            .select("content", "attach_url", "published_at");
        res.status(200).json({
            success: true,
            message: "Teacher feed fetched",
            teacherfeed,    
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            success: false,
            error:error.message,
        });
    }
};
// exports.teacher_feed = async (req, res, next) => {
//     try {
//         const tid = req.params.tid;
//         const teacherfeed = await db("teacher")
//             .join("journal", "teacher.tid", "=", "journal.tid")
//             .where("teacher.tid", tid)
//             .select("content", "attach_url", "published_at");
//         res.status(200).json({
//             success: true,
//             message: "Teacher feed fetched",
//             teacherfeed,
//         });
//     } catch (error) {
//         res.status(500).json({
//             message: "Internal server error",
//             success: false,
//             error,
//         });
//     }
// };

exports.student_feed = async (req, res, next) => {
    try {
        const sid = req.user.id;
        console.log(sid);
        const studentfeed = await db("tags")
            .where("tags.sid", sid)
            .join("journal", "journal.jid", "=", "tags.jid")
            .select(
                "tags.sid",
                "journal.content",
                "journal.attach_url",
                "journal.published_at"
            );

        const feedforstudent = studentfeed.filter((feed) => {
            if (new Date() >= new Date(feed.published_at)) return feed;
        });

        res.status(200).json({
            success: true,
            message: "Student feed fetched",
            feedforstudent,
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            success: false,
            error:error.message,
        });
    }
};