项目开发离不开工程化的部分,比如创建项目/编译构建/开发时监听文件变动后自动构建等.

nest项目自然也是这样,所以它在`@nestjs/cli`这个包中提供了一些nest命令.

# 1. 安装NestCLI

```js
// 1. 可以直接使用npx执行,npm会把它先下载下来然后再执行
npx @nestjs/cli new 项目名

// 2. 全局安装nest,安装到全局,然后执行(推荐).但全局安装需要时不时升级一下版本,不然可能用它创建的项目版本不是最新的!
npm i -g @nestjs/cli
nest new 项目名

// 升级
npm update -g @nestjs/cli
```

# 2. NestCLI提供的命令

```js
// 终端中输入nest -h,可以查看到@nestjs/cli提供的所有命令.
nest -h
```

## nest new

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

## nest generate

> 生成controller/service/module等文件

- 生成Module

  ```js
  // 1.运行如下命令
  nest generate module testGenerate
  ```

  ```js
  // 2.会在项目中生成对应的文件夹与.module.ts文件, test-generate/test-generate.module.ts
  
  import { Module } from '@nestjs/common';
  
  @Module({})
  export class GenerateModuleModule {}
  ```

  ```js
  // 3.生成的module会被自动imports到app.module.ts中
  
  import { Module } from '@nestjs/common';
  import { AppController } from './app.controller';
  import { AppService } from './app.service';
  + import { TestGenerateModule } from './generate-module/test-generate.module';
  
  @Module({
    + imports: [TestGenerateModule],
    controllers: [AppController],
    providers: [AppService],
  })
  export class AppModule {}
  ```

- 生成Controller文件

  ```js
  // 1.运行如下命令
  nest generate controller testGenerate
  ```

  ```js
  // 2.会在项目中生成对应的.controller文件, test-generate/test-generate.controller.ts, 没有加--no-spec的话还会生成一个.spec的测试文件
  
  // test-generate.controller.ts
  import { Controller } from '@nestjs/common';
  
  @Controller('test-generate')
  export class TestGenerateController {}
  
  // test-generate.controller.spec.ts
  import { Test, TestingModule } from '@nestjs/testing';
  import { TestGenerateController } from './test-generate.controller';
  
  describe('TestGenerateController', () => {
    let controller: TestGenerateController;
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        controllers: [TestGenerateController],
      }).compile();
  
      controller = module.get<TestGenerateController>(TestGenerateController);
    });
  
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });
  });
  ```

  ```js
  // 3.同时,生成的controller会自动在对应的module中被引入,也就是TestGenerateController会自动被引入到TestGenerateModule中
  
  // test-generate.module.ts
  import { Module } from '@nestjs/common';
  + import { TestGenerateController } from './test-generate.controller';
  
  @Module({
    + controllers: [TestGenerateController],
  })
  export class TestGenerateModule {}
  ```

- 生成Service文件

  ```js
  // 1.运行如下命令
  nest generate service TestGenerate
  ```

  ```js
  // 2.会在项目中生成对应的.service文件, test-generate/test-generate.service.ts, 没有加--no-spec的话还会生成一个.spec的测试文件
  
  // test-generate.service.ts
  import { Injectable } from '@nestjs/common';
  
  @Injectable()
  export class TestGenerateService {}
  
  // test-generate.service.spec.ts
  import { Test, TestingModule } from '@nestjs/testing';
  import { TestGenerateService } from './test-generate.service';
  
  describe('TestGenerateService', () => {
    let service: TestGenerateService;
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [TestGenerateService],
      }).compile();
  
      service = module.get<TestGenerateService>(TestGenerateService);
    });
  
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  });
  ```

  ```js
  // 3.同样的,生成的service会自动在对应的module中被引入,也就是TestGenerateService会自动被引入到TestGenerateModule中
  
  // test-generate.module.ts
  import { Module } from '@nestjs/common';
  import { TestGenerateController } from './test-generate.controller';
  + import { TestGenerateService } from './test-generate.service';
  
  @Module({
    controllers: [TestGenerateController],
    + providers: [TestGenerateService],
  })
  export class TestGenerateModule {}
  
  ```

- 生成一个完整的模块

  ```js
  // 1. 如果是要完整的生成一个模块的代码(包含 .module.ts,.controller.ts,.service.ts),不需要一个一个文件的生成,可以运行如下命令
  nest generate resource GenerateDemo1
  
  // 2. 运行命令后,会让你选择需要生成什么风格的代码,因为nest支持http/websocket/graphql/tcp等,这里选择http的REST API
  // 3. 然后会提示你是否需要生成CRUD代码? 这里选择是就好了
  // 4. 然后就会生成整个模块的CRUD + REST API的代码, 当然它同样也会自动被imports到appModule中
  ```

> 这就是`nest generate`, 可以快速生成各种代码
>
> 这些代码模板的集合是在@nestjs/schematics这个包里定义的,通过`nest new`创建项目的时候有个`--collection`选项就是配置这个的.