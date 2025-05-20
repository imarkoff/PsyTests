import MMPIAnswer from "@/features/tests/MMPITest/schemas/MMPIAnswer";

export default interface MMPIQuestion {
    id: string;
    question: string;
    answers: MMPIAnswer[];
}