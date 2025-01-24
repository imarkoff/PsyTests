import {TestMarks} from "@/schemas/Test";

/**
 * Short version of a test
 * @see Test
 */
export default interface TestShort {
    id: string;
    name: string;
    description?: string;
    marks: TestMarks;
}