'use strict'

const parse = require('./lib/xml-parser')

module.exports = options => {
    if (typeof options !== 'object') {
        options = {}
    }
    const bodyKey = options.key || 'body'
    return async function plugin(ctx, next) {
        /**
         * only parse and set ctx.request[bodyKey] when
         * 1. type is xml (text/xml and application/xml)
         * 2. method is post/put/patch
         * 3. ctx.request[bodyKey] is undefined or {}
         */
        if (
            ctx.is('text/xml', 'xml') &&
            /^(POST|PUT|PATCH)$/i.test(ctx.method) &&
            (!ctx.request[bodyKey] || Object.keys(ctx.request[bodyKey]).length === 0)
        ) {
            if (!options.encoding && ctx.request.charset) {
                options.encoding = ctx.request.charset
            }
            await parse(ctx.req, options).then(data => {
                ctx.request[bodyKey] = data
            }).catch(err => {
                if (options.onerror) {
                    options.onerror(err, ctx)
                } else {
                    // throw error by default
                    throw err
                }
            })
        }
        await next()
    }
}
