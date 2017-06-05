"use strict";

const utility = {
  showIntroScreen() {
    return !localStorage.getItem("visited");
  },

  getChatHash(otherUserId, currentUserId) {
    if (otherUserId > currentUserId) {
      return "chat_" + otherUserId + "_" + currentUserId;
    }
    else {
      return "chat_" +  currentUserId + "_" + otherUserId;
    }
  }
};

module.exports = utility;
