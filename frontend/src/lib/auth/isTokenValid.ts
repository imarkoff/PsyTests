import "server-only";
import decodeToken from "./decodeToken";

export default async function isTokenValid(token: string): Promise<boolean> {
    try {
        await decodeToken(token);
        return true;
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error when validating token:", error.message);
        } else {
            console.error("Error verifying JWT token");
        }
        return false;
    }
}