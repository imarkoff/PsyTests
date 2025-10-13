import TestBase from "@/types/models/TestBase";
import PCL5Criteria from "@/features/shared/psy-test-definitions/PCL5Test/types/PCL5Criteria";
import PCL5Answer from "@/features/shared/psy-test-definitions/PCL5Test/types/PCL5Answer";
import PCL5Question from "@/features/shared/psy-test-definitions/PCL5Test/types/PCL5Question";

export interface PCL5Test extends TestBase {
    criterion: PCL5Criteria[];
    answers: PCL5Answer[];
    questions: PCL5Question[];
}