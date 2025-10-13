export default interface PCL5Question {
    id: string | null;
    question: string;
    type: PCL5QuestionType;
    criteria: string;
}

type PCL5QuestionType = "input" | "radio";