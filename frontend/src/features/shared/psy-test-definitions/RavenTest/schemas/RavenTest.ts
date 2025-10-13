import TestBase from "@/types/models/TestBase";
import RavenQuestion from "@/features/shared/psy-test-definitions/RavenTest/schemas/RavenQuestion";

export default interface RavenTest extends TestBase {
    questions: RavenQuestion[] | null;
    modules: TestModule[] | null;
}

export interface TestModule {
    name: string;
    description?: string;
    path: string;
    questions: RavenQuestion[];
}