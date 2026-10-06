exports.up = function(knex) {
  return knex.schema
    .createTable('cities', function(table) {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('region');
      table.decimal('latitude', 10, 8);
      table.decimal('longitude', 11, 8);
      table.timestamps(true, true);
    })
    .createTable('hospitals', function(table) {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.enum('type', ['Public', 'Private', 'University', 'Regional']).notNullable();
      table.string('address');
      table.string('phone');
      table.string('email');
      table.string('website');
      table.decimal('latitude', 10, 8);
      table.decimal('longitude', 11, 8);
      table.boolean('has_emergency').defaultTo(false);
      table.integer('city_id').unsigned().references('id').inTable('cities');
      table.text('description');
      table.timestamps(true, true);
    })
    .createTable('services', function(table) {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('category');
      table.timestamps(true, true);
    })
    .createTable('hospital_services', function(table) {
      table.increments('id').primary();
      table.integer('hospital_id').unsigned().references('id').inTable('hospitals').onDelete('CASCADE');
      table.integer('service_id').unsigned().references('id').inTable('services').onDelete('CASCADE');
      table.timestamps(true, true);
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('hospital_services')
    .dropTableIfExists('services')
    .dropTableIfExists('hospitals')
    .dropTableIfExists('cities');
};
