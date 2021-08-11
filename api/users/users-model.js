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
  return db("users").select("users.id", "users.username");
}

function getById(id) {
  return db("users").where({ id }).first();
}

function getBy(filter) {
  return db("users").where(filter);
}

function remove(id) {
  return db("users").where({ id }).del();
}

function modify(id, changes) {
  return db("users")
    .where({ id })
    .update(changes)
    .then(() => {
      return findById(id);
    });
}

async function add(user) {
  const [id] = await db("users").insert(user);
  return getById(id);
}
