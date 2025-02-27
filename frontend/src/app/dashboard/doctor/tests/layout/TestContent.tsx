import Test from "@/schemas/Test";
import {Box, Typography} from "@mui/material";
import MarksDialog from "@/components/Test/Marks/MarksDialog";
import QuestionCard from "@/components/QuestionCard/QuesitonCard";
import AssignTestButton from "@/app/dashboard/doctor/tests/AssignTestDialog/AssignTestButton";
import countTestQuestions from "@/utils/countTestQuestions";
import TestBase from "@/schemas/TestBase";

export default function TestContent({test}: {test?: Test | TestBase}) {
    const isBase = (test as Test) === undefined;
    console.log(test);

    const {totalQuestions, totalPoints} = !isBase ? countTestQuestions(test as Test) : {totalQuestions: 0, totalPoints: 0};

    return (test
        ? (<>
            <Box sx={{px: 2, pt: 1, display: "grid", gap: .5}}>
                <Typography variant={"h5"}>{test.name}</Typography>
                <Typography>{test.description}</Typography>
                <Typography>
                    <strong>Кількість питань:</strong> {totalQuestions}
                </Typography>
                <Typography>
                    <strong>Максимальна кількість балів:</strong> {totalPoints}
                </Typography>
                <Box sx={{display: "flex", alignItems: "center", gap: 1, py: 1}}>
                    <AssignTestButton testId={test.id} />
                    {test.marks_path && <MarksDialog test={test} />}
                </Box>
            </Box>

            {(test as Test).questions?.map((question, index) => (
                <QuestionCard
                    question={question}
                    correctAnswer={question.answers.findIndex(answer => answer.is_correct)}
                    key={`${test.id}/question/${index}`} // prevent showing checked answers from other tests
                    testId={test.id}
                    index={index}
                    disabled
                />
            ))}
            {(test as Test).modules?.map((module, index) => (
                module.questions.map((question, j) => (
                    <QuestionCard
                        question={question}
                        correctAnswer={question.answers.findIndex(answer => answer.is_correct)}
                        key={`${test.id}/module/${index}/question/${j}`}
                        module={{name: module.name, path: module.path}}
                        testId={test.id}
                        index={j}
                        disabled
                    />
                ))
            ))}
        </>)
        : (
            <Typography color={"textSecondary"} sx={{
                height: "100%",
                textAlign: "center",
                display: "grid",
                placeItems: "center"
            }}>
                Оберіть тест зліва для перегляду
            </Typography>
        )
    );
}