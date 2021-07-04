exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("messages")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("messages").insert([
        {
          id: 1,
          message_title: "message1",
          message_text: "some text",
          user_id: 1,
          channel_id: 1,
        },
        {
          id: 2,
          message_title: "message2",
          message_text: "some text",
          user_id: 1,
          channel_id: 2,
        },
        {
          id: 3,
          message_title: "message3",
          message_text: "some text",
          user_id: 2,
          channel_id: 3,
        },
        {
          id: 4,
          message_title: "message4",
          message_text: "some text",
          user_id: 3,
          channel_id: 2,
        },
        {
          id: 5,
          message_title: "message5",
          message_text: "some text",
          user_id: 4,
          channel_id: 1,
        },
      ]);
    });
};
