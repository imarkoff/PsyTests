import React from "react";
import Question from "@/schemas/Question";
import QuestionBase, {QuestionBaseProps} from "@/components/QuestionCard/QuesitonBase";
import { TestType } from "@/schemas/TestBase";

type QuestionCardProps = {
    question: Question;
    testType: TestType;
} & QuestionBaseProps;

export default function QuestionCard(
    {...props}: QuestionCardProps
) {

    switch (props.testType) {
        case "raven":
            return (
                <QuestionBase {...props} answers={props.question.answers} />
            );
        case "mmpi":
            return (
                <QuestionBase {...props} answers={[
                    {
                        id: "1",
                        answer: "Погоджуюсь"
                    },
                    {
                        id: "2",
                        answer: "Не погоджуюсь"
                    }
                ]} />
            );
    }
}