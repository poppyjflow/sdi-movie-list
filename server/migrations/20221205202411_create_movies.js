/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
  .createTable('movies', table => {
    table.increments('id'); // adds an auto incrementing PK column
    table.string('title').notNullable();
  })
  // .createTable('chores', table => {
  //   table.increments('id'); // adds an auto incrementing PK column
  //   table.string('chore_name').notNullable();
  //   table.string('frequency').notNullable();
  // })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('movies')
};
