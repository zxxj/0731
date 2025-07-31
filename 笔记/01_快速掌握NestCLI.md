项目开发离不开工程化的部分,比如创建项目/编译构建/开发时监听文件变动后自动构建等.

nest项目自然也是这样,所以它在`@nestjs/cli`这个包中提供了一些nest命令.

## 1. 安装nest

```js
// 1. 可以直接使用npx执行,npm会把它先下载下来然后再执行
npx @nestjs/cli new 项目名

// 2. 全局安装nest,安装到全局,然后执行(推荐).但全局安装需要时不时升级一下版本,不然可能用它创建的项目版本不是最新的!
npm i -g @nestjs/cli
nest new 项目名

// 升级
npm update -g @nestjs/cli
```

## 2. NestCLI提供的命令

```js
// 终端中输入nest -h,可以查看到@nestjs/cli提供的所有命令.
nest -h
```

- ## nest new

  > 用于创建一个新的nest项目,它有几个选项

  - --skip-git => 简写为 -g (跳过git初始化)

    ```js
    nest new demo -g 
    ```

  - --skip-install => 简写为 -s (跳过安装依赖)

    ```js
    nest new demo -s
    ```

  - --package-manager => 简写为 -p (指定包管理器)

    ```js
    nest new demo -p pnpm
    ```

  - --language => 简写为 -l (指定nest项目使用JavaScript还是TypeScript)

    ```js
    nest new demo -l javascript
    ```

  - --strict (指定TypeScript的编译选项是否开启严格模式)

    ```js
    nest new demo --strict true
    ```

    ```js
    // 严格模式对应的配置就是tsconfig.json中的以下几个属性, 默认全部为false,指定开启严格模式后为true
    "strictNullChecks": false,
    "noImplicitAny": false,
    "strictBindCallApply": false,
    "forceConsistentCasingInFileNames": false,
    "noFallthroughCasesInSwitch": false
    ```

    