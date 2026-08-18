const { createCanvas } = require("canvas");
const fs = require("fs-extra");
const path = require("path");
const os = require("os");

module.exports = {
	config: {
		name: "uptime",
		aliases: ["up", "status", "botstatus", "pc"],
		version: "3.0.0",
		author: "MUKUL",
		countDown: 5,
		role: 0,
		shortDescription: "PC style bot monitor",
		longDescription: "Shows uptime and programming status in a PC monitor.",
		category: "system",
		guide: "{pn}"
	},

	onStart: async function ({ message }) {
		const uptime = process.uptime();

		const days = Math.floor(uptime / 86400);
		const hours = Math.floor((uptime % 86400) / 3600);
		const minutes = Math.floor((uptime % 3600) / 60);
		const seconds = Math.floor(uptime % 60);

		const uptimeText =
			`${days}d ${hours}h ${minutes}m ${seconds}s`;

		const bdTime = new Date().toLocaleString("en-BD", {
			timeZone: "Asia/Dhaka",
			hour12: true,
			year: "numeric",
			month: "short",
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit"
		});

		const memory = process.memoryUsage();
		const ram = (memory.rss / 1024 / 1024).toFixed(2);

		const totalRam =
			(os.totalmem() / 1024 / 1024 / 1024).toFixed(2);

		const freeRam =
			(os.freemem() / 1024 / 1024 / 1024).toFixed(2);

		const cpuLoad = os.loadavg
			? os.loadavg()[0].toFixed(2)
			: "N/A";

		const nodeVersion = process.version;
		const platform = os.platform();

		const adminUID = "61574286011307";

		const width = 1200;
		const height = 760;

		const canvas = createCanvas(width, height);
		const ctx = canvas.getContext("2d");

		// Background
		ctx.fillStyle = "#07111f";
		ctx.fillRect(0, 0, width, height);

		// Monitor frame
		ctx.strokeStyle = "#00ff99";
		ctx.lineWidth = 5;
		ctx.strokeRect(25, 25, width - 50, height - 70);

		// Header
		ctx.fillStyle = "#00ff99";
		ctx.fillRect(25, 25, width - 50, 90);

		ctx.fillStyle = "#07111f";
		ctx.font = "bold 42px Arial";
		ctx.fillText("XMUKUL-BOT V3", 55, 83);

		ctx.font = "bold 26px Arial";
		ctx.fillText("SYSTEM MONITOR", 870, 80);

		// Status
		ctx.fillStyle = "#0d1c2e";
		ctx.fillRect(55, 145, 1090, 85);

		ctx.fillStyle = "#00ff66";
		ctx.beginPath();
		ctx.arc(95, 187, 18, 0, Math.PI * 2);
		ctx.fill();

		ctx.fillStyle = "#ffffff";
		ctx.font = "bold 34px Arial";
		ctx.fillText("SYSTEM ONLINE", 135, 198);

		ctx.fillStyle = "#00ff99";
		ctx.font = "24px Arial";
		ctx.fillText("BOT PROCESS: RUNNING", 790, 198);

		// Info helper
		function info(label, value, x, y) {
			ctx.fillStyle = "#7f94a8";
			ctx.font = "bold 23px Arial";
			ctx.fillText(label, x, y);

			ctx.fillStyle = "#ffffff";
			ctx.font = "bold 27px Arial";
			ctx.fillText(value, x, y + 38);
		}

		info("UPTIME", uptimeText, 65, 285);
		info("BANGLADESH TIME", bdTime, 425, 285);
		info("NODE.JS", nodeVersion, 65, 390);
		info("PLATFORM", platform, 425, 390);
		info("RAM USED", `${ram} MB`, 65, 495);
		info("TOTAL RAM", `${totalRam} GB`, 425, 495);
		info("FREE RAM", `${freeRam} GB`, 65, 600);
		info("CPU LOAD", cpuLoad, 425, 600);

		// Programming panel
		ctx.fillStyle = "#0d1c2e";
		ctx.fillRect(760, 260, 355, 360);

		ctx.strokeStyle = "#00ff99";
		ctx.lineWidth = 2;
		ctx.strokeRect(760, 260, 355, 360);

		ctx.fillStyle = "#00ff99";
		ctx.font = "bold 25px Arial";
		ctx.fillText("PROGRAMMING", 790, 305);

		ctx.fillStyle = "#ffffff";
		ctx.font = "22px Arial";
		ctx.fillText("● Coding       ACTIVE", 790, 355);
		ctx.fillText("● JavaScript   RUNNING", 790, 400);
		ctx.fillText("● Node.js      RUNNING", 790, 445);
		ctx.fillText("● Bot Process  RUNNING", 790, 490);
		ctx.fillText("● Commands     LOADED", 790, 535);

		// Fake terminal line
		ctx.fillStyle = "#07111f";
		ctx.fillRect(790, 555, 300, 45);

		ctx.fillStyle = "#00ff99";
		ctx.font = "18px monospace";
		ctx.fillText("> coding_process_active", 800, 583);

		// Admin
		ctx.fillStyle = "#00ff99";
		ctx.font = "bold 24px Arial";
		ctx.fillText("ADMIN / OWNER", 65, 680);

		ctx.fillStyle = "#ffffff";
		ctx.font = "bold 24px Arial";
		ctx.fillText(
			`SK MUKUL BOSS  |  UID: ${adminUID}`,
			270,
			680
		);

		// Footer
		ctx.fillStyle = "#00ff99";
		ctx.font = "18px Arial";
		ctx.fillText(
			"XMUKUL-BOT V3 • PROGRAMMING SYSTEM • ONLINE",
			65,
			720
		);

		const cacheDir = path.join(__dirname, "cache");
		await fs.ensureDir(cacheDir);

		const imagePath = path.join(
			cacheDir,
			"xmukul-uptime.png"
		);

		await fs.writeFile(
			imagePath,
			canvas.toBuffer("image/png")
		);

		try {
			await message.reply({
				body:
`👑 𝗫𝗠𝗨𝗞𝗨𝗟-𝗕𝗢𝗧 𝗩𝟯

🟢 System Online
👨‍💻 Programming Running
⚡ Coding Active
🤖 Bot Process Running`,
				attachment: fs.createReadStream(imagePath)
			});
		} catch (error) {
			console.error("UPTIME ERROR:", error);
			await message.reply(
				"❌ Uptime monitor চালু করতে সমস্যা হয়েছে।"
			);
		}
	}
};
