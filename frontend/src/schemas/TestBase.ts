/**
 * Short version of a test
 * @see Test
 */
export default interface TestBase {
    id: string;
    name: string;
    type: TestType;
    description?: string;
    marks_path?: string;
    marks_unit?: string;
}

export type TestType = "raven" | "mmpi" | "mmpi_big" | "pcl-5";