const k = require("knex");
const config = require("../config/knexfile");
const db = k(config.development);
const bcrypt = require("bcryptjs");
const { generate_token } = require("../utils/generate_token");
const ErrorHandler = require("../utils/error_handler");

exports.signup = async (req, res, next) => {
    try {
        const { name, password, role } = req.body;
        if (!name || !password || !role) {
            return next(
                new ErrorHandler("Please provide name and password", 400)
            );
        }
        const hashedPassword = await bcrypt.hash(password, 12);

        if (role !== "teacher" && role !== "student") {
            return res.status(400).json({
                success: false,
                message:
                    "The value of the role field should be either 'teacher' or 'student.",
            });
        }

        if (role === "teacher") {
            const user = await db("teacher").where({ teacher_name: name });
            if (user.length === 0) {
                try {
                    const teacher = await db(role).returning("tid").insert({
                        teacher_name: name,
                        teacher_pwd: hashedPassword,
                    });
                    const teacherinsert = teacher[0];
                    generate_token(teacherinsert.tid, role, res);
                } catch (error) {
                    console.log(error);
                }
            } else {
                const tid = user[0].tid;
                const pwd = user[0].teacher_pwd;
                const isEqual = await bcrypt.compare(password, pwd);

                if (!isEqual) {
                    return res.status(401).json({
                        success: false,
                        message: "Password is incorrect",
                    });
                }
                generate_token(tid, role, res);
            }
        } else {
            const user = await db("student").where({ stud_name: name });
            if (user.length === 0) {
                try {
                    const student = await db(role).returning("sid").insert({
                        stud_name: name,
                        stud_pwd: hashedPassword,
                    });
                    const studentinsert = student[0];
                    console.log(studentinsert);
                    generate_token(studentinsert.sid, role, res);
                } catch (error) {
                    console.log(error);
                }
            } else {
                const sid = user[0].sid;
                const pwd = user[0].stud_pwd;
                const isEqual = await bcrypt.compare(password, pwd);

                if (!isEqual) {
                    return res.status(401).json({
                        success: false,
                        message: "Password is incorrect",
                    });
                }
                generate_token(sid, role, res);
            }
        }
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            success: false,
            error,
        });
    }
};
