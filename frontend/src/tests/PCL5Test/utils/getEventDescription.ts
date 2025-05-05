import PCL5Result from "@/tests/PCL5Test/types/PCL5Result";

export default function getEventDescription(result: PCL5Result) {
    return result.results?._[0];
}