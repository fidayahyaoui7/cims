exports.up = function(knex) {
  return knex.schema.createTable('hospitals', function(table) {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('address').notNullable();
    table.string('city').notNullable();
    table.string('phone');
    table.string('email');
    table.string('website');
    table.decimal('latitude', 10, 8);
    table.decimal('longitude', 11, 8);
    table.string('type').notNullable().defaultTo('public'); // public, private, university
    table.boolean('has_emergency').defaultTo(false);
    table.boolean('has_radiology').defaultTo(true);
    table.text('services');
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('hospitals');
};
