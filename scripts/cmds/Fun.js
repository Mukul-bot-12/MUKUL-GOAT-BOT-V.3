module.exports = {
  config: {
    name: "fun",
    version: "1.0.0",
    author: "Mukul",
    countDown: 3,
    role: 0,
    category: "fun",
    shortDescription: "10 fun commands",
    guide: {
      en: "{pn} joke\n{pn} roast\n{pn} marry\n{pn} hug\n{pn} slap\n{pn} dance\n{pn} love\n{pn} ship\n{pn} rate\n{pn} lucky"
    }
  },

  onStart: async function ({ message, args, event }) {
    const cmd = (args[0] || "").toLowerCase();

    const target =
      Object.keys(event.mentions || {})[0] ||
      event.messageReply?.senderID ||
      event.senderID;

    const commands = {
      joke: "🤣 আজকের Joke: Bot তোমার Wi-Fi password জানে! 😆",

      roast: `🔥 Roast: ${target}\nআজ তোমাকে দেখে Google-ও বলবে—"No results found!" 😂`,

      marry: `💍 Marriage Result:\n${target} আজ VIP বর/কনে! 😎`,

      hug: `🤗 Hug Result:\n${target}-কে একটা virtual hug!`,

      slap: `👋 Slap Result:\n${target} — আর দুষ্টুমি না! 😂`,

      dance: `💃 Dance Result:\n${target} এখন Virtual Dance Floor-এ! 🕺`,

      love: `❤️ Love Result:\n${target} আজ Bot-এর favourite user! 😄`,

      ship: `🚢 Ship Result:\n${target} + Mukul Bot = 100% Friendship 🤝`,

      rate: `⭐ Rate Result:\n${target} — 10/10 😎`,

      lucky: `🍀 Lucky Result:\n${target} আজকের Lucky Number: ${
        Math.floor(Math.random() * 100) + 1
      }`
    };

    if (!commands[cmd]) {
      return message.reply(
        "🎮 FUN MENU\n\n" +
        "1️⃣ joke\n" +
        "2️⃣ roast\n" +
        "3️⃣ marry\n" +
        "4️⃣ hug\n" +
        "5️⃣ slap\n" +
        "6️⃣ dance\n" +
        "7️⃣ love\n" +
        "8️⃣ ship\n" +
        "9️⃣ rate\n" +
        "🔟 lucky\n\n" +
        "Example: fun joke"
      );
    }

    return message.reply(commands[cmd]);
  }
};
