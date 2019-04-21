# koa-wechat-xml-body

> 为 koa 解析 xml 请求

## Usage

```js
const koa = require('koa')
const xmlParser = require('koa-wechat-xml-body')

const app = koa()
app.use(xmlParser())

app.use(function(ctx, next) {
    // the parsed body will store in this.request.body
    // if nothing was parsed, body will be undefined
    ctx.body = ctx.request.body
    return next()
})
```

## Options

- **encoding**: requested encoding. Default is `utf8`. If not set, the lib will retrive it from `content-type`(such as `content-type:application/xml;charset=gb2312`).
- **limit**: limit of the body. If the body ends up being larger than this limit, a 413 error code is returned. Default is `1mb`.
- **length**: length of the body. When `content-length` is found, it will be overwritten automatically.
- **onerror**: error handler. Default is a `noop` function. It means it will **eat** the error silently. You can config it to customize the response.
- **xmlOptions**: options which will be used to parse xml. Default is `{}`. See [`xml2js Options`](https://github.com/Leonidas-from-XIV/node-xml2js#options) for details.
- **key**: A chance to redefine what the property name to use instead of the default `body (ctx.request.body)`.

```js
app.use(xmlParser({
    limit: 128,
    encoding: 'utf8', // lib will detect it from `content-type`
    xmlOptions: {
        explicitArray: false
    },
    key: 'xmlBody', // lib will check ctx.request.xmlBody & set parsed data to it.
    onerror: (err, ctx) => {
        ctx.throw(err.status, err.message);
    }
}))
```
