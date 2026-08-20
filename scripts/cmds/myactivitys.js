const fs = require("fs-extra");
const path = require("path");

const ADMIN_UID = "61574286011307";

const DATA_DIR = path.join(__dirname, "cache");
const DATA_FILE = path.join(DATA_DIR, "myactivity.json");

async function getData() {
  await fs.ensureDir(DATA_DIR);

  if (!(await fs.pathExists(DATA_FILE))) {
    const data = { messages: [] };
    await fs.writeJson(DATA_FILE, data, { spaces: 2 });
    return data;
  }

  try {
    const data = await fs.readJson(DATA_FILE);

    if (!data || typeof data !== "object") {
      return { messages: [] };
    }

    if (!Array.isArray(data.messages)) {
      data.messages = [];
    }

    return data;
  } catch (error) {
    console.error("READ DATA ERROR:", error.message);
    return { messages: [] };
  }
}

async function saveData(data) {
  await fs.ensureDir(DATA_DIR);
  await fs.writeJson(DATA_FILE, data, {
    spaces: 2
  });
}

function getBDTime() {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Dhaka",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).format(new Date());
}

module.exports = {
  config: {
    name: "myactivity",
    aliases: ["myact", "myactivity"],
    version: "2.0.0",
    author: "MUKUL",
    countDown: 5,
    role: 0,
    category: "admin",
    shortDescription: "Show your own message activity",
    longDescription: "Save and show MUKUL ADMIN's own messages",
    guide: {
      en: "{pn}\n{pn} clear"
    }
  },

  // ==========================================
  // SHOW ACTIVITY
  // ==========================================

  onStart: async function ({ message, event, args }) {
    try {
      const uid = String(event.senderID);

      // Only MUKUL ADMIN
      if (uid !== ADMIN_UID) {
        return message.reply(
          "❌ ACCESS DENIED\n\n" +
          "👑 শুধু MUKUL ADMIN এই command ব্যবহার করতে পারবে।"
        );
      }

      // Clear activity
      if (
        args[0] &&
        args[0].toLowerCase() === "clear"
      ) {
        await saveData({
          messages: []
        });

        return message.reply(
          "✅ তোমার Activity History clear করা হয়েছে।"
        );
      }

      const data = await getData();

      if (!data.messages.length) {
        return message.reply(
          "📭 এখনো কোনো message activity save হয়নি।\n\n" +
          "আগে একটি message পাঠাও, তারপর আবার:\n" +
          "!myactivity"
        );
      }

      const recent =
        data.messages
          .slice(-20)
          .reverse();

      let msg =
`╭━━━━━━━━━━━━━━━━━━╮
   👑 MUKUL ACTIVITY
   『 MY MESSAGES 』
╰━━━━━━━━━━━━━━━━━━╯

`;

      recent.forEach((item, index) => {
        msg +=
`#${index + 1}
📝 ${item.text}
🕐 ${item.time}
🆔 Group: ${item.threadID}

━━━━━━━━━━━━━━━━━━

`;
      });

      msg +=
`📊 Showing: ${recent.length}
📦 Saved: ${data.messages.length}
🕐 Now: ${getBDTime()}`;

      return message.reply(msg);

    } catch (error) {
      console.error(
        "MYACTIVITY COMMAND ERROR:",
        error
      );

      return message.reply(
        "❌ Activity দেখাতে সমস্যা হয়েছে।\n" +
        "Console-এ error check করো।"
      );
    }
  },

  // ==========================================
  // MESSAGE LISTENER
  // ==========================================

  onChat: async function ({ event }) {
    try {
      if (!event) return;

      const uid = String(
        event.senderID || ""
      );

      // শুধু ADMIN-এর message
      if (uid !== ADMIN_UID) {
        return;
      }

      // Message body না থাকলে skip
      if (
        typeof event.body !== "string"
      ) {
        return;
      }

      const text =
        event.body.trim();

      if (!text) return;

      // Activity command নিজে log না করা
      const lowerText =
        text.toLowerCase();

      if (
        lowerText === "!myactivity" ||
        lowerText === "myactivity" ||
        lowerText === "!myact" ||
        lowerText === "myact"
      ) {
        return;
      }

      const data = await getData();

      data.messages.push({
        text: text.substring(0, 1000),
        threadID: String(
          event.threadID || "unknown"
        ),
        time: getBDTime()
      });

      // Maximum 50 messages
      if (data.messages.length > 50) {
        data.messages =
          data.messages.slice(-50);
      }

      await saveData(data);

      console.log(
        `[MYACTIVITY] Saved: ${text}`
      );

    } catch (error) {
      console.error(
        "MYACTIVITY onChat ERROR:",
        error
      );
    }
  }
};
