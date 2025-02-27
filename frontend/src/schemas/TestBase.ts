/**
 * Short version of a test
 * @see Test
 */
export default interface TestBase {
    id: string;
    name: string;
    description?: string;
    marks_path?: string;
    marks_unit?: string;
}