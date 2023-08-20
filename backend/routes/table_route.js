const router = require('express').Router();
const { get_table_data } = require('../controllers/table_controller');

router.get('/table/:tablename', get_table_data);

module.exports = router;