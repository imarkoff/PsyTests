export default interface STAIQuestion {
    id: string;
    question: string;
    scale: string | null;
    scoring_type: STAIScoringType | null;
}

export type STAIScoringType = "positive" | "negative";