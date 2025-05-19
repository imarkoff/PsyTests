"use server";

import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import {ResponseCookie} from "next/dist/compiled/@edge-runtime/cookies";

/**
 * Sets cookies in the cookie store based on the provided Set-Cookie headers.
 * @param cookieStore - The cookie store to set the cookies in.
 * @param headerCookies - The Set-Cookie headers to parse and set.
 *
 * @example
 * ```ts
 * const cookieStore = await cookies();
 * const setCookieHeader = ["sessionId=abc123; Path=/; HttpOnly", "userId=xyz789; Max-Age=3600"];
 * await setCookiesByHeader(cookieStore, setCookieHeader);
 * ```
 */
export default async function setCookiesByHeader(
    cookieStore: ReadonlyRequestCookies,
    headerCookies: string[]
) {
    headerCookies.forEach(cookieHeader => {
        const { cookieName, cookieValue, parts } = splitCookieHeader(cookieHeader);
        const options = fillCookieOptionsByParts(parts);
        cookieStore.set(cookieName, cookieValue, options);
    });
}

const splitCookieHeader = (cookieHeader: string) => {
    const parts = cookieHeader.split(';').map(part => part.trim());
    const mainPart = parts[0];

    const [name, ...valueParts] = mainPart.split('=');
    const cookieName = name.trim();
    const cookieValue = valueParts.join('=').trim().replace(/^"|"$/g, '');

    return { cookieName, cookieValue, parts }
}

const fillCookieOptionsByParts = (parts: string[]) => {
    const options: Partial<ResponseCookie> = {};

    for (let i = 1; i < parts.length; i++) {
        const { optionKey, optionValue } = parseCookiePart(parts[i])
        fillCookieOption(options, optionKey, optionValue);
    }

    return options;
}

const parseCookiePart = (part: string) => {
    const [key, ...valueParts] = part.split('=');
    const optionKey = key.toLowerCase().trim();
    const optionValue = valueParts.join('=').trim();

    return { optionKey, optionValue };
}

const fillCookieOption = (
    options: Partial<ResponseCookie>,
    key: string,
    value: string
) => {
    switch (key) {
        case 'expires':
            options.expires = parseDate(value);
            break;
        case 'max-age':
            options.maxAge = parseInt(value, 10); break;
        case 'path':
            options.path = value; break;
        case 'domain':
            options.domain = value; break;
        case 'secure':
            options.secure = true; break;
        case 'httponly':
            options.httpOnly = true; break;
        case 'samesite':
            options.sameSite = value.toLowerCase() as ResponseCookie["sameSite"]; break;
    }
}

const parseDate = (dateString: string) => {
    try {
        const date = new Date(dateString);
        // Check if the date is valid
        if (!isNaN(date.getTime())) {
            return date;
        }
        console.error("Invalid date format:", dateString);
        return undefined;
    } catch (e) {
        console.error("Error parsing date:", e);
        return undefined;
    }
}