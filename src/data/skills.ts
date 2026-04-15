// Skill data configuration file
// Used to manage data for the skill display page

export interface Skill {
	id: string;
	name: string;
	description: string;
	icon: string; // Iconify icon name
	category: "frontend" | "backend" | "database" | "tools" | "other";
	level: "beginner" | "intermediate" | "advanced" | "expert";
	experience: {
		years: number;
		months: number;
	};
	projects?: string[]; // Related project IDs
	certifications?: string[];
	color?: string; // Skill card theme color
}

export const skillsData: Skill[] = [
	{
		id: "CPP", // 新的ID
		name: "CPP", // 名称
		description: "足够的抽象能力，面向对象，操作符重载，模板等", // 描述
		icon: "catppuccin:cpp", // 图标
		category: "backend", // 分类
		level: "intermediate", // 水平
		experience: { years: 5, months: 2 }, // 经验
		color: "#FFC0CB", // 颜色
	},
	{
		id: "HTML", // 新的ID
		name: "HTML", // 名称
		description: "一种用于创建和设计网页的标记语言", // 描述
		icon: "ant-design:html5-twotone", // 图标
		category: "frontend", // 分类
		level: "beginner", // 水平
		experience: { years: 0, months: 4 }, // 经验
		color: "#FFC0CB", // 颜色
	},
	{
		id: "CSS", // 新的ID
		name: "CSS", // 名称
		description: "一种用于描述HTML或XML文档的呈现方式的样式表语言", // 描述
		icon: "hugeicons:css-3", // 图标
		category: "frontend", // 分类
		level: "beginner", // 水平
		experience: { years: 0, months: 4 }, // 经验
		color: "#FFC0CB", // 颜色
	},
	{
		id: "JavaScript", // 新的ID
		name: "JavaScript", // 名称
		description:
			"一种高级的、解释执行的编程语言，主要用于构建网页和应用的交互界面", // 描述
		icon: "ri:javascript-line", // 图标
		category: "frontend", // 分类
		level: "beginner", // 水平
		experience: { years: 0, months: 4 }, // 经验
		color: "#FFC0CB", // 颜色
	},
	{
		id: "C#", // 新的ID
		name: "C#", // 名称
		description:
			"使用了.NET框架作为运行环境，源于C语言系列，继承了C和C++强大功能的同时去掉了一些它们的复杂特性", // 描述
		icon: "fluent:code-cs-16-filled", // 图标
		category: "backend", // 分类
		level: "beginner", // 水平
		experience: { years: 0, months: 6 }, // 经验
		color: "#FFC0CB", // 颜色
	},
	{
		id: "JAVA", // 新的ID
		name: "JAVA", // 名称
		description: "功能强大和简单易用", // 描述
		icon: "ant-design:java-outlined", // 图标
		category: "backend", // 分类
		level: "beginner", // 水平
		experience: { years: 0, months: 9 }, // 经验
		color: "#FFC0CB", // 颜色
	},
	{
		id: "Python", // 新的ID
		name: "Python", // 名称
		description: "一种解释型、面向对象、动态数据类型的高级程序设计语言", // 描述
		icon: "akar-icons:python-fill", // 图标
		category: "tools", // 分类
		level: "beginner", // 水平
		experience: { years: 0, months: 7 }, // 经验
		color: "#FFC0CB", // 颜色
	},
	//tool
	{
		id: "Unity", // 新的ID
		name: "Unity", // 名称
		description: "一个广泛使用的实时3D互动内容创作平台", // 描述
		icon: "bi:unity", // 图标
		category: "tools", // 分类
		level: "beginner", // 水平
		experience: { years: 0, months: 6 }, // 经验
		color: "00FFFF", // 颜色
	},
	{
		id: "Visual Studio Code", // 新的ID
		name: "Visual Studio Code", // 名称
		description: "微软于2015年4月30日发布的跨平台源代码编辑器", // 描述
		icon: "mdi:vs-code", // 图标
		category: "tools", // 分类
		level: "expert", // 水平
		experience: { years: 0, months: 0 }, // 经验
		color: "00FFFF", // 颜色
	},
];
