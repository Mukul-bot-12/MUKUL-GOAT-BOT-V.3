const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
	config: {
		name: "owner",
		aliases: ["boss", "mukul"],
		version: "1.0",
		author: "MUKUL",
		countDown: 5,
		role: 0,
		shortDescription: "Show owner information",
		longDescription: "Shows MUKUL BOSS owner information with profile picture.",
		category: "info",
		guide: "{pn}"
	},

	onStart: async function ({ message, event }) {
		const threadID = event.threadID;

		const ownerInfo = {
			name: "🅢🅚 🅜🅤🅚🅤🅛 🅑🅞🅢🅢",
			nick: "XMUKULBOT",
			age: "18",
			gender: "Male",
			from: "Rangpur, Bangladesh",
			religion: "Islam",
			status: "Single",
			dream: "😛 Bou",
			hobby: "Gaming, Coding"
		};

		const msg =
`╔═════ ∘◦ ☆ ◦∘ ═════╗
       🎀 𝐎𝐖𝐍𝐄𝐑 𝐈𝐍𝐅𝐎 🎀
━━━━━━━━━━━━━━━━━━

🏷️ 𝐍𝐚𝐦𝐞 : ${ownerInfo.name}
🏷️ 𝐍𝐢𝐜𝐤𝐧𝐚𝐦𝐞 : ${ownerInfo.nick}
🎂 𝐀𝐠𝐞 : ${ownerInfo.age}
⚧️ 𝐆𝐞𝐧𝐝𝐞𝐫 : ${ownerInfo.gender}
🌍 𝐅𝐫𝐨𝐦 : ${ownerInfo.from}
🕋 𝐑𝐞𝐥𝐢𝐠𝐢𝐨𝐧 : ${ownerInfo.religion}
❤️ 𝐒𝐭𝐚𝐭𝐮𝐬 : ${ownerInfo.status}
😶 𝐃𝐫𝐞𝐚𝐦 : ${ownerInfo.dream}
🎯 𝐇𝐨𝐛𝐛𝐲 : ${ownerInfo.hobby}

━━━━━━━━━━━━━━━━━━
💫 𝐓𝐡𝐚𝐧𝐤 𝐲𝐨𝐮 𝐟𝐨𝐫 𝐰𝐚𝐭𝐜𝐡𝐢𝐧𝐠
📝 𝐀𝐧𝐲 𝐩𝐫𝐨𝐛𝐥𝐞𝐦? 𝐓𝐚𝐥𝐤 𝐭𝐨 𝐚𝐝𝐦𝐢𝐧.
╚═════ ∘◦ ☆ ◦∘ ═════╝`;

		const imageUrl =
			"https://i.imgur.com/w6ZA3hR.jpeg";

		const cacheDir = path.join(__dirname, "cache");
		const imagePath = path.join(
			cacheDir,
			"mukul-owner.jpg"
		);

		try {
			await fs.ensureDir(cacheDir);

			const response = await axios.get(imageUrl, {
				responseType: "arraybuffer",
				timeout: 15000
			});

			await fs.writeFile(
				imagePath,
				Buffer.from(response.data)
			);

			await message.reply({
				body: msg,
				attachment: fs.createReadStream(imagePath)
			});

		} catch (error) {
			console.error(
				"OWNER IMAGE ERROR:",
				error.message
			);

			// ছবি download না হলে text-only fallback
			await message.reply(msg);
		}
	}
};
