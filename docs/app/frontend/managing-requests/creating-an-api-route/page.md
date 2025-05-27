# Creating an API Route (Route Handler)

More information about Route Handlers can be found in the [Next.js documentation](https://nextjs.org/docs/app/building-your-application/routing/route-handlers).
This article says how and when to create an API Route in this application.

Create an API Route is helpful when you need to get a file from backend or refresh token by just visiting a specific URL.

> [!NOTE]
>
> Please do not use API Routes for fetching routes that usually returns JSON data.
> For those cases, call controllers directly from the frontend.

A new Route Handler can be created in the `app/api` directory.
For example, to create a route for refreshing the token, create a file named `refresh-token/route.ts`:

```ts
import {NextRequest, NextResponse} from "next/server";
import {refreshToken} from "@/lib/controllers/tokenController";

export const GET = async (request: NextRequest) => {
    const returnTo = request.nextUrl.searchParams.get("returnTo");

    const { error } = await refreshToken();

    if (error) return new NextResponse(error.statusText, { status: error.status });

    if (returnTo) {
        return NextResponse.redirect(new URL(returnTo ?? "/dashboard", request.url));
    } else {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }
}
```

Then define a function in the `lib/urls` directory to safely track usage of this route:

```ts
export const getRefreshTokenUrl = (returnTo: string) =>
    '/api/refresh-token?returnTo=' + encodeURIComponent(returnTo);
```

This function can be used in the frontend to call the API Route.

```ts
"use client";

import { getRefreshTokenUrl } from "@/lib/urls";
import { useRouter } from "next/navigation";

export const useRefreshToken = () => {
    const router = useRouter();

    const refreshToken = async () => {
        const currentUrl = window.location.href;

        const url = getRefreshTokenUrl(currentUrl);
        router.push(url);
    };

    return { refreshToken };
};
```

Note, that we are not fetching data from backend directly in the route handler.
Instead, we are calling the controller function `refreshToken` which handles the request and response logic.

With this creating a dedicated API Route is useful
only when you need to do an action (e.g. get a file by visiting a url).
Creating a dedicated API Route for JSON data is not needed.
