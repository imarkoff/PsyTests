export default interface PassTest {
    assigned_test_id: string;
    /**
     * Question number is the index in the list and the value is the answer number
     * Example: [0, 3, 1, 5, 2]
     */
    answers: number[];
}