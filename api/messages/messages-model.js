const db = require("../../data/db-config");

module.exports = {
  getAll,
  getById,
  getBy,
  remove,
  modify,
  add,
};

function getAll() {
  return db("messages")
    .join("users", "messages.user_id", "users.id")
    .select(
      "messages.id",
      "messages.created_at",
      "messages.message_text",
      "messages.user_id",
      "messages.channel_id",
      "users.profileImg"
    );
}

function getById(id) {
  return db("messages").where({ id }).first();
}

function getBy(filter) {
  return db("messages")
    .where(filter)
    .join("users", "messages.user_id", "users.id")
    .select(
      "users.username as user",
      "users.profileImg",
      "messages.id",
      "messages.created_at as timestamp",
      "messages.message_text as text",
      "messages.user_id",
      "messages.channel_id"
    );
}

function remove(id) {
  return db("messages").where({ id }).del();
}

function modify(id, changes) {
  return db("messages")
    .where({ id })
    .update(changes)
    .then(() => {
      return getById(id);
    });
}

async function add(message) {
  const [id] = await db("messages").insert(message);
  return getById(id);
}
