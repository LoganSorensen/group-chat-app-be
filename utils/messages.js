const moment = require("moment");

function formatMessage(user, profileImg, text) {
  return {
    user,
    profileImg,
    text,
    timestamp: moment().calendar(),
  };
}

module.exports = formatMessage;
