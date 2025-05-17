/**
 * Implements a custom error class that can be serialized and deserialized.
 * Useful for handling errors on a server and creating a consistent error on the client.
 * Creating error on a client side prevents this error: Maximum call stack size exceeded
 *
 * @example
 * ```ts
 * import SafeError from "@/lib/api-client/SafeError";
 * import {getMe} from "@/lib/controllers/userController";
 *
 * const fetchMe = async () => {
 *    const {data, error} = await getMe();
 *    if (error) throw SafeError.fromJSON(error.originalError);
 *    return data;
 * }
 * ```
 */
export default class SafeError extends Error {
    status: number;

    constructor(message: string, name: string = "Error", status: number = 500) {
        super(message);
        this.name = name;
        this.status = status;

        // Required for proper instanceof checks in TypeScript
        Object.setPrototypeOf(this, SafeError.prototype);
    }

    static fromJSON(json: ISafeError): SafeError {
        return new SafeError(json.message, json.name, json.status);
    }

    toJSON(): ISafeError {
        return {
            message: this.message,
            name: this.name,
            status: this.status
        };
    }
}

/**
 * Structure of the error object
 * that is returned from the server.
 * Used to pass original error to the client and create SafeError on the client.
 */
export interface ISafeError {
    message: string;
    name: string;
    status: number;
}