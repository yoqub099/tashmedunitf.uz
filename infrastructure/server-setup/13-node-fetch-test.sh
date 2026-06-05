#!/usr/bin/env bash
# Does the Node runtime (undici, same as Next SSR) reach the API at each URL?
node -e '
(async () => {
  const urls = [
    "http://40.47.1.223/api/v1/faculties/1",
    "http://127.0.0.1/api/v1/faculties/1",
    "http://localhost/api/v1/faculties/1"
  ];
  for (const u of urls) {
    try {
      const r = await fetch(u, { signal: AbortSignal.timeout(8000) });
      const t = await r.text();
      console.log(u, "->", r.status, "len=" + t.length);
    } catch (e) {
      console.log(u, "-> ERR", (e.cause && e.cause.code) || e.message);
    }
  }
})();
'
echo "NODEFETCH_DONE_OK"
