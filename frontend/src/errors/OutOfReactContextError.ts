/**
 * An error indicating that the React context
 * is being accessed outside a valid provider.
 */
export default class OutOfReactContextError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "OutOfReactContextError";
    }
}