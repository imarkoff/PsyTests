/**
 * @example
 * {
 *     "_": [1, 2, 3, 4, 5, "", 7, "", 9, ""], // _ means the main test
 *     "module-name": [1, 2, 3, "", 5, 6, 7, 8, "", 10]
 * }
 */
type PassTestData = {[moduleName: string]: (number | "")[]};

export default PassTestData;