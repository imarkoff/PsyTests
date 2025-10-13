import TestBase from "@/types/models/TestBase";
import {Roles} from "@/types/enums/Role";
import TestConfigType, {TestInfoType} from "@/features/shared/psy-test-definitions/TestConfig";
import {UseGetTestApiReturn} from "@/features/shared/psy-test-viewer/hooks/lib/useGetTestApi";
import TestResult from "@/types/models/TestResult";

export type PsyTestContextType = UseGetTestApiReturn & {
    userRole: Roles;
    hasMarksSystem: boolean | undefined;
    layouts: Partial<TestConfigType<TestBase, TestResult>['test']>;
}

export type PsyTestComponentProps = Omit<TestInfoType<TestBase>, 'test' | 'role'>;