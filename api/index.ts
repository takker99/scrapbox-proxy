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
    const debugLines = (await res.clone().text()).split("\n");
    console.log([debugLines.at(0), "...", debugLines.at(-1)]);
    for (
      const name of [
        "Content-Type",
        "X-Content-Type-Options",
        "X-Frame-Options",
        "Date",
        "Etag",
        "Vary",
        "Via",
        "X-This-Is-Not-A-Vulnerability",
        "Strict-Transport-Security",
      ]
    ) {
      if (!res.headers.has(name)) continue;

      ctx.response.headers.set(name, res.headers.get(name)!);
    }
    ctx.response.status = res.status;
    ctx.response.body = await res.text();
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
