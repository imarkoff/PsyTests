import TestBase from "@/schemas/TestBase";
import RavenQuestion from "@/tests/RavenTest/schemas/RavenQuestion";

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