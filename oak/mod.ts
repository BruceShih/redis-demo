import { Application, Router } from 'https://deno.land/x/oak@v11.0.0/mod.ts';
import { connect } from 'https://deno.land/x/redis@v0.26.0/mod.ts';

const redis = await connect({
  hostname: '127.0.0.1',
  port: 6379
});

const router = new Router();

router.get(`/get/:key`, async (context) => {
  const key = context.params.key;
  const value = await redis.get(key);
  context.response.body = value;
});

router.post('/set', async (context) => {
  const body = context.request.body({
    type: 'json'
});
  const { key, value } = await body.value;
  const ok = await redis.set(key, value);
  context.response.body = ok;
});

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

app.listen({ port: 8080 });
console.log('Listening on port 8080');
