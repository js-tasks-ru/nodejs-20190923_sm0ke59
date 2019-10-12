const Koa = require('koa');
const app = new Koa();
const os = require('os');

app.use(require('koa-static')('public'));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

// 1. сохранить пользователя
// 2. отправить ему все сообщения
// 3. при добавлении нового сообщения отправить его всем пользователям
// 4. если пользователь закрыл браузер - удалить его из подписчиков 

let users = [];
let allMessage = [];


function sendMessageToUsers (data) {
    users.forEach((user) => user.resolve(data));
    users = [];
} 

function allUsers (ctx) {
    const promise =  new Promise(resolve => {
        users = users.concat({id: ctx.request.query.r, resolve: resolve});
        ctx.res.on('close', () => {
            users = users.filter(user => user.id !== ctx.request.query.r );
        });
    })
        return promise;
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
        allMessage = allMessage.concat(message + os.EOL);
        sendMessageToUsers(message);
    }
});

app.use(router.routes());

module.exports = app;
