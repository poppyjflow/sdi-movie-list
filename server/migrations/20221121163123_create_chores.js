/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = function(knex) {
  return knex.schema
  .createTable('kids', table => {
    table.increments('id'); // adds an auto incrementing PK column
    table.string('fname').notNullable();
    table.string('callsign').notNullable();
    table.integer('room_num').notNullable();
  })
  .createTable('chores', table => {
    table.increments('id'); // adds an auto incrementing PK column
    table.string('chore_name').notNullable();
    table.string('frequency').notNullable();
  })
  .createTable('chores_list', table => {
      table.increments('id'); // adds an auto incrementing PK column
      table.integer('kids_id').references('id').inTable('kids').notNullable().onDelete('cascade');
      table.integer('chores_id').references('id').inTable('chores').notNullable().onDelete('cascade');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('chores_list')
    .dropTableIfExists('kids')
    .dropTableIfExists('chore_frequencies');
};
