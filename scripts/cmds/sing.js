const axios = require("axios");

module.exports = {
	config: {
		name: "sing",
		version: "1.0",
		author: "MUKUL",
		countDown: 5,
		role: 0,
		shortDescription: "Sing a song",
		longDescription: "Search and play a song.",
		category: "media",
		guide: "{pn} <song name>"
	},

	onStart: async function ({ message, args }) {
		if (!args.length) {
			return message.reply(
				"🎵 | একটি গানের নাম লিখুন।\n\nউদাহরণ:\n.sing Kesariya"
			);
		}

		const song = args.join(" ");

		try {
			// এখানে তোমার trusted music API endpoint বসাতে হবে
			const api = `YOUR_API_URL?q=${encodeURIComponent(song)}`;

			const res = await axios.get(api, {
				timeout: 15000
			});

			if (!res.data || !res.data.url) {
				return message.reply(
					`❌ "${song}" এর কোনো result পাওয়া যায়নি।`
				);
			}

			const audio = await global.utils.getStreamFrom
