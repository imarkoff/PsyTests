# Fetching on Client Side

Fetching data on the client side is going by calling controllers (`lib/controllers`) directly from the components.
Or you can use Route Handlers (by getting link in `lib/urls`) to fetch data from the server.

Also, there is two ways how to fetch Controllers:
1. Just fetch request and manually handle `ApiResponse` somewhere in the project.
2. Fetch request with `withSafeErrorHandling` HOF to get data directly and throw errors if they occur.

## Fetching Controller with manual handling of `ApiResponse`

For instance, you want to fetch data in the server component.

```tsx
"use server";

import {getAssignedTests} from "@/lib/controllers/PatientTestController";
import {ApiResponse} from "@/lib/api-client/types";
import PatientTest from "@/types/PatientTest";
import AssignedTestsPage from "@/app/features/.../AssignedTestsPage";

export default async function Page() {
    const assignedTestsResponse: ApiResponse<PatientTest[]> = await getAssignedTests();

    return (<AssignedTestsPage assignedTestsResponse={assignedTestsResponse} />);
}
```

Right after fetching, you pass `assignedTestsResponse` to the component, which will handle it.

```tsx
import {Box} from "@mui/material";
import {ApiResponse} from "@/lib/api-client/types";
import PatientTest from "@/types/PatientTest";
import AssignedTestsCard from "@/app/components/AssignedTestsCard";

export default function AssignedTestsPage(
    {assignedTestsResponse}: { assignedTestsResponse: ApiResponse<PatientTest[]>; }
) {
    const {data: assignedTests, error} = assignedTestsResponse;
    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <Box>
            {assignedTests.map(test => (
                <AssignedTestsCard key={test.id}>{test.name}</AssignedTestsCard>
            ))}
        </Box>
    );
}
```

## Fetching Controller with `withSafeErrorHandling`

If you don't want to handle `ApiResponse` manually or you want to use SWR,
you can use `withSafeErrorHandling` HOF to fetch data directly and throw errors if they occur.

```tsx
"use client";

import {getAssignedTests} from "@/lib/controllers/PatientTestController";
import useSWR from "swr";
import {withSafeErrorHandling} from "@/lib/fetchers/withSafeErrorHandling";
export default function useAssignedTests() {
    const {data, error, isLoading} = useSWR(
        "assigned-tests",
        withSafeErrorHandling(getAssignedTests)
    );

    return {
        assignedTests: data,
        isLoading,
        error
    };
}
```

Then you can use this hook in your component:

```tsx
import {Box} from "@mui/material";
import useAssignedTests from "@/app/features/.../useAssignedTests";

export default function AssignedTestsPage() {
    const {assignedTests, isLoading, error} = useAssignedTests();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <Box>
            {assignedTests.map(test => (
                <AssignedTestsCard key={test.id}>{test.name}</AssignedTestsCard>
            ))}
        </Box>
    );
}
```