import MMPIAnswer from "@/features/shared/psy-test-definitions/MMPITest/schemas/MMPIAnswer";

export default interface MMPIQuestion {
    id: string;
    question: string;
    answers: MMPIAnswer[];
}