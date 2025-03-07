import RavenTest from "@/tests/RavenTest/schemas/RavenTest";

/**
 * Count total questions and points in test
 * @param [test]
 */
export default function countTestQuestions(test?: RavenTest) {
    const total = [
        ...(test?.questions ?? []),
        ...(test?.modules?.flatMap(module => module.questions) ?? [])
    ];

    const totalQuestions = total.length;

    const totalPoints = total.reduce((acc, question) => acc + (question.points ?? 1), 0);

    return {totalQuestions, totalPoints};
}