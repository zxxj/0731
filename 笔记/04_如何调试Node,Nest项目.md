# 调试Node项目

- 创建文件夹04_如何调试Node,Nest项目

- 初始化package.json

```js
npm init -y
```

- 创建index.js

```js
// index.js
// 通过os模块拿到home目录的路径
const os = require('os')

const homedir = os.homedir()

console.log(homedir)
```

- node执行index.js

```powershell
node ./index.js 
```

- 启动调试模式

```js
// --inspect是调试模式运行,而--inspect-brk还会在首行断住
node --inspect-brk index.js

// 启动成功后,会看到如下提示,表示已经成功启动了一个ws服务
PS F:\A\0731\04_如何调试Node,Nest项目> node --inspect-brk .\index.js
Debugger listening on ws://127.0.0.1:9229/4d09d229-295e-4bc3-80b9-56fbbec1f907
For help, see: https://nodejs.org/en/docs/inspector
Debugger attached.
```

- 打开chorme devtools即可进行调试



# 调试Nest项目

> nest也是node项目,自然也是这样来调试的.
>
> nest start有一个--debug选项, 它的原理就是 node --inspect

- 浏览器调试项目

```ts
nest start --debug 或者 pnpm run start:debug
// 执行之后,打开chrome devtools会发先没有任何反应, 因为inspect并不会和--inspect-brk一样在首行断住

// 在controller里加一个debugger后,访问http://localhost:3000,就会发现代码已经在断点处断住了.
```

- vscode调试项目

> 点击调试面板的create launch.json file,它会创建.vscode/launch.json的调试配置文件

```js
// .vscode/launch.json
{
	// Use IntelliSense to learn about possible attributes.
	// Hover to view descriptions of existing attributes.
	// For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
	"version": "0.2.0",
	"configurations": []
}
```

>在"configurations"中输入node,选择Node.js: Launch Program,快速创建一个node调试配置,生成后如下:

```js
{
	// Use IntelliSense to learn about possible attributes.
	// Hover to view descriptions of existing attributes.
	// For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
	"version": "0.2.0",
	"configurations": [
		{
			"name": "Launch Program",
			"program": "${workspaceFolder}/app.js",
			"request": "launch",
			"skipFiles": [
				"<node_internals>/**"
			],
			"type": "node"
		}
	]
}
```

> 添加一个attach类型的调试配置:

```js
{
	// Use IntelliSense to learn about possible attributes.
	// Hover to view descriptions of existing attributes.
	// For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
	"version": "0.2.0",
	"configurations": [
		{
			"name": "Attach",
			"port": 9229,
			"request": "attach",
			"skipFiles": [
				"<node_internals>/**"
			],
			"type": "node"
		},
		{
			"name": "Launch Program",
			"program": "${workspaceFolder}/app.js",
			"request": "launch",
			"skipFiles": [
				"<node_internals>/**"
			],
			"type": "node"
		}
	]
}
```

> 所有的配置已经准备完成,可以在vscode进行调试了,步骤如下!
>
> 1.在controller或其他文件中打一个断点
>
> 2.vscode调试模块中选择 Attach并点击执行
>
> 3.pnpm run start:debug 或者 nest start --debug 启动项目
>
> 4.浏览器访问http://localhost:3000即可看到断点生效

- 更简便的调试方式

> 如果是用vscode调试,可以不用nest start --debug,有更简便的方式: 选择Node.js: Launch via npm

```js
// launch.json
{
	"version": "0.2.0",
	"configurations": [
{
    "type": "node",
    "request": "launch",
    "name": "debug nest", // 自定义名称
    "runtimeExecutable": "npm", // 代表执行什么命令,args传参数
    "args": [
        "run",
        "start:dev",
    ],
    "skipFiles": [
        "<node_internals>/**"
    ],
		"cwd": "F:/A/0731/05_如何调试nest项目",  // 一定要指定当前项目所在的文件夹
    "console": "integratedTerminal", // 要指定为integratedTerminal,也就是用vscode的内置终端来打印日志,不然默认会用debug console跑,那个没有颜色.
}
	]
}
```

> 1.点击开始调试
>
> 2.访问http://localhost:3000即可