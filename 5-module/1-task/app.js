const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')('public'));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

let users = [];

function sendMessageToUsers (data) {
    users.forEach((user) => user.resolve(data));
    users = [];
} 

function allUsers (ctx) {
    return  new Promise(resolve => {
        users = users.concat({id: ctx.request.query.r, resolve: resolve});
        ctx.res.on('close', () => {
            users = users.filter(user => user.id !== ctx.request.query.r );
        });
    })
}
    

router.get('/subscribe', async (ctx, next) => {
    const user = allUsers(ctx);
    ctx.body = await user;
});

router.post('/publish', async (ctx, next) => {
    const { message } = ctx.request.body;
    if (!message) {
        ctx.status = 400;
        ctx.body = 'No content';
    } else {
        ctx.status = 200;
        sendMessageToUsers(message);
    }
});

app.use(router.routes());

module.exports = app;
