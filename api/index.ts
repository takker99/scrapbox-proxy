import { Application, Router } from "https://deno.land/x/oak@v9.0.1/mod.ts";

const router = new Router();
router.get(
  "/api/(.*)",
  async (ctx) => {
    const req = ctx.request;
    const url = `https://scrapbox.io${req.url.pathname}`;
    console.log(`fetch ${url}...`);
    const res = await fetch(url, {
      ...req,
    });
    console.log(`fetched.`);
    ctx.response.headers = res.headers;
    ctx.response.status = res.status;
    ctx.response.body = res.body;
  },
);

const app = new Application();
app.addEventListener("error", (evt) => {
  // Will log the thrown error to the console.
  console.log(evt.error);
});

app.use(router.routes());
app.use(router.allowedMethods());

export default app.handle;
