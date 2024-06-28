/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable("users", {
    id: { type: "text", primaryKey: true },
    email: { type: "text", notNull: true, unique: true },
  });

  pgm.createTable("todos", {
    id: { type: "id", primaryKey: true },
    content: { type: "text", notNull: true },
    priority: { type: "text" },
    user_id: {
      type: "text",
      notNull: true,
      references: '"users"',
      onDelete: "CASCADE",
    },
  });

  pgm.createIndex("todos", "user_id");
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable("todos");
  pgm.dropTable("users");
};
