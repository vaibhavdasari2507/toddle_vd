exports.up = function (knex) {
    return knex.schema.createTable('student', function (table) {
        table.increments('sid').primary();
        table.string('stud_name').notNullable();
        table.string('stud_pwd');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('student');
};
