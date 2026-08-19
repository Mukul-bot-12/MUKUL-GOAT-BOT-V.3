const axios = require("axios");

module.exports = {
	config: {
		name: "weather",
		aliases: ["w", "temp"],
		version: "1.0",
		author: "Mukul",
		countDown: 5,
		role: 0,
		shortDescription: "Check weather",
		longDescription: "Show current weather information for a city.",
		category: "tools",
		guide: "{pn} <city>"
	},

	onStart: async function ({ message, args }) {
		const city = args.join(" ");

		if (!city) {
			return message.reply(
				"🌤️ City-এর নাম দাও!\n\n" +
				"Example:\n" +
				".weather Dhaka"
			);
		}

		try {
			const url =
				"https://wttr.in/" +
				encodeURIComponent(city) +
				"?format=j1";

			const { data } = await axios.get(url, {
				timeout: 10000
			});

			const current = data.current_condition?.[0];

			if (!current) {
				return message.reply(
					"❌ Weather information পাওয়া যায়নি!"
				);
			}

			const temp = current.temp_C;
			const feels = current.FeelsLikeC;
			const humidity = current.humidity;
			const wind = current.windspeedKmph;
			const condition =
				current.weatherDesc?.[0]?.value || "Unknown";

			const text =
`🌤️ 𝗪𝗘𝗔𝗧𝗛 𝗥𝗘𝗣𝗢𝗥𝗧
━━━━━━━━━━━━━━━━━━━━

📍 Location: ${city}
🌡️ Temperature: ${temp}°C
🥵 Feels Like: ${feels}°C
☁️ Condition: ${condition}
💧 Humidity: ${humidity}%
💨 Wind: ${wind} km/h

👑 MUKUL GOAT BOT
━━━━━━━━━━━━━━━━━━━━`;

			return message.reply(text);

		} catch (error) {
			console.error("WEATHER ERROR:", error);

			return message.reply(
				"❌ Weather পাওয়া যাচ্ছে না।\n" +
				"City-এর নাম ঠিকভাবে লিখে আবার চেষ্টা করো।"
			);
		}
	}
};
