import { bootstrap } from "./bootstrap";

async function start() {
  const app = await bootstrap();
  await app.listen(3333);
}
start();
