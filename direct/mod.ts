import { connect } from 'https://deno.land/x/redis@v0.26.0/mod.ts';

const redis = await connect({
  hostname: '127.0.0.1',
  port: 6379
});

const ok = await redis.set('hoge', 'fuga');

console.log(ok);

const fuga = await redis.get('hoge');

console.log(fuga);
