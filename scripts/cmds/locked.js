const lockedThreads = new Set();

module.exports = {
	config: {
		name: "lockchat",
		aliases: ["lock", "chatlock"],
		version: "1.0",
		author: "MUKUL",
		countDown: 3,
		role: 2,
		shortDescription: "Lock group chat",
		longDescription: "Lock/unlock group chat for normal members.",
		category: "admin",
		guide: "{pn} | {pn} on | {pn} off"
	},

	onStart: async function ({ message, args, event }) {
		const action = (args[0] || "on").toLowerCase();
		const threadID = event.threadID;

		if (action === "off" || action === "unlock") {
			lockedThreads.delete(threadID);

			return message.reply(
`🔓 𝗖𝗛𝗔𝗧 𝗨𝗡𝗟𝗢𝗖𝗞𝗘𝗗

এখন সবাই group-এ message করতে পারবে।

👑 MUKUL GOAT BOT`
			);
		}

		lockedThreads.add(threadID);

		return message.reply(
`🔒 𝗖𝗛𝗔𝗧 𝗟𝗢𝗖𝗞𝗘𝗗

⚠️ এখন সাধারণ members message করতে পারবে না।
👑 শুধু Admin/Owner message করতে পারবে।

🔓 Unlock:
.lockchat off

👑 MUKUL GOAT BOT`
		);
	},

	/**
	 * এই event message আসার পর execute হবে।
	 * তোমার GoatBot version-এ onChat support থাকলে কাজ করবে।
	 */
	onChat: async function ({ event, api }) {
		const threadID = event.threadID;

		if (!lockedThreads.has(threadID))
			return;

		// নিজের bot-এর message হলে ignore
		if (event.senderID === api.getCurrentUserID?.())
			return;

		// Group admin কিনা check
		try {
			const threadInfo =
				await api.getThreadInfo(threadID);

			const admins =
				threadInfo.adminIDs || [];

			const isAdmin =
				admins.some(
					(admin) =>
						(admin.id || admin) ===
						event.senderID
				);

			if (isAdmin)
				return;

			// Normal member-এর message delete
			if (event.messageID) {
				await api.unsendMessage(
					event.messageID
				);
			}

		} catch (error) {
			console.error(
				"LOCKCHAT ERROR:",
				error
			);
		}
	}
};
