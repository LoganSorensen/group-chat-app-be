exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("users")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("users").insert([
        {
          id: 1,
          username: "test1",
          password: "1234",
        },
        {
          id: 2,
          username: "test2",
          password: "1234",
        },
        {
          id: 3,
          username: "test3",
          password: "1234",
        },
        {
          id: 4,
          username: "test4",
          password: "1234",
        },
      ]);
    });
};
