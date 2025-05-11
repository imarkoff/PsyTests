import TestInfoType from "@/tests/TestInfoType";
import BDITest from "@/tests/BDITest/types/BDITest";
import BDIQuestionCard from "@/tests/BDITest/components/BDIQuestionCard";

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