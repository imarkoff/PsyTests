/**
 * This interface is used to represent the data that will be sent to the server when passing the test.
 *
 * @example
 * {
 *     assigned_test_id: "9b1f7b1b-7b1b-4b1b-8b1b-1b1f7b1b1b1b",
 *     answers: {
 *         "_": [1, 2, 3, 4, 5, null, 7, null, 9, null],
 *         "module-name": [1, 2, 3, null, 5, 6, 7, 8, null, 10]
 *     }
 * }
 */
export default interface PassTest {
    assigned_test_id: string;
    answers: {[pathName: string]: (number | null)[]};
}