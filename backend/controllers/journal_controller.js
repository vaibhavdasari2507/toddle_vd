const k = require("knex");
const config = require("../config/knexfile");
const db = k(config.development);
const ErrorHandler = require("../utils/error_handler");
const firebase = require("firebase/app");
const {
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL,
} = require("firebase/storage");

const firebaseConfig = {
    apiKey: "AIzaSyAjmPKCRfNkYfI_fPaemO5mqmOLH0ecd5s",
    authDomain: "toddle-vd.firebaseapp.com",
    projectId: "toddle-vd",
    storageBucket: "toddle-vd.appspot.com",
    messagingSenderId: "247305550472",
    appId: "1:247305550472:web:d3747cefc5724f354d3d3d",
    measurementId: "G-6CRZ0J5G84",
};

firebase.initializeApp(firebaseConfig);
const storage = getStorage();

exports.create_journal = async (req, res, next) => {
    try {
        const tid = req.user.id;
        let {
            published_at,
            content,
            attach_url,
            attachment_type,
            student_ids,
        } = req.body;
        if (!tid || !published_at || !content || !student_ids) {
            return next(new ErrorHandler("Please provide details", 400));
        }

        const file = req.file;
        try {
            if (attachment_type !== "4") {
                try {
                    const storageRef = ref(storage, file.originalname);
                    await uploadBytes(storageRef, file.buffer);
                    attach_url = await getDownloadURL(storageRef);
                } catch (error) {
                    console.log(error);
                }
            }

            const journal = await db("journal").returning("jid").insert({
                tid,
                published_at,
                content,
                attach_url,
                attachment_type,
            });
            const journalinsert = journal[0];

            console.log(journalinsert);

            const tagsdata = student_ids
                .split(",")
                .map(Number)
                .map((student_id) => {
                    return { jid: journalinsert.jid, sid: student_id };
                });

            const tags = await db("tags").returning("sid").insert(tagsdata);

            res.status(200).json({
                message: "Journal created",
                success: true,
                journalinsert,
                tags,
            });
        } catch (error) {
            console.log(error);
        }
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message,
        });
    }
};

exports.get_journal = async (req, res, next) => {
    try {
        const journal = await db("journal");
        res.status(200).json({
            message: "Journals fetched",
            success: true,
            journal,
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            success: false,
            error,
        });
    }
};

exports.delete_journal = async (req, res, next) => {
    try {
        const jid = req.params.jid;
        await db("journal").del().where({ jid });
        res.status(200).json({
            message: "Journal deleted",
            success: true,
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            success: false,
            error,
        });
    }
};

exports.update_journal = async (req, res, next) => {
    try {
        let updateData = { ...req.body };
        if (req.file) {
            const storageRef = ref(storage, req.file.originalname);
            await uploadBytes(storageRef, req.file.buffer);
            url = await getDownloadURL(storageRef);
            updateData = { ...updateData, attach_url: url };
        }
        const jid = req.params.jid;

        try {
            const journal = await db("journal")
                .returning("jid")
                .where("jid", jid)
                .update(updateData);
            const journalupdate = journal[0];

            res.status(200).json({
                message: "Journal updated",
                success: true,
                journalupdate,
            });
        } catch (error) {
            console.log(error);
        }
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            success: false,
            error,
        });
    }
};
