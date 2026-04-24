const ICON_MAP = {
	code: "/assets/status-icons/code.jpg",
	github: "/assets/status-icons/github.jpg",
	bilibili: "/assets/status-icons/r18.jpg",
	youtube: "/assets/status-icons/r18.jpg",
	steam: "/assets/status-icons/game.jpg",
	osu: "/assets/status-icons/osu.jpg",
	firefox: "/assets/status-icons/r18.jpg",
	chromium: "/assets/status-icons/r18.jpg",
	mpv: "/assets/status-icons/r18.jpg",
	terminal: "/assets/status-icons/Terminal.jpg",
	idle: "/assets/status-icons/daydream.jpg",
	unknown: "/assets/status-icons/daydream.jpg",
};

let lastUpdate = 0;

async function updateStatus() {
	try {
		const r = await fetch("/api/status");
		const d = await r.json();

		lastUpdate = d.since;
		const now = Math.floor(Date.now() / 1000);
		const diff = now - lastUpdate;

		const img = document.getElementById("status-img");
		const text = document.getElementById("status-text");
		const time = document.getElementById("status-time");

		if (diff > 10) {
			img.src = ICON_MAP["idle"];
			text.textContent = "已离线";
			time.textContent = "最后在线 " + diff + "秒前";
		} else {
			img.src = ICON_MAP[d.icon] || ICON_MAP["unknown"];
			text.textContent = d.status;
			time.textContent = "";
		}
	} catch (e) {
		const now = Math.floor(Date.now() / 1000);
		const diff = now - lastUpdate;

		const img = document.getElementById("status-img");
		const text = document.getElementById("status-text");
		const time = document.getElementById("status-time");

		img.src = ICON_MAP["idle"];
		text.textContent = "已离线";

		if (lastUpdate > 0) {
			time.textContent = "最后在线 " + diff + "秒前";
		} else {
			time.textContent = "从未连接";
		}
	}
}

updateStatus();
setInterval(updateStatus, 10000);
