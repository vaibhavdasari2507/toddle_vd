const jwt = require("jsonwebtoken");

exports.generate_token = async (id, role, res) => {
    const token = jwt.sign({ id, role }, "vaibhavdasari");
    res.status(200).json({ message: "Token generated", token });
};
