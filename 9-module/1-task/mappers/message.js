module.exports = function mapMessage(messages) {
  return messages.map(message => {
       const {date, text, user, _id} = message;
        return {date, text, user, id: _id};
    })
  };
  