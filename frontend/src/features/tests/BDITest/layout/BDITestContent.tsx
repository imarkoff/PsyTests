import BDITest from "@/features/tests/BDITest/types/BDITest";
import BDIQuestionCard from "@/features/tests/BDITest/components/BDIQuestionCard";
import {TestInfoType} from "@/features/tests/TestConfig";

export default function BDITestContent({ test, disabled }: TestInfoType<BDITest>) {
    return (
        test.questions.map((question, index) => (
            <BDIQuestionCard
                key={index}
                question={question}
                index={index}
                disabled={disabled}
            />
        ))
    );
}