module.exports = {
  config: {
    name: "adm",
    version: "1.0.0",
    author: "Mukul",
    countDown: 3,
    role: 2,
    category: "admin",
    shortDescription: "Admin add/remove",
    longDescription: "Add or remove users from bot admin list",
    guide: {
      en: "{pn} add @user | {pn} remove @user | {pn} list"
    }
  },

  onStart: async function ({ message, event, args }) {
    const action = args[0]?.toLowerCase();

    // এখানে তোমার মূল Bot Admin UID বসাও
    const OWNER_UID = "YOUR_ADMIN_UID";

    // GoatBot-এর বর্তমান admin list
    if (!global.GoatBot.config.adminBot)
      global.GoatBot.config.adminBot = [];

    const admins = global.GoatBot.config.adminBot;

    // Owner সবসময় admin থাকবে
    if (!admins.includes(OWNER_UID))
      admins.push(OWNER_UID);

    // শুধু Admin ব্যবহার করতে পারবে
    if (!admins.includes(event.senderID)) {
      return message.reply(
        "❌ Permission Denied!\n\n" +
        "শুধু Bot Admin এই কমান্ড ব্যবহার করতে পারবে।"
      );
    }

    // =========================
    // ADMIN LIST
    // =========================
    if (action === "list") {
      if (admins.length === 0)
        return message.reply("❌ কোনো Admin পাওয়া যায়নি।");

      let text = "👑 BOT ADMIN LIST\n\n";

      admins.forEach((uid, index) => {
        text += `${index + 1}. ${uid}\n`;
      });

      return message.reply(text);
    }

    // =========================
    // GET TARGET UID
    // =========================
    let targetUID = null;

    // Mention
    if (event.mentions && Object.keys(event.mentions).length > 0) {
      targetUID = Object.keys(event.mentions)[0];
    }

    // Reply
    else if (event.messageReply) {
      targetUID = event.messageReply.senderID;
    }

    // UID
    else if (args[1]) {
      targetUID = args[1].replace(/[^\d]/g, "");
    }

    if (!targetUID) {
      return message.reply(
        "❌ একজন User নির্বাচন করো।\n\n" +
        "Example:\n" +
        "adm add @user\n" +
        "adm remove @user\n" +
        "adm add 100012345678"
      );
    }

    // =========================
    // ADD ADMIN
    // =========================
    if (action === "add") {
      if (admins.includes(targetUID)) {
        return message.reply(
          `⚠️ User already Admin!\n\nUID: ${targetUID}`
        );
      }

      admins.push(targetUID);

      return message.reply(
        "✅ ADMIN ADDED\n\n" +
        `👤 UID: ${targetUID}\n` +
        "👑 Status: Bot Admin"
      );
    }

    // =========================
    // REMOVE ADMIN
    // =========================
    if (action === "remove") {
      if (targetUID === OWNER_UID) {
        return message.reply(
          "❌ Main Owner-কে Admin list থেকে remove করা যাবে না।"
        );
      }

      const index = admins.indexOf(targetUID);

      if (index === -1) {
        return message.reply(
          `⚠️ এই User Admin নয়।\n\nUID: ${targetUID}`
        );
      }

      admins.splice(index, 1);

      return message.reply(
        "✅ ADMIN REMOVED\n\n" +
        `👤 UID: ${targetUID}\n` +
        "🚫 Status: Removed"
      );
    }

    // =========================
    // HELP
    // =========================
    return message.reply(
      "👑 ADMIN COMMAND\n\n" +
      "➤ adm add @user\n" +
      "➤ adm remove @user\n" +
      "➤ adm list\n\n" +
      "Reply করে User নির্বাচন করেও ব্যবহার করতে পারো।"
    );
  }
};
