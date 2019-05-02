exports.up = function (knex, Promise) {
    // the tables most be created in the right order,
    // tables with FK are created after the referenced table is created
    return knex.schema
        .createTable('tracks', tbl => {
            tbl.increments();

            tbl
                .string('name', 128)
                .notNullable()
                .unique();
        })
        .createTable('cohorts', tbl => {
            // the tracks table must be created before this table is created
            tbl.increments();

            tbl
                .string('name', 128)
                .notNullable()
                .unique();

            tbl
                .integer('track_id')
                .unsigned()
                .notNullable()
                .references('id')
                .inTable('tracks')
                .onDelete('RESTRICT')
                .onUpdate('CASCADE');
        })
        .createTable('students', tbl => {
            tbl.increments();

            tbl.string('name', 128).notNullable();
        })
        .createTable('cohort_students', tbl => {
            // the students and cohorts tables must be created before this table is created
            tbl.increments();

            tbl
                .integer('cohort_id')
                .unsigned()
                .notNullable()
                .references('id')
                .inTable('cohorts')
                .onDelete('RESTRICT')
                .onUpdate('CASCADE');

            tbl
                .integer('student_id')
                .unsigned()
                .notNullable()
                .references('id')
                .inTable('students')
                .onDelete('RESTRICT')
                .onUpdate('CASCADE');
        });
};

exports.down = function (knex, Promise) {
    // tables with FK must be removed before the referenced table is removed
    return knex.schema
        .dropTableIfExists('cohort_students')
        .dropTableIfExists('students')
        .dropTableIfExists('cohorts')
        .dropTableIfExists('tracks');
};