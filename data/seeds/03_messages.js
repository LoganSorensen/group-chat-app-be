exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("messages")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("messages").insert([
        {
          id: 1,
          created_at: Date.now(),
          message_text: "some text",
          user_id: 1,
          channel_id: 1,
        },
        {
          id: 2,
          created_at: Date.now(),
          message_text: "some text",
          user_id: 1,
          channel_id: 2,
        },
        {
          id: 3,
          created_at: Date.now(),
          message_text: "some text",
          user_id: 2,
          channel_id: 3,
        },
        {
          id: 4,
          created_at: Date.now(),
          message_text: "some text",
          user_id: 3,
          channel_id: 2,
        },
        {
          id: 5,
          created_at: Date.now(),
          message_text: "some text",
          user_id: 4,
          channel_id: 1,
        },
      ]);
    });
};
