exports.up = function (knex) {
    return knex.schema.alterTable('journal', function (table) {
        table.string('attachment_type'); 
    });
};

exports.down = function (knex) {
    return knex.schema.alterTable('journal', function (table) {
        table.dropColumn('attachment_type'); 
    });
};