import TestBase from "@/schemas/TestBase";
import Question from "@/schemas/Question";

export default interface Test extends TestBase {
    questions: Question[] | null;
    modules: TestModule[] | null;
}

export interface TestModule {
    name: string;
    description?: string;
    path: string;
    questions: Question[];
}