exports.up = function (knex) {
  return knex.schema
    .createTable("users", (user) => {
      user.increments("id");
      user.string("username", 128).notNullable().unique();
      user.string("password", 128).notNullable();
      user.timestamp("created_at").defaultTo(knex.fn.now());
      user.string("profileImg").defaultTo(null);
    })
    .createTable("channels", (channel) => {
      channel.increments("id");
      channel.string("channel_name").notNullable().unique();
      channel.text("channel_description").notNullable();
    })
    .createTable("messages", (message) => {
      message.increments("id");
      message.timestamp("created_at").defaultTo(knex.fn.now());
      message.text("message_text").notNullable();
      message
        .integer("user_id")
        .notNullable()
        .unsigned()
        .references("id")
        .inTable("users")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      message
        .integer("channel_id")
        .notNullable()
        .unsigned()
        .references("id")
        .inTable("channels")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    });
};
exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("messages")
    .dropTableIfExists("channels")
    .dropTableIfExists("users");
};
