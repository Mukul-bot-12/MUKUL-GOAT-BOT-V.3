const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const API = "https://api.mail.tm";
const DATA_DIR = path.join(__dirname, "tepmail-data");

fs.ensureDirSync(DATA_DIR);

const getFile = (uid) =>
	path.join(DATA_DIR, `${uid}.json`);

function randomText(length = 8) {
	return Math.random()
		.toString(36)
		.substring(2, 2 + length);
}

async function getDomain() {
	const { data } = await axios.get(`${API}/domains`);

	const domains = data["hydra:member"] || [];

	if (!domains.length)
		throw new Error("No domain available");

	return domains[0].domain;
}

async function createAccount() {
	const domain = await getDomain();

	const address =
		`mukul${randomText(8)}@${domain}`;

	const password =
		`Mukul@${randomText(10)}9!`;

	await axios.post(`${API}/accounts`, {
		address,
		password
	});

	const { data } = await axios.post(`${API}/token`, {
		address,
		password
	});

	return {
		address,
		password,
		token: data.token
	};
}

module.exports = {
	config: {
		name: "tepmail",
		aliases: ["tempmail", "tmpmail", "tm"],
		version: "1.0",
		author: "MUKUL",
		countDown: 5,
		role: 0,
		shortDescription: "Temporary email",
		longDescription: "Create and check a temporary email inbox.",
		category: "utility",
		guide:
			"{pn} create\n" +
			"{pn} inbox\n" +
			"{pn} read <ID>"
	},

	onStart: async function ({
		message,
		args,
		event
	}) {
		const uid = event.senderID;
		const file = getFile(uid);
		const action =
			(args[0] || "create").toLowerCase();

		try {

			// CREATE
			if (
				action === "create" ||
				action === "new"
			) {
				const account =
					await createAccount();

				await fs.writeJson(
					file,
					account,
					{ spaces: 2 }
				);

				return message.reply(
`👑 𝗠𝗨𝗞𝗨𝗟 𝗧𝗘𝗠𝗣 𝗠𝗔𝗜𝗟 👑

📧 Email:
${account.address}

🔐 Password:
${account.password}

📥 Inbox:
.tepmail inbox

📖 Read mail:
.tepmail read <ID>

━━━━━━━━━━━━━━━━━━
⚡ Temporary Mail
👑 MUKUL GOAT BOT`
				);
			}

			// CHECK ACCOUNT
			if (!await fs.pathExists(file)) {
				return message.reply(
					"❌ আগে `.tepmail create` দিয়ে email তৈরি করো।"
				);
			}

			const account =
				await fs.readJson(file);

			const headers = {
				Authorization:
					`Bearer ${account.token}`
			};

			// INBOX
			if (
				action === "inbox" ||
				action === "mail"
			) {
				const { data } =
					await axios.get(
						`${API}/messages`,
						{ headers }
					);

				const mails =
					data["hydra:member"] || [];

				if (!mails.length) {
					return message.reply(
`📧 ${account.address}

📭 Inbox empty.`
					);
				}

				let msg =
`👑 𝗠𝗨𝗞𝗨𝗟 𝗧𝗘𝗠𝗣 𝗠𝗔𝗜𝗟 👑

📧 ${account.address}

『 INBOX 』

`;

				mails.slice(0, 10).forEach(
					(mail, i) => {
						msg +=
`* ${i + 1}. ${mail.subject || "No subject"}
  └ From: ${mail.from?.address || "Unknown"}
  └ ID: ${mail.id}

`;
					}
				);

				msg +=
`━━━━━━━━━━━━━━━━━━
.tepmail read <ID>`;

				return message.reply(msg);
			}

			// READ
			if (action === "read") {
				const id = args[1];

				if (!id) {
					return message.reply(
`❌ Message ID দাও।

Example:
.tepmail read MESSAGE_ID`
					);
				}

				const { data } =
					await axios.get(
						`${API}/messages/${encodeURIComponent(id)}`,
						{ headers }
					);

				return message.reply(
`👑 𝗠𝗨𝗞𝗨𝗟 𝗧𝗘𝗠𝗣 𝗠𝗔𝗜𝗟 👑

📩 From:
${data.from?.address || "Unknown"}

📌 Subject:
${data.subject || "No subject"}

━━━━━━━━━━━━━━━━━━

${data.text || "No text available"}

━━━━━━━━━━━━━━━━━━`
				);
			}

			return message.reply(
`📧 𝗧𝗘𝗠𝗣 𝗠𝗔𝗜𝗟

* .tepmail create
* .tepmail inbox
* .tepmail read <ID>`
			);

		} catch (error) {
			console.error(
				"TEPMAIL ERROR:",
				error.response?.data ||
				error.message
			);

			return message.reply(
				"❌ Temp Mail service এখন unavailable। কিছুক্ষণ পরে আবার চেষ্টা করো।"
			);
		}
	}
};
