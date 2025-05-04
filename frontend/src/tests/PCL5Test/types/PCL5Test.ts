import TestBase from "@/schemas/TestBase";
import PCL5Criteria from "@/tests/PCL5Test/types/PCL5Criteria";
import PCL5Answer from "@/tests/PCL5Test/types/PCL5Answer";
import PCL5Question from "@/tests/PCL5Test/types/PCL5Question";

export interface PCL5Test extends TestBase {
    criterion: PCL5Criteria[];
    answers: PCL5Answer[];
    questions: PCL5Question[];
}