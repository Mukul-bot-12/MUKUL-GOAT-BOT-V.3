module.exports = {
  config: {
    name: "out",
    version: "1.0.0",
    author: "Mukul",
    countDown: 5,
    role: 2,
    category: "admin",
    shortDescription: "Bot leaves the group",
    longDescription: "Make the bot leave the current group",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ api, event, message }) {
    try {
      await message.reply(
        "👋 বিদায়!\n\nএই গ্রুপ থেকে Bot এখন Leave নিচ্ছে..."
      );

      setTimeout(() => {
        api.removeUserFromGroup(
          api.getCurrentUserID(),
          event.threadID
        );
      }, 1500);

    } catch (error) {
      console.error("OUT ERROR:", error);

      return message.reply(
        "❌ Bot গ্রুপ থেকে Leave নিতে পারেনি।"
      );
    }
  }
};
