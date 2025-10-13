import {UseGetTestApiReturn} from "@/features/shared/psy-test-viewer/hooks/lib/useGetTestApi";
import TestConfigType from "@/features/shared/psy-test-definitions/TestConfig";
import TestBase from "@/types/models/TestBase";
import TestResult from "@/types/models/TestResult";
import {Roles} from "@/types/enums/Role";

interface CheckDoesTestHaveMarksSystemProps {
    api: UseGetTestApiReturn;
    userRole: Roles;
    layouts: Partial<TestConfigType<TestBase, TestResult>>['test'];
}

export default function checkTestHasMarksSystem(
    {api, userRole, layouts}: CheckDoesTestHaveMarksSystemProps
): boolean | undefined {
    if (userRole === Roles.patient) return false;

    if (api.isLoading || !!api.error || !api.test || !layouts) {
        return undefined;
    }

    return !!layouts.marks;
}