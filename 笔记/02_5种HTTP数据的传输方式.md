# 5种HTTP数据传输方式

>  对于前端来说,后端主要是提供http接口来传输数据,而数据传输的方式主要有以下5种:

- url param
- query
- form-urlencoded
- form-data
- json

## url param

> 将参数写在url中,比如`http://xin.com/18`
>
> 这里的`18`就是路径中的参数(url param),服务端框架或者单页应用的路由都支持从url中取出参数.

## query

> 在url中 `?` 后面的用`&`分隔的字符串来传递数据, 比如: http://xin.com?name=zxx&age=18
>
> 这里的name和age就是query传递的数据

```js
// 1.如果是非英文的字符和一些特殊字符是需要经过编码的,可以使用encodeURIComponent的api来编码:
const query = `?name=encodeURIComponent('鑫')&age=18`
console.log(query) // ?name=%E5%85%89&age=18
```

```js
// 2.也可以使用封装了一层的`query-string`库来处理
const queryString = require('query-string')

const query = queryString.stringify({
    name: '鑫',
    age: 18
})
console.log(query) // ?name=%E5%85%89&age=18
```

## form-urlencoded

> form-urlencoded和query的区别只是将参数放在了Body里,然后将`content-type为application/x-www-form-urlencoded`,因为参数也是query字符串,所以也要用encodedURLComponent的api或者query-string这种库来处理一下编码格式.
>
> 这种格式也很容易理解,get是把数据拼成query字符串放在url后面,于是表单的post提交方式时就直接用相同的方式把数据放在了body里.
>
> 通过&分隔的form-urlencoded的方式需要对内容做url encoded,如果传递的是大量数据,比如上传文件的时候就不是很合适了,因为把文件encode一遍的话太慢了,这时候就可以使用form-data



## form-data

> form-data不再是通过&分隔数据,而是用---------加一串数字作为boundary分隔符.
>
> 因为不是url的方式了,自然也不用再做encode编码
>
> form-data需要将content-type指定为multipart/form-data,然后指定boundary(分隔符-----)
>
> body里面就是用boundary分隔符分隔的内容,这种方式适合传输文件,而且可以传输多个文件

## json

> form-urlencoded需要对内容做url encode编码
>
> form-data则需要加很长的boundary分隔符
>
> 两种方式都有一些缺点,如果只是传输json数据的话,不需要这两种方式.可以指定content-type为application/json就行

# Nest中实现这5种数据传输方式

## 创建Nest项目

```js
// 1.创建项目 
nest new 02_5种HTTP数据传输方式 -s -g

// 2.生成person curd模块
nest generate resource person

// 3.启动项目
pnpm run start:dev
```

```ts
// 4.开启静态资源访问
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  // 要给create方法传入NestExpressApplication的泛型参数后才会有useStaticAssets这些方法
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 指定prefix为assets,然后在静态文件目录public下添加一个index.html
  app.useStaticAssets('public', { prefix: '/assets' });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

```js
// 5.在public下新建一个index.html, 浏览器输入http://localhost:3000/assets/index.html能出现页面就证明成功了.

// public/index.html
<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Document</title>
</head>

<body>
	hello
</body>

</html>
```

## url param

> url param是url中的参数,nest中通过 :参数名 的方式来声明(比如下面的id), 然后通过@Param(参数名)的装饰器取出来然后注入到Controller

- 后端实现

```js
@Controller('person')
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  // @Controller('api/pseron)的路由和@Get('id)的路由会拼到一起,也就是只有/api/person/xxx的get请求才会命中这个方法
  @Get(':id')
  urlParamTest(@Param('id') id: string) {
      return `id=${id}`;
  }
}
```

- 前端测试

```html
<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Document</title>
</head>

<body>
	<script src="https://unpkg.com/axios@0.24.0/dist/axios.min.js"></script>

	<script>
		async function urlParam() {
			const res = await axios.get('/api/person/1')
			console.log(res)
		}

		urlParam()
	</script>
</body>

</html>
```

## query

> query是url中 ? 后的字符串,需要做url encode, 在Nest中需要通过@Query装饰器来取参数

- 后端实现


```ts
@Controller('person')
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  // 这个find路由要放到:id路由的前面,因为Nest是从上往下匹配的,如果放在后面,那么就会匹配到:id的路由了.
  @Get('find')
  testQuery(@Query('username') username: string, @Query('age') age: number) {
    return `username: ${username}, age: ${age}`;
  }

  // @Controller('api/pseron)的路由和@Get('id)的路由会拼到一起,也就是只有/api/person/xxx的get请求才会命中这个方法
  @Get(':id')
  urlParamTest(@Param('id') id: string) {
    return `id=${id}`;
  }
}
```

- 前端测试

```html
<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Document</title>
</head>

<body>
	<script src="https://unpkg.com/axios@0.24.0/dist/axios.min.js"></script>

	<script>
		async function urlParam() {
			const res = await axios.get('/api/person/1')
			console.log(res)
		}

		urlParam()

		async function query() {
			// const res = await axios.get('/api/person/find?username="xinxin"&age="18')
            
            // 参数通过params指定后,axios会做url encode,不需要自己做
			const res = await axios.get('/api/person/find', {
				params: {
					username: "xinxin",
					age: 18
				}
			})
			console.log(res)
		}

		query()
	</script>
</body>

</html>
```

## form urlencoded

> form urlencoded是通过body传输数据,其实是把字符串放到了body里,所以需要做url encode
>
> 在Nest中用@Body装饰器接受参数,Nest会自动解析请求体,然后注入到dto中.
>
> dto是data transfer object, 就是用于封装传输的数据的对象 例如:
>
> export class CreateUserDto {
>
> ​	username: string
>
> ​	age: number
>
> }

- 后端实现

```ts
// create-person.dto.ts
export class CreatePersonDto {
  username: string;
  age: number;
  height: number;
}
```

```ts
// person.controller.ts

@Controller('person')
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @Get('find')
  testQuery(@Query('username') username: string, @Query('age') age: number) {
    return `username: ${username}, age: ${age}`;
  }

  // @Controller('api/pseron)的路由和@Get('id)的路由会拼到一起,也就是只有/api/person/xxx的get请求才会命中这个方法
  @Get(':id')
  urlParamTest(@Param('id') id: string) {
    return `id=${id}`;
  }

  @Post()
  formURLEncoded(@Body() createPersonDto: CreatePersonDto) {
    return `obj: ${JSON.stringify(createPersonDto)}`;
  }
}
```

- 前端测试

```html
<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Document</title>
</head>

<body>
	<script src="https://unpkg.com/axios@0.24.0/dist/axios.min.js"></script>
	<script src="https://unpkg.com/qs@6.10.2/dist/qs.js"></script>

	<script>
		async function urlParam() {
			const res = await axios.get('/api/person/1')
			console.log(res)
		}

		urlParam()


		async function query() {
			// const res = await axios.get('/api/person/find?username="xinxin"&age="18')
			const res = await axios.get('/api/person/find', {
				params: {
					username: "xinxin",
					age: 18
				}
			})
			console.log(res)
		}

		query()

		async function formURLEncoded() {
            // 通过Qs做encode
			const res = await axios.post('/api/person', Qs.stringify({
				username: "zxx",
				age: 18,
				height: 1.88
			}),
				{
					headers: { 'content-type': 'application/x-www-form-urlencoded' }
				}
			)

			console.log(res)
		}

		formURLEncoded()
	</script>
</body>

</html>
```

## json

> json需要将content-type指定为application/json,表示传输的内容会以json格式传输.
>
> form urlencoded和json方式都是从@Body装饰器取值,Nest内部会根据content-type做区分,使用不同的解析方式.

- 后端实现

```ts
@Controller('person')
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  // query参数
  @Get('find')
  testQuery(@Query('username') username: string, @Query('age') age: number) {
    return `username: ${username}, age: ${age}`;
  }

  // url param参数
  // @Controller('api/pseron)的路由和@Get('id)的路由会拼到一起,也就是只有/api/person/xxx的get请求才会命中这个方法
  @Get(':id')
  urlParamTest(@Param('id') id: string) {
    return `id=${id}`;
  }

  // form urlencoded参数
  @Post()
  formURLEncoded(@Body() createPersonDto: CreatePersonDto) {
    return `obj: ${JSON.stringify(createPersonDto)}`;
  }

  // json
  @Post('testJson')
  json(@Body() CreatePersonDto: CreatePersonDto) {
    return `json: ${JSON.stringify(CreatePersonDto)}`;
  }
}
```

- 前端测试

```html
<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Document</title>
</head>

<body>
	<script src="https://unpkg.com/axios@0.24.0/dist/axios.min.js"></script>
	<script src="https://unpkg.com/qs@6.10.2/dist/qs.js"></script>

	<script>
		async function urlParam() {
			const res = await axios.get('/api/person/1')
			console.log(res)
		}

		urlParam()


		async function query() {
			// const res = await axios.get('/api/person/find?username="xinxin"&age="18')
			const res = await axios.get('/api/person/find', {
				params: {
					username: "xinxin",
					age: 18
				}
			})
			console.log(res)
		}

		query()

		async function formURLEncoded() {
			const res = await axios.post('/api/person', Qs.stringify({
				username: "zxx",
				age: 18,
				height: 1.88
			}),
				{
					headers: { 'content-type': 'application/x-www-form-urlencoded' }
				}
			)

			console.log(res)
		}

		formURLEncoded()

        // 默认传输json就会指定content-type为application/json,不需要手动指定.
		async function json() {
			const res = await axios.post('/api/person/testJson', {
				username: "xin",
				age: 20,
				height: 1.99
			},
				{
					// headers: { 'content-type': 'application/json' }
				}
			)
			console.log(res)
		}

		json()
	</script>
</body>

</html>
```

## form data

> form data使用--------作为boundary分隔传输的内容的.
>
> Nest解析form data使用FilesInterceptor拦截器,用@UseInterceptors装饰器启用,然后通过@UploadedFiles装饰器取出参数.
>
> 注意: 非文件格式的内容,同样也是通过@Body装饰器来取出参数.

- 后端实现

```ts
@Controller('person')
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  // query参数
  @Get('find')
  testQuery(@Query('username') username: string, @Query('age') age: number) {
    return `username: ${username}, age: ${age}`;
  }

  // url param参数
  // @Controller('api/pseron)的路由和@Get('id)的路由会拼到一起,也就是只有/api/person/xxx的get请求才会命中这个方法
  @Get(':id')
  urlParamTest(@Param('id') id: string) {
    return `id=${id}`;
  }

  // form urlencoded参数
  @Post()
  formURLEncoded(@Body() createPersonDto: CreatePersonDto) {
    return `obj: ${JSON.stringify(createPersonDto)}`;
  }

  // json
  @Post('testJson')
  json(@Body() CreatePersonDto: CreatePersonDto) {
    return `json: ${JSON.stringify(CreatePersonDto)}`;
  }

  // form data
  @Post('upload')
  @UseInterceptors(
    AnyFilesInterceptor({
      dest: 'uploads/',
    }),
  )
  formData(
    @Body() createPersonDto: CreatePersonDto,
    @UploadedFiles() files: Array<Express.Multer.File>, // 需要先安装 @types/multer才可以使用
  ) {
    console.log('files:', files);
    return `obj: ${JSON.stringify(createPersonDto)}`;
  }
}
```

- 前端测试

```html
<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Document</title>
</head>

<body>
	<script src="https://unpkg.com/axios@0.24.0/dist/axios.min.js"></script>
	<script src="https://unpkg.com/qs@6.10.2/dist/qs.js"></script>

	<input type="file" id="fileInput" multiple>

	<script>

		// url param
		async function urlParam() {
			const res = await axios.get('/api/person/1')
			console.log(res)
		}

		urlParam()


		// query
		async function query() {
			// const res = await axios.get('/api/person/find?username="xinxin"&age="18')
			const res = await axios.get('/api/person/find', {
				params: {
					username: "xinxin",
					age: 18
				}
			})
			console.log(res)
		}

		query()

		// form-urlencoded
		async function formURLEncoded() {
			const res = await axios.post('/api/person', Qs.stringify({
				username: "zxx",
				age: 18,
				height: 1.88
			}),
				{
					headers: { 'content-type': 'application/x-www-form-urlencoded' }
				}
			)

			console.log(res)
		}

		formURLEncoded()

		// json
		async function json() {
			const res = await axios.post('/api/person/testJson', {
				username: "xin",
				age: 20,
				height: 1.99
			},
				{
					// headers: { 'content-type': 'application/json' }
				}
			)
			console.log(res)
		}

		json()

		// form data
		const fileInput = document.querySelector("#fileInput")

		async function formData() {
			const data = new FormData()
			data.set('username', 'zxx')
			data.set('age', 19)
			data.set('height', 1.99)
			data.set('file1', fileInput.files[0])
			data.set('file2', fileInput.files[1])

			const res = await axios.post('/api/person/upload', data, {
				headers: { 'content-type': 'multipart/form-data' }
			})

			console.log(res)
		}

		fileInput.onchange = formData
	</script>
</body>

</html>
```

