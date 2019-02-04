exports.up = function(knex, Promise) {
	return knex.schema.createTable('reflection', (table) => {
		table.increments();
		table.string('week', 32).notNullable();
		table.integer('fk').notNullable().references('id').inTable('users');
		table.string('journalEntry').notNullable();
		table.text('insights').notNullable();
		table.text('trends').notNullable();
		table.text('surprises').notNullable();
		table.timestamp('timestamp').defaultTo(knex.fn.now());
	});
};

exports.down = function(knex, Promise) {
	return knex.schema.dropTableIfExists('reflection');
};
