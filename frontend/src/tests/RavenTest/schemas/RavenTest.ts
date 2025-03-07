import TestBase from "@/schemas/TestBase";
import Question from "@/tests/RavenTest/schemas/Question";

export default interface RavenTest extends TestBase {
    questions: Question[] | null;
    modules: TestModule[] | null;
}

export interface TestModule {
    name: string;
    description?: string;
    path: string;
    questions: Question[];
}