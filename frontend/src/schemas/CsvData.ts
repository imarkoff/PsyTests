type CsvData = CsvRow[];
export default CsvData;

/**
 * TestMarks csv schema
 * @description
 * @example
 * ["1", "2", "3", "4", "5"],
 */
export type CsvRow = Array<string | number | null>;