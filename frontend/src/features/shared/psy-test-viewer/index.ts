import PsyTestProvider from "./contexts/PsyTestProvider";
import PsyTestTitle from "./components/PsyTestTitle";
import PsyTestHeaderDetails from "./components/PsyTestHeaderDetails";
import PsyTestContent from "./components/PsyTestContent";
import usePsyTestContext from "./hooks/usePsyTestContext";
import MarksDialog from "./components/PsyTestMarksDialog";
import PsyTestErrorAlert from "./components/PsyTestErrorAlert";

const PsyTestViewer = {
    Provider: PsyTestProvider,
    Title: PsyTestTitle,
    HeaderDetails: PsyTestHeaderDetails,
    Content: PsyTestContent,
    ErrorAlert: PsyTestErrorAlert,
    MarksDialog: MarksDialog
};

export { usePsyTestContext };
export default PsyTestViewer;