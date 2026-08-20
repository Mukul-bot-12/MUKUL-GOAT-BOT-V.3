const sleep = ms =>
  new Promise(resolve => setTimeout(resolve, ms));

module.exports = {
  config: {
    name: "mystery",
    version: "1.0.0",
    author: "Mukul",
    countDown: 10,
    role: 0,
    category: "fun",
    shortDescription: "Mysterious surprise",
    longDescription: "A mysterious cinematic fun command",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ message }) {
    try {
      const sent = await message.reply(
        "╭━━━━━━━━━━━━━━━━━━━━╮\n" +
        "       🕵️ MYSTERY\n" +
        "╰━━━━━━━━━━━━━━━━━━━━╯\n\n" +
        "🔮 Initializing mysterious system..."
      );

      await sleep(1800);

      await message.reply(
        "👁️ Unknown signal detected...\n" +
        "🌀 Searching the mystery...\n\n" +
        "████░░░░░░ 40%"
      );

      await sleep(1800);

      await message.reply(
        "🔐 Secret pattern found...\n" +
        "⚡ Analyzing...\n\n" +
        "████████░░ 80%"
      );

      await sleep(1800);

      const mysteries = [
        "😈 রহস্যের উত্তর পেয়ে গেছি...\n\nতুমি এই command-টা চালিয়েছো! 😂",
        "👀 System বলছে...\n\nতোমার curiosity অনেক বেশি! 🤣",
        "🔮 ভবিষ্যৎ থেকে signal এসেছে...\n\nআজ তুমি এই message-টাই পড়বে! 😆",
        "🕵️ Investigation complete...\n\nরহস্য হলো—রহস্যটা এখনো রহস্য! 🌀"
      ];

      const result =
        mysteries[
          Math.floor(
            Math.random() * mysteries.length
          )
        ];

      await message.reply(
        "╭━━━━━━━━━━━━━━━━━━━━╮\n" +
        "       🔮 RESULT\n" +
        "╰━━━━━━━━━━━━━━━━━━━━╯\n\n" +
        result +
        "\n\n" +
        "━━━━━━━━━━━━━━━━━━━━━━\n" +
        "👑 MUKUL BOT V3\n" +
        "━━━━━━━━━━━━━━━━━━━━━━"
      );

    } catch (error) {
      console.error(
        "MYSTERY ERROR:",
        error
      );

      return message.reply(
        "❌ Mystery system error!"
      );
    }
  }
};
