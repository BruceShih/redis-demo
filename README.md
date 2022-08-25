# Redis tutorial

## Page 1

- Redis stands for Remote Dictionary Server
- In memory database
- Stores snapshot on hard disk for reconstruct

## Page 2

- Key-value
- Data types:
  - STRING
  - LIST: `[ A > B > C > C ]`
    Linked list, implement stack and queue
  - SET: `{ A, B, C }`
    Unordered collection of unique strings
  - SORTED SET: `{ A: 1, B: 2, C: 3 }`
    Ordered SET
  - HASH: `{ a: “foo”, b: “bar” }`
  - Others: BITMAP, BITFIELD, GEOSPATIAL, HYPERLOG, STREAM

## Page 3

- Redis CLI
  - To connect: `redis-cli`
  - Ping server: `PING`
  - Set data: `SET foo "\"{'username': 'bruce', 'ticket_id': 321}\""`
  - Retrieve data: `GET foo`
  - Delete data: `DEL foo`
  - Clear database (DANGEROUS): `FLUSHALL`

## Page 4

- RediSearch
- RedisGraph
- RedisJSON
- RedisAI
- and more…

## Page 5

- MAC: `brew install redis`
- Linux (Ubuntu/Debian):

```bash
curl -fsSL https://packages.redis.io/gpg | sudo gpg --dearmor -o /usr/share/keyrings/redis-archive-keyring.gpg

echo "deb [signed-by=/usr/share/keyrings/redis-archive-keyring.gpg] https://packages.redis.io/deb $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/redis.list

sudo apt-get update
sudo apt-get install redis
```

- Windows: Docker image (WSL2 enabled)

## Page 6

### Demo Project

- Deno
  - Linux

  ```bash
  curl -fsSL https://deno.land/install.sh | sh
  ```

  - Mac

  ```bash
  brew install deno
  ```

  - Windows (PowerShell)

  ```powershell
  iwr https://deno.land/install.ps1 -useb | iex
  ```

- Redis server

```bash
docker run --name redis-demo -p 6379:6379 -d redis
```

- Folder structure

```bash
.
├── .vscode
│   └── settings.json
├── README.md
├── direct
│   └── mod.ts
└── oak
    └── mod.ts
```

- settings.json (for Deno environment)

```bash
{
  "deno.enable": true,
  "deno.unstable": true
}
```

- oak/mod.ts (Deno API)

```tsx
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
```

### Running the Demo Project

- Start Deno API

```bash
deno run ./oak/mod.ts --allow-net
```

- Get a key

```bash
curl --location --request GET 'http://localhost:8080/get/foo'
```

- Set a key

```bash
curl --location --request POST 'http://localhost:8080/set' \
--header 'Content-Type: application/json' \
--data-raw '{
    "key": "test",
    "value": "asd"
}'
```
