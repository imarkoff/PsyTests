import BDITest from "@/features/shared/psy-test-definitions/BDITest/types/BDITest";
import BDIQuestionCard from "@/features/shared/psy-test-definitions/BDITest/components/BDIQuestionCard";
import {TestInfoType} from "@/features/shared/psy-test-definitions/TestConfig";

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