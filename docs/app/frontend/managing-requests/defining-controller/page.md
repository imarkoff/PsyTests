# Defining controller

Controllers are a place to manage requests to services and handle response.
However, to initialize a service, you should pass `axios` instance to the service constructor.

## An example of a boilerplate controller

> [!IMPORTANT]
>
> The code below is an example of how to create a controller and service.
> You should not use this code in the project.

```ts
import {AxiosError} from "axios";
import {ISafeError} from "@/lib/api-client/SafeError";

export const someController = async () => {
    const api = createAxiosInstance();
    const service = new SomeService(api);
    try {
        return await service.someMethod();
    } catch (error) {
        if (error instanceof AxiosError) {
            return {
                message: error.message,
                name: error.name,
                status: error.status ?? 500
            } as ISafeError;
        }
    }
};
```

This way creates a lot of responsibility and boilerplate code even for the simplest service calls.

And what would happen if backend returns an error (e.g. 404) and you forgot to handle it?
In result, you will get an 500 error in the frontend.

## Why use fetchers?

To simplify the process of making requests to services,
we have created a set of functions in the `lib/fetchers` module.
Also these functions handle errors and responses in a consistent way.

- `fetchPublic` is used for public services, which do not require authentication.
- `fetchProtected` is used for protected services, which require authentication.

Sample real-world controller:

```ts
import {fetchPublic, fetchProtected} from "@/lib/fetchers";

export const someController = async () => fetchPublic(
    SomeService,
    service => service.someMethod()
)

export const someProtectedController = async () => fetchProtected(
    SomeService,
    async (service) => {
        const data = await service.someMethod()
        // some additional logic
        return data;
    }
);
```

As you can see, the controller is much simpler and easier to read.
You just need to pass the service class and a method to call.
Also you can forget about handling error if backend returns a proper error response.