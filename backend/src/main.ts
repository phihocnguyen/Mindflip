import { bootstrap } from "./boostrap";

async function start() {
  const app = await bootstrap();
  await app.listen(3333);
}
start();
