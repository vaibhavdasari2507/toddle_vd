const knex = require("knex");
const config = require("../config/knexfile");
const db = knex(config.development);

exports.get_table_data = async (req, res) => {
    try {
        const { tablename } = req.params;
        const results = await db(tablename);
        res.status(200).json({
            success: true,
            results,
        });
    } catch (error) {
        res.json({
            success: false,
            message: error.message,
        });
    }
};
