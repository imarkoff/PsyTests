"use client";

import PsyTestContext from "@/features/shared/psy-test-viewer/contexts/PsyTestContext";
import {Roles} from "@/types/enums/Role";
import {PropsWithChildren} from "react";
import testsConfig from "@/features/shared/psy-test-definitions/config";
import useGetTestApi from "@/features/shared/psy-test-viewer/hooks/lib/useGetTestApi";
import checkTestHasMarksSystem from "@/features/shared/psy-test-viewer/utils/checkTestHasMarksSystem";

interface TestStoreProviderProps extends PropsWithChildren {
    testId: string;
    userRole: Roles;
}

export default function PsyTestProvider(
    {testId, userRole, children}: TestStoreProviderProps
) {
    const getTestApi = useGetTestApi(testId);

    const testLayout = getTestApi.test ? testsConfig[getTestApi.test.type] : null;

    const hasMarksSystem = checkTestHasMarksSystem({
        api: getTestApi,
        userRole: userRole,
        layouts: testLayout?.test
    })

    return (
        <PsyTestContext.Provider value={{
            ...getTestApi,
            userRole: userRole,
            hasMarksSystem,
            layouts: testLayout?.test || {},
        }}>
            {children}
        </PsyTestContext.Provider>
    );
}