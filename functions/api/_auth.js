const COOKIE_NAME = "gallery_session";
const MAX_AGE = 60 * 60 * 24 * 7;

function toBase64Url(bytes) {
  let s = "";
    bytes.forEach(b => s += String.fromCharCode(b));
      return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
      }

      function fromBase64Url(str) {
        str = str.replace(/-/g, "+").replace(/_/g, "/");
          while (str.length % 4) str += "=";
            const bin = atob(str);
              return Uint8Array.from(bin, c => c.charCodeAt(0));
              }

              async function sign(value, secret) {
                const key = await crypto.subtle.importKey(
                    "raw",
                        new TextEncoder().encode(secret),
                            { name: "HMAC", hash: "SHA-256" },
                                false,
                                    ["sign", "verify"]
                                      );

                                        const sig = await crypto.subtle.sign(
                                            "HMAC",
                                                key,
                                                    new TextEncoder().encode(value)
                                                      );

                                                        return toBase64Url(new Uint8Array(sig));
                                                        }

                                                        export async function createSession(env) {
                                                          const now = Math.floor(Date.now() / 1000);
                                                            const value = String(now);
                                                              const signature = await sign(value, env.ADMIN_SESSION_SECRET);
                                                                return `${value}.${signature}`;
                                                                }

                                                                export async function requireAuth(request, env) {
                                                                  const cookie = request.headers.get("Cookie") || "";
                                                                    const match = cookie.match(
                                                                        new RegExp(`${COOKIE_NAME}=([^;]+)`)
                                                                          );

                                                                            if (!match || !env.ADMIN_SESSION_SECRET) return false;

                                                                              const [timestamp, signature] = match[1].split(".");
                                                                                if (!timestamp || !signature) return false;

                                                                                  const age = Math.floor(Date.now() / 1000) - Number(timestamp);
                                                                                    if (!Number.isFinite(age) || age < 0 || age > MAX_AGE) return false;

                                                                                      return await sign(timestamp, env.ADMIN_SESSION_SECRET) === signature;
                                                                                      }

                                                                                      export function cookie(token) {
                                                                                        return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${MAX_AGE}`;
                                                                                        }

                                                                                        export const clearCookie =
                                                                                          `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;

                                                                                          export function json(data, status = 200) {
                                                                                            return new Response(JSON.stringify(data), {
                                                                                                status,
                                                                                                    headers: {
                                                                                                          "Content-Type": "application/json; charset=utf-8"
                                                                                                              }
                                                                                                                });
                                                                                                                }
