exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("channels")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("channels").insert([
        {
          id: 1,
          channel_name: "Front End",
          channel_description: "A channel about front end stuff",
        },
        {
          id: 2,
          channel_name: "Back End",
          channel_description: "A channel about back end stuff",
        },
        {
          id: 3,
          channel_name: "Just JS",
          channel_description: "Just Javascript",
        },
      ]);
    });
};
