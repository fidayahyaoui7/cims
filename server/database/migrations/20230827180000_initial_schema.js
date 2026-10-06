exports.up = function(knex) {
  return knex.schema
    .createTable('users', function(table) {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('email').unique().notNullable();
      table.string('password').notNullable();
      table.string('role').defaultTo('patient');
      table.boolean('is_verified').defaultTo(false);
      table.string('verification_token').nullable();
      table.string('reset_password_token').nullable();
      table.timestamp('reset_password_expires').nullable();
      table.timestamps(true, true);
    })
    .createTable('appointments', function(table) {
      table.increments('id').primary();
      table.integer('user_id').unsigned().references('id').inTable('users');
      table.string('patient_name').notNullable();
      table.string('doctor_name').notNullable();
      table.date('appointment_date').notNullable();
      table.time('appointment_time').notNullable();
      table.string('status').defaultTo('scheduled');
      table.text('notes').nullable();
      table.timestamps(true, true);
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('appointments')
    .dropTableIfExists('users');
};
