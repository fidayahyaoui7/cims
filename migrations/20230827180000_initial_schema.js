exports.up = function(knex) {
  return knex.schema
    .createTableIfNotExists('users', function(table) {
      table.increments('id').primary();
      table.string('name', 255).notNullable();
      table.string('email', 255).notNullable();
      table.string('password', 255).notNullable();
      table.string('role', 255).defaultTo('patient');
      table.boolean('is_verified').defaultTo(false);
      table.string('verification_token', 255).nullable();
      table.string('reset_password_token', 255).nullable();
      table.timestamp('reset_password_expires').nullable();
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
      
      table.unique(['email']);
    })
    .createTableIfNotExists('appointments', function(table) {
      table.increments('id').primary();
      table.integer('user_id').unsigned().references('id').inTable('users');
      table.string('patient_name', 255).notNullable();
      table.string('doctor_name', 255).notNullable();
      table.date('appointment_date').notNullable();
      table.time('appointment_time').notNullable();
      table.string('status', 255).defaultTo('scheduled');
      table.text('notes').nullable();
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('appointments')
    .dropTableIfExists('users');
};
