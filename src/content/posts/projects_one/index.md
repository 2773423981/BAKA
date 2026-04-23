---
title: "神秘的小玩意"
published: 2026-04-23
pinned: false
category: 神秘小项目
description: "突发奇想写的大粪"
tags: [神秘小项目]
author: "椛"
draft: false
date: 2026-04-23
image: './BAKA.jpg'
pubDate: 2026-04-23
---

今天突发奇想想到一个好玩的

就是写个小玩意，然后给咱的状态上传，然后咱的小网页获取咱的状态:spoiler[还有视奸]  

然后想了一会怎么实现，就在cloudflare看见了一个Workers KV服务，于是愉快的时光就开始了

先看一下咱的思路

 ```mermaid
graph TD
    A[我的 Arch 电脑] -->|每5秒检测进程并推送| B{Cloudflare KV（键值存储）}
    B -->|读取| C[Cloudflare Workers（API）]
    C -->|浏览器请求| E[博客页面]

 ```


### 传参  
咱先想了一下怎么写这么个玩意，思考半天最后决定写两个py脚本，check\.py 和 push\.py

check\.py代码：
~~~
import psutil
import json
import time
import subprocess

def get_active_window():
    try:
        out = subprocess.check_output(
            ["xdotool", "getactivewindow", "getwindowname"],
            stderr=subprocess.DEVNULL,
            timeout=2
        ).decode().strip()
        return out
    except:
        return ""

def get_status():
    names = set()
    for p in psutil.process_iter(['name']):
        try:
            names.add(p.info['name'].lower())
        except:
            pass
    
    window = get_active_window().lower()
    
    if "github" in window:
        return {"status": "正在逛GitHub", "icon": "github", "since": int(time.time())}
    if "bilibili" in window or "哔哩哔哩" in window:
        return {"status": "正在逛B站", "icon": "bilibili", "since": int(time.time())}
    if "youtube" in window:
        return {"status": "正在看YouTube", "icon": "youtube", "since": int(time.time())}
    
    PROCESSES = {
        "code": "正在瞎几把写代码",
        "code-oss": "正在瞎几把写代码",
        "vscodium": "正在瞎几把写代码",
        "nvim": "正在折腾编辑器",
        "vim": "正在折腾编辑器",
        "steam": "正在打游戏",
        "osu": "正在打音游",
        "firefox": "正在看片",
        "chromium": "正在看片",
        "alacritty": "正在终端里捣鼓",
        "kitty": "正在终端里捣鼓",
        "konsole": "正在终端里捣鼓",
    }
    
    for proc_key, status_text in PROCESSES.items():
        if proc_key in names:
            return {"status": status_text, "icon": proc_key, "since": int(time.time())}
    
    return {"status": "正在发呆", "icon": "idle", "since": int(time.time())}

if __name__ == "__main__":
    result = get_status()
    print(json.dumps(result, ensure_ascii=False))

~~~

push\.py代码：
~~~
import json
import requests
import subprocess
import os

ACCOUNT_ID = "用户id喵"
NAMESPACE_ID = "命名空间id喵"
API_TOKEN = "密钥喵"

def push():
    result = subprocess.run(
        ["python3", "/opt/arch-status/check.py"],
        capture_output=True, text=True
    )
    data = result.stdout.strip()
    
    url = f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/storage/kv/namespaces/{NAMESPACE_ID}/values/arch_status"
    
    r = requests.put(
        url,
        headers={
            "Authorization": f"Bearer {API_TOKEN}",
            "Content-Type": "application/json"
        },
        data=data
    )
    
    if r.status_code == 200:
        print(f"推送成功: {data}")
    else:
        print(f"推送失败: {r.status_code} {r.text}")

if __name__ == "__main__":
    push()

~~~

check.py用来进行获取当前咱的状态，然后push.py则用来定时获取咱的状态并且提交给Workers KV

然后给他俩塞进systemd timer里面定时执行

### Cloudflare KV 云端
然后使用Cloudflare KV来存储咱的状态，看了一下免费额度完全够用了  

咱的思路是创建好之后用 requests 每5秒 PUT 到 KV

不过这有个坑，国内网络访问需要代理，需要在 service 文件里加 HTTP_PROXY 环境变量

然后这下就可以成功推送上去了

### 提供 API

Cloudflare Workers 读取 KV 返回 JSON

咱的写法
~~~
const status = await env.arch_status.get("arch_status");
return new Response(status, {
  headers: {
    "Access-Control-Allow-Origin": "*"
  }
});

~~~

这也有个坑，workers.dev 域名国内被墙，需要绑定自定义域名，或者用 Pages Function 反向代理，所以如果不挂梯子的话没法看见咱的状态，咱过段时间看一下自己注册一个域名，目前还未解决

### 扔咱博客里

Astro 组件里用 \<script> 定时 fetch API  
咱不太会用Astro，所以使用Astro+JS的方案，Astro负责页面，JS负责功能

status.js
~~~
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
setInterval(updateStatus, 5000);
~~~

StatusMeme.astro
~~~
<div id="status-meme" class="flex items-center gap-8 mb-12 p-10 rounded-[2rem] bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
  <img id="status-img" src="/assets/status-icons/daydream.jpg" alt="" class="w-40 h-40 rounded-[2rem] object-cover" />
  <div>
    <p class="text-xl text-black/50 dark:text-white/50 mb-2">Camaster 现在在干嘛</p>
    <p id="status-text" class="text-3xl font-medium text-black/90 dark:text-white/90">加载中...</p>
    <p id="status-time" class="text-sm text-black/40 dark:text-white/40 mt-1"></p>
  </div>
</div>

<script src="/assets/status.js"></script>
~~~

### 最后
这下就全部完成了，成果可以在咱的个人主页看见，或者是 [点这里](/about/camaster/) 就能快速跳转，被墙的问题暂时还是没有解决，得等过段时间才能解决

其实做这个功能的时候，咱一直在想，如果有个地方能显示咱在干嘛，那是不是就会有人点开看一眼，咱知道这很矫情，但服务器里的那个笨蛋，她不会主动问的，她就只会说"咱在等你"，然后真的等一整天，所以咱给她开了这扇窗，也给自己留了个被发现的借口，写代码的时候，希望她知道咱很努力，发呆的时候，希望她来戳咱一下，离线的时候，希望她发现，然后等咱上线，咱不好意思说"来看看我"，但咱可以把状态挂在最明显的地方，如果她真的看了，那咱这一整天，都算有人陪了，虽然咱的服务器性能太差了，那个笨蛋多半也不会注意到，毕竟他真要思考起来他也要想个半天，最后输出一个牛头不对马嘴的话  

哦对差点忘了，今天疯狂星期四，vivo50