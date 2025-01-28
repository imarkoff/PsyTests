import Test from "@/schemas/Test";
import {Box, Typography} from "@mui/material";
import Marks from "@/components/Test/Marks";
import QuestionCard from "@/app/dashboard/patient/tests/[assignedTestId]/components/QuestionCard/QuesitonCard";
import AssignTestButton from "@/app/dashboard/doctor/tests/AssignTestDialog/AssignTestButton";

export default function TestContent({test}: {test?: Test}) {
    const totalQuestions = test?.questions.length;
    const totalPoints = test?.questions.reduce(
        (acc, question) => acc + (question.points || 1), 0);

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
                    <Marks marks={test.marks} />
                </Box>
            </Box>

            {test.questions.map((question, index) => (
                <QuestionCard question={question} key={index} testId={test.id} index={index} disabled />
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