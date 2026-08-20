const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");

module.exports = {
  config: {
    name: "uid",
    version: "4.0.0",
    author: "Mukul",
    countDown: 5,
    role: 0,
    category: "info",
    shortDescription: "Profile + UID",
    longDescription: "Show profile picture, name and UID",
    guide: {
      en: "{pn}\n{pn} @mention\nReply to a message and use {pn}"
    }
  },

  onStart: async function ({ api, event, message }) {
    const cacheDir = path.join(__dirname, "cache");

    try {
      await fs.ensureDir(cacheDir);

      // =========================
      // TARGET UID
      // =========================

      let uid = event.senderID;

      // Reply হলে
      if (event.messageReply?.senderID) {
        uid = event.messageReply.senderID;
      }

      // Mention হলে
      const mentions = event.mentions
        ? Object.keys(event.mentions)
        : [];

      if (mentions.length > 0) {
        uid = mentions[0];
      }

      // =========================
      // USER INFO
      // =========================

      const userInfo = await api.getUserInfo(uid);
      const user = userInfo?.[uid];

      if (!user) {
        return message.reply(
          "❌ User information পাওয়া যায়নি।"
        );
      }

      const name = user.name || "Facebook User";

      // =========================
      // PROFILE URL
      // =========================

      const avatarURL =
        user.thumbSrc ||
        user.profilePic ||
        user.avatarUrl;

      if (!avatarURL) {
        return message.reply(
          `👤 Name: ${name}\n` +
          `🆔 UID: ${uid}\n\n` +
          "❌ এই User-এর profile picture URL পাওয়া যায়নি।"
        );
      }

      const avatarPath = path.join(
        cacheDir,
        `uid_avatar_${uid}.jpg`
      );

      const outputPath = path.join(
        cacheDir,
        `uid_result_${uid}.png`
      );

      // =========================
      // DOWNLOAD IMAGE
      // =========================

      const response = await axios.get(
        avatarURL,
        {
          responseType: "arraybuffer",
          timeout: 20000,
          headers: {
            "User-Agent": "Mozilla/5.0"
          }
        }
     
