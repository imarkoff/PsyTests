import TestBase from "@/schemas/TestBase";

export default interface BDITest extends TestBase {
    questions: BDIQuestion[];
}

export interface BDIQuestion {
    id: string;
    answers: BDIAnswer[];
}

export interface BDIAnswer {
    name: string;
    mark: number | null;
}