const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");

module.exports = {
  config: {
    name: "uid",
    version: "3.0.0",
    author: "Mukul",
    countDown: 5,
    role: 0,
    category: "info",
    shortDescription: "Show profile and UID",
    longDescription: "Show Facebook profile picture, name and UID",
    guide: {
      en: "{pn}\n{pn} @mention\nReply + {pn}"
    }
  },

  onStart: async function ({ api, event, message }) {
    const cacheDir = path.join(__dirname, "cache");
    await fs.ensureDir(cacheDir);

    try {
      // Target UID
      let uid = event.senderID;

      // Reply priority
      if (event.messageReply?.senderID) {
        uid = event.messageReply.senderID;
      }

      // Mention priority
      if (event.mentions && Object.keys(event.mentions).length > 0) {
        uid = Object.keys(event.mentions)[0];
      }

      // Get Facebook user information
      const userInfo = await api.getUserInfo(uid);
      const user = userInfo?.[uid];

      if (!user) {
        return message.reply("❌ User information পাওয়া যায়নি।");
      }

      const name = user.name || "Facebook User";

      // GoatBot/FCA থেকে profile picture URL
      const avatarURL =
        user.thumbSrc ||
        user.profileUrl ||
        user.avatarUrl;

      if (!avatarURL) {
        return message.reply(
          `👤 Name: ${name}\n🆔 UID: ${uid}\n\n❌ Profile picture URL পাওয়া যায়নি।`
        );
      }

      const avatarPath = path.join(
        cacheDir,
        `avatar_${uid}.jpg`
      );

      const outputPath = path.join(
        cacheDir,
        `uid_${uid}.png`
      );

      // Download profile picture
      const response = await axios.get(avatarURL, {
        responseType: "arraybuffer",
        timeout: 20000,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
        }
      });

      await fs.writeFile(
        avatarPath,
        Buffer.from(response.data)
      );

      // Load image
      const avatar = await loadImage(avatarPath);

      // Canvas
      const canvas = createCanvas(1200, 800);
      const ctx = canvas.getContext("2d");

      // Background
      const gradient = ctx.createLinearGradient(
        0,
        0,
        1200,
        800
      );

      gradient.addColorStop(0, "#050505");
      gradient.addColorStop(0.5, "#172554");
      gradient.addColorStop(1, "#2563eb");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1200, 800);

      // Card
      ctx.fillStyle = "rgba(0,0,0,0.45)";
      roundRect(ctx, 70, 50, 1060, 700, 35);
      ctx.fill();

      // Profile circle
      const centerX = 600;
      const centerY = 270;
      const radius = 175;

      // Border
      ctx.beginPath();
      ctx.arc(
        centerX,
        centerY,
        radius + 12,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = "#ffffff";
      ctx.fill();

      // Clip profile image
      ctx.save();

      ctx.beginPath();
      ctx.arc(
        centerX,
        centerY,
        radius,
        0,
        Math.PI * 2
      );
      ctx.clip();

      ctx.drawImage(
        avatar,
        centerX - radius,
        centerY - radius,
        radius * 2,
        radius * 2
      );

      ctx.restore();

      // Name
      ctx.textAlign = "center";
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 48px Sans";

      let displayName = name;

      if (displayName.length > 25) {
        displayName =
          displayName.substring(0, 22) + "...";
      }

      ctx.fillText(
        displayName,
        centerX,
        525
      );

      // UID
      ctx.font = "bold 32px Sans";
      ctx.fillStyle = "#bfdbfe";

      ctx.fillText(
        `UID: ${uid}`,
        centerX,
        585
      );

      // Footer
      ctx.font = "bold 26px Sans";
      ctx.fillStyle = "#ffffff";

      ctx.fillText(
        "MUKUL BOT • USER PROFILE",
        centerX,
        665
      );

      // Save
      await fs.writeFile(
        outputPath,
        canvas.toBuffer("image/png")
      );

      // Send
      await message.reply({
        body:
          `👤 Name: ${name}\n` +
          `🆔 UID: ${uid}`,
        attachment: fs.createReadStream(outputPath)
      });

      // Delete cache
      setTimeout(async () => {
        try {
          await fs.remove(avatarPath);
          await fs.remove(outputPath);
        } catch (e) {}
      }, 60000);

    } catch (error) {
      console.error("UID ERROR:", error);

      return message.reply(
        "❌ Profile picture load করা যায়নি।\n\n" +
        "সম্ভবত Facebook profile image URL এই bot session-এ পাওয়া যাচ্ছে না।"
      );
    }
  }
};


// Rounded rectangle
function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();

  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);

  ctx.quadraticCurveTo(
    x + width,
    y,
    x + width,
    y + radius
  );

