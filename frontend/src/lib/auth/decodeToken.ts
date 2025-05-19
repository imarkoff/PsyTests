import "server-only";
import {Role} from "@/schemas/Role";
import {JWTPayload, jwtVerify} from "jose";

const secretKey = process.env.JWT_SECRET;
const encodedSecretKey = new TextEncoder().encode(secretKey);

interface UserPayload {
    id: string;
    role: Role;
    expires: string;
}

/**
 * Decodes the JWT token from the request and returns the user payload.
 * @param token - The JWT token to decode.
 * @return {Promise<UserPayload>} - The decoded user payload.
 * @throws {TokenError} - If the token is invalid or expired.
 */
export default async function decodeToken(token: string): Promise<UserPayload> {
    const { payload } = await jwtVerify(token, encodedSecretKey);
    if (!isPayloadValid(payload)) throw new TokenError("Invalid Access Token");

    return {
        id: payload.user_id as string,
        role: payload.role as Role,
        expires: payload.expires as string
    };
}

const isPayloadValid = (payload: JWTPayload) => (
    !!payload &&
    !!payload.user_id && !!payload.role && !!payload.expires &&
    !isExpired(payload.expires as string)
);

const isExpired = (expires: string) => {
    const currentTime = Math.floor(Date.now() / 1000);
    const expiresTime = new Date(expires).getTime() / 1000;
    return expiresTime < currentTime;
}

class TokenError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "TokenError";
    }
}