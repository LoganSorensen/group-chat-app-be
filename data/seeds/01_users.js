exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("users")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("users").insert([
        {
          id: 1,
          email: "test1@123.com",
          password: "1234",
        },
        {
          id: 2,
          email: "test2@123.com",
          password: "1234",
        },
        {
          id: 3,
          email: "test3@123.com",
          password: "1234",
        },
        {
          id: 4,
          email: "test4@123.com",
          password: "1234",
        },
      ]);
    });
};
