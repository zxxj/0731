# 理解Nest的MVC架构

## MVC三层在NestJS中的对应关系

| MVC概念    | NestJS对应                              | 作用                              |
| ---------- | --------------------------------------- | --------------------------------- |
| Model      | `service`  + `Entity` + `Repository`    | 处理业务逻辑,数据结构和数据库交互 |
| View       | 模板引擎( @Render() ), 序列化成JSON响应 | 负责把数据展示给客户端            |
| Controller | `@Controller`类                         | 接受请求,调用Service,返回响应     |

## 请求在NestJS MVC中的流转过程

1. 客户端发起请求( HTTP / WebSocket / gRPC )等.
2. 路由匹配 ( 根据 `@Controller('path') ` 和方法上的装饰器  `@Get()` `@Post()`等)
3. Controller接收请求
   - 先使用`@Body()` / `@Query()` / `@Param()`解析参数
   - 调用对应的`Service`方法
4. Service执行业务逻辑
   - 处理数据 / 调用第三方接口.
   - 通过`Repository`或ORM框架访问数据库.
5. 返回数据给Controller
6. Controller输出
   - API项目 => 直接`return`JSON数据(Nest会自动序列化为JSON)
   - SSR/模板渲染项目 => 会使用`@Render('template')`返回HTML.
7. 响应发送给客户端

# 理解AOP

> Nest提供了AOP( Aspect Oriented Programming )的能力,也就是面向切面编程的能力.
>
> 处理一个请求可能会经过 => Controller => Service => Repository的逻辑, 如果想在这个调用链路里加入一些通用逻辑该怎么加呢?
>
> 例如日志记录,权限控制,异常处理等.
>
> 容易想到的是直接改造Controller层代码,加入这段逻辑, 这样可以但不优雅,因为这些通用的逻辑被引入到了业务逻辑里面.
>
> 能不能透明的给这些业务逻辑加上日志,权限等处理呢? 
>
> 能不能在调用Controller层之前和之后加入一个执行通用逻辑的阶段呢? 
>
> 比如下面这样:

```markdown

--------------- 切面 => 通用逻辑(日志/权限/异常处理)
|Controller逻辑|    
	↓	↑
|Service逻辑|
	↓	↑
|Repository逻辑|
```

> 这样的横向扩展点就叫做切面,这种透明的加入一些切面逻辑的编程方式就叫做AOP(面向切面编程).
>
> `AOP的好处是可以把一些通用逻辑分离到切面中,从而保持业务逻辑的纯粹性,这样切面逻辑可以复用,还可以动态的增删`
>
> 其实express的中间件的洋葱模型也是一种AOP的实现,因为你可以透明的在外面包一层,加入一些逻辑,内层感知不到.
>
> 而Nest实现AOP的方式更多,一共有五种: Middleware, Guard, Pipe, Interceptor, ExceptionFilter.

# 实现Nest中的5种AOP方式

## 创建项目

```markdown
nest new 09_理解mvc和aop架构-实现nest中的5种aop方式 -s -g -p pnpm
```

2.