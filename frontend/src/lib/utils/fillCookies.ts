/**
 * Function to fill cookies in the headers
 * @param headers - Headers object to fill cookies into
 * @param args - Array of strings or string arrays representing cookies
 */
export default function fillCookies(headers: Headers, ...args: (string | string[] | undefined)[]) {
    const setCookie = (cookie: string) => headers.append("Set-Cookie", cookie);

    for (const cookie of args) {
        if (Array.isArray(cookie)) {
            for (const cookieFromArray of cookie) setCookie(cookieFromArray);
        } else if (typeof cookie === "string") {
            setCookie(cookie);
        }
    }
}