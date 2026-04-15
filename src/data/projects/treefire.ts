import type { Project } from "../../data/projects.ts";

export const projectsData: Project[] = [
	{
		id: "game",
		title: "拼图游戏",
		description:
			"虽然是一个toy级的项目，但通过询问AI完成了界面搭建、对接口信息的了解，我从底层重构了拼图块移动逻辑，大大减少了代码量以及增加了扩展性，本人也亲自完成自动提示/自动完成的算法。",
		image: "",
		category: "mobile",
		techStack: ["Java", "CPP", "CMake"],
		status: "completed",
		sourceCode: "https://github.com/nonamecpp/PuzzleDemo001",
		startDate: "2026-04-08",
		endDate: "2026-04-15",
		featured: true,
		tags: ["Java", "CPP", "移动端游戏"],
	},
];
