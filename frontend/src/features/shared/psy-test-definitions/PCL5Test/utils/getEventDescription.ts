import PCL5Result from "@/features/shared/psy-test-definitions/PCL5Test/types/PCL5Result";

export default function getEventDescription(result: PCL5Result) {
    return result.results?._[0];
}