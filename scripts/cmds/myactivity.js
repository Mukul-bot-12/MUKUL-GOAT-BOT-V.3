const fs = require("fs-extra");
const path = require("path");

const ADMIN_UID = "61574286011307";

const DATA_DIR = path.join(__dirname, "cache");
const DATA_FILE = path.join(DATA_DIR, "self-activity.json");

async function loadData() {
	await fs.ensureDir(DATA_DIR);

	if (!(await fs.pathExists(DATA_FILE))) {
		const data = { messages: [] };
		await fs.writeJson(DATA_FILE, data, { spaces: 2 });
		return data;
	}

	try {
		const data = await fs.readJson(DATA_FILE);
		if (!data.messages) data.messages = [];
		return data;
	} catch {
		return { messages: [] };
	}
}

async function saveData(data) {
	await fs.ensureDir(DATA_DIR);
	await fs.writeJson(DATA_FILE, data, { spaces: 2 });
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
		aliases: ["myact"],
		version: "1.0.0",
		author: "MUKUL",
		countDown: 5,
		role: 0,
		category: "admin",
		shortDescription: "Show your own message activity",
		guide: "{pn}"
	},

	onStart: async function ({ message, event }) {
		const uid = String(event.senderID);

		if (uid !== ADMIN_UID) {
			return message.reply(
				"❌ Access denied.\n👑 Only MUKUL ADMIN can use this command."
			);
		}

		const data = await loadData();

		if (!data.messages.length) {
			return message.reply(
				"📭 তোমার কোনো message activity পাওয়া যায়নি।"
			);
		}

		const recent = data.messages.slice(-20).reverse();

		let msg =
`╭━━━━━━━━━━━━━━━━━━╮
   👑 MUKUL ACTIVITY
   『 MY MESSAGES 』
╰━━━━━━━━━━━━━━━━━━╯

`;

		for (const item of recent) {
			msg +=
`📝 ${item.text}
🕐 ${item.time}
🆔 Group: ${item.threadID}

━━━━━━━━━━━━━━━━━━

`;
		}

		msg +=
`📊 Showing: ${recent.length}
🕐 ${getBDTime()}`;

		return message.reply(msg);
	},

	onChat: async function ({ event }) {
		try {
			const uid = String(event.senderID);

			// শুধু ADMIN-এর নিজের message লগ হবে
			if (uid !== ADMIN_UID)
				return;

			if (!event.body)
				return;

			const text = String(event.body).trim();

			if (!text)
				return;

			const data = await loadData();

			data.messages.push({
				text,
				threadID: String(event.threadID || "unknown"),
				time: getBDTime()
			});

			// সর্বোচ্চ 50টি নিজের message রাখা হবে
			if (data.messages.length > 50) {
				data.messages =
					data.messages.slice(-50);
			}

			await saveData(data);

		} catch (error) {
			console.error(
				"MyActivity error:",
				error.message
			);
		}
	}
};
