const axios = require("axios");

const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;

const fontUrl =
	"https://raw.githubusercontent.com/Azadwebapi/Azadx69x-bm-store/main/font.json";

const categoryUrl =
	"https://raw.githubusercontent.com/Azadwebapi/Azadx69x-bm-store/main/category.json";

const imageUrl =
	"https://i.imgur.com/w6ZA3hR.jpeg";

let fontMap = {};
let categoryMap = {};
let isLoading = false;

// ================================
// LOAD FONT
// ================================
async function loadFont() {
	try {
		const res = await axios.get(fontUrl, {
			timeout: 5000
		});

		fontMap = res.data || {};

		console.log(
			"✅ XMUKUL Font loaded:",
			Object.keys(fontMap).length
		);
	} catch (err) {
		console.error(
			"❌ Font load failed:",
			err.message
		);

		fontMap = {};
	}
}

// ================================
// LOAD CATEGORY
// ================================
async function loadCategory() {
	if (isLoading)
		return;

	isLoading = true;

	try {
		const res = await axios.get(categoryUrl, {
			timeout: 5000
		});

		const rawData = res.data || {};

		categoryMap = {};

		Object.keys(rawData).forEach(key => {
			categoryMap[
				key.toLowerCase().trim()
			] = rawData[key];
		});

		console.log(
			"✅ XMUKUL Categories loaded:",
			Object.keys(categoryMap).length
		);
	} catch (err) {
		console.error(
			"❌ Category load failed:",
			err.message
		);

		categoryMap = {};
	} finally {
		isLoading = false;
	}
}

// ================================
// BOLD FONT
// ================================
function toBold(text) {
	if (!text)
		return "";

	return String(text)
		.split("")
		.map(ch => fontMap[ch] || ch)
		.join("");
}

// ================================
// CATEGORY EMOJI
// ================================
function getCategoryEmoji(category) {
	const cat =
		String(category || "")
			.toLowerCase()
			.trim();

	return categoryMap[cat] || "📁";
}

// ================================
// IMAGE STREAM
// ================================
async function getImage() {
	try {
		if (
			global.utils &&
			typeof global.utils.getStreamFromURL === "function"
		) {
			return await global.utils.getStreamFromURL(
				imageUrl
			);
		}

		return null;
	} catch (error) {
		console.error(
			"❌ Image loading failed:",
			error.message
		);

		return null;
	}
}

// ================================
// MODULE
// ================================
module.exports = {
	config: {
		name: "help",
		version: "1.0.0",
		author: "MUKUL",
		role: 0,
		countDown: 5,

		shortDescription: {
			en: "📚 Show XMUKUL commands"
		},

		longDescription: {
			en: "Show all commands or detailed information about a command."
		},

		description: {
			en: "📚 Show XMUKUL command list"
		},

		category: "Info",

		guide: {
			en: "{pn} [command_name]"
		}
	},

	onStart: async function ({
		message,
		args,
		event,
		role
	}) {

		// ================================
		// LOAD DATA
		// ================================
		if (
			Object.keys(fontMap).length === 0
		) {
			await loadFont();
		}

		if (
			Object.keys(categoryMap).length === 0
		) {
			await loadCategory();
		}

		const prefix =
			getPrefix(event.threadID);

		const input =
			args[0]
				?.toLowerCase()
				.trim();

		// ================================
		// FIND COMMAND
		// ================================
		let cmd = null;

		if (input) {

			if (commands.has(input)) {
				cmd = commands.get(input);

			} else if (aliases.has(input)) {

				const aliasTarget =
					aliases.get(input);

				cmd =
					commands.get(aliasTarget);
			}

			if (!cmd) {
				return message.reply(
`❌ 𝗡𝗢𝗧 𝗙𝗢𝗨𝗡𝗗

🔍 𝗖𝗼𝗺𝗺𝗮𝗻𝗱:
"${input}"

💡 Use:
${prefix}help`
				);
			}
		}

		// ================================
		// COMMAND DETAILS
		// ================================
		if (cmd) {

			const cfg = cmd.config || {};

			const desc =
				typeof cfg.description === "string"
					? cfg.description
					: cfg.description?.en ||
						cfg.shortDescription?.en ||
						cfg.shortDescription ||
						"❌ No description";

			const usage =
				typeof cfg.guide === "string"
					? cfg.guide.replace(
						/\{pn\}/g,
						prefix + cfg.name
					)
					: cfg.guide?.en
						? cfg.guide.en.replace(
							/\{pn\}/g,
							prefix + cfg.name
						)
						: `${prefix}${cfg.name}`;

			const aliasesList =
				Array.isArray(cfg.aliases) &&
				cfg.aliases.length > 0
					? cfg.aliases
						.map(a => `${prefix}${a}`)
						.join(", ")
					: "❌ None";

			const roleText =
				cfg.role === 0
					? "👤 All Users"
					: cfg.role === 1
						? "👑 Group Admin"
						: "⚡ Bot Owner";

			const helpMessage =
`╭━━━[ 📚 ${toBold("XMUKUL HELP")} ]━━━╮
┃
┃ ➥ 📛 ${toBold("Name")}:
┃    ${prefix}${cfg.name}
┃
┃ ➥ 🗂️ ${toBold("Category")}:
┃    ${getCategoryEmoji(cfg.category)}
┃    ${cfg.category || "Uncategorized"}
┃
┃ ➥ 📄 ${toBold("Description")}:
┃    ${desc}
┃
┃ ➥ ⚙️ ${toBold("Version")}:
┃    ${cfg.version || "1.0"}
┃
┃ ➥ ⏳ ${toBold("Cooldown")}:
┃    ${cfg.countDown || 1}s
┃
┃ ➥ 🔒 ${toBold("Permission")}:
┃    ${roleText}
┃
┃ ➥ 👑 ${toBold("Author")}:
┃    ${cfg.author || "MUKUL"}
┃
┃ ➥ 🔤 ${toBold("Aliases")}:
┃    ${aliasesList}
┃
╰━━━━━━━━━━━━━━━━━━╯

╭━━━[ 📘 ${toBold("USAGE")} ]━━━╮
${String(usage)
	.split("\n")
	.map(line => `┃ ➥ ${line}`)
	.join("\n")}
╰━━━━━━━━━━━━━━━━━━╯

╭━━━[ 💡 ${toBold("NOTES")} ]━━━╮
┃ ➥ <text> = Replaceable content
┃ ➥ [a|b] = Choose an option
┃ ➥ ( ) = Optional parameter
┃ ➥ {pn} = Bot prefix
╰━━━━━━━━━━━━━━━━━━╯

👑 ${toBold("XMUKUL-BOT V3")}`;

			try {

				const attachment =
					await getImage();

				if (attachment) {

					await message.reply({
						body: helpMessage,
						attachment
					});

				} else {

					await message.reply(
						helpMessage
					);
				}

			} catch (error) {

				console.error(
					"❌ Help image error:",
					error
				);

				await message.reply(
					helpMessage
				);
			}

			return;
		}

		// ================================
		// ALL COMMANDS
		// ================================
		const categories = {};

		for (const [, command] of commands) {

			if (!command?.config)
				continue;

			const cfg = command.config;

			const commandRole =
				cfg.role ?? 0;

			if (commandRole > role)
				continue;

			const cat =
				cfg.category ||
				"Uncategorized";

			if (!categories[cat])
				categories[cat] = [];

			const commandName =
				cfg.name;

			if (commandName)
				categories[cat].push(
					commandName
				);
		}

		// ================================
		// REMOVE DUPLICATES
		// ================================
		for (const cat of Object.keys(categories)) {

			categories[cat] =
				[
					...new Set(
						categories[cat]
					)
				].sort();
		}

		// ================================
		// MENU HEADER
		// ================================
		let msg =
`╔══════════════════════╗
      👑 ${toBold("XMUKUL-BOT V3")} 👑
╚══════════════════════╝

💠 ${toBold("COMMAND MENU")}
`;

		const sortedCategories =
			Object.keys(categories).sort(
				(a, b) =>
					a.localeCompare(b)
			);

		// ================================
		// CATEGORY MENU
		// ================================
		for (const cat of sortedCategories) {

			const categoryName =
				toBold(
					String(cat).toUpperCase()
				);

			const emoji =
				getCategoryEmoji(cat);

			const commandsList =
				categories[cat];

			msg +=
`\n╭━━━[ ${emoji} ${categoryName} ]━━━╮\n`;

			for (
				let i = 0;
				i < commandsList.length;
				i += 2
			) {

				const cmd1 =
					commandsList[i];

				const cmd2 =
					commandsList[i + 1];

				if (cmd2) {

					msg +=
`┃ ➥ * ${cmd1}
┃ ➥ * ${cmd2}
`;

				} else {

					msg +=
`┃ ➥ * ${cmd1}
`;
				}
			}

			msg +=
`╰━━━━━━━━━━━━━━━━━━╯\n`;
		}

		// ================================
		// FOOTER
		// ================================
		msg +=
`
╭━━━[ 🚀 ${toBold("BOT INFO")} ]━━━╮
┃
┃ 👑 ${toBold("Welcome to XMUKUL-BOT V3")}
┃
┃ 🔰 ${toBold("Prefix")}:
┃    [ ${prefix} ]
┃
┃ 👑 ${toBold("Developer")}:
┃    SK MUKUL BOSS
┃
┃ 📚 ${toBold("Help")}:
┃    ${prefix}help <command>
┃
┃ 🖼️ ${toBold("Menu Image")}:
┃    MUKUL BOSS
┃
╰━━━━━━━━━━━━━━━━━━╯

🔥 ${toBold("Thanks for using XMUKUL-BOT V3")} 🔥
`;

		// ================================
		// SEND MENU + IMAGE
		// ================================
		try {

			const attachment =
				await getImage();

			if (attachment) {

				await message.reply({
					body: msg,
					attachment
				});

			} else {

				await message.reply(msg);
			}

		} catch (error) {

			console.error(
				"❌ Menu image failed:",
				error
			);

			await message.reply(msg);
		}
	}
};
