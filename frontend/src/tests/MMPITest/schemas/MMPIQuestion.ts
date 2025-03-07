import MMPIAnswer from "@/tests/MMPITest/schemas/MMPIAnswer";

export default interface MMPIQuestion {
    id: string;
    question: string;
    answers: MMPIAnswer[];
}