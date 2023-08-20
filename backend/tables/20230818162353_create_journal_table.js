exports.up = function (knex) {
    return knex.schema.createTable('journal', function (table) {
        table.increments('jid').primary();
        table.integer('tid').unsigned().references('teacher.tid');
        table.date('published_at').notNullable();
        table.text('content');
        table.string('attach_url');
        table.timestamps(true, true);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('journal');
};
