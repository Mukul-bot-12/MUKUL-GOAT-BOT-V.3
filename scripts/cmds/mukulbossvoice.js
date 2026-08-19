const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
	config: {
		name: "mukulbossvoice",
		version: "1.0",
		author: "Mukul",
		category: "events"
	},

	onStart: async function () {},

	onChat: async function ({ event, message }) {
		if (!event.body) return;

		const text = event.body
			.toLowerCase()
			.replace(/\s+/g, " ")
			.trim();

		if (!text.includes("@sk mukul boss")) return;

		const voiceText =
			"আমার মুকুল বস অফলাইনে আছে। যা বলার আমাকে বলো।";

		const filePath = path.join(
			__dirname,
			"mukul_boss_voice.mp3"
		);

		try {
			const url =
				"https://translate.google.com/translate_tts" +
				"?ie=UTF-8" +
				"&client=tw-ob" +
				"&tl=bn" +
				"&q=" +
				encodeURIComponent(voiceText);

			const response = await axios.get(url, {
				responseType: "arraybuffer",
				timeout: 15000,
				headers: {
					"User-Agent": "Mozilla/5.0"
				}
			});

			await fs.writeFile(filePath, response.data);

			return message.reply({
				attachment: fs.createReadStream(filePath)
			});

		} catch (error) {
			console.error("MUKUL BOSS VOICE ERROR:", error);

			return message.reply(
				"আমার মুকুল বস অফলাইনে আছে। যা বলার আমাকে বলো।"
			);
		}
	}
};
