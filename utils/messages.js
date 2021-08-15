const moment = require("moment");

function formatMessage(user, text) {
  return {
    user,
    text,
    timestamp: moment().calendar(),
  };
}

module.exports = formatMessage;
