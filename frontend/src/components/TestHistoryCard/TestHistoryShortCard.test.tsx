import { render, screen } from "@testing-library/react";
import TestHistoryShortCard from "./TestHistoryShortCard";
import TestResultShort from "@/types/models/TestResultShort";
import { dateMed } from "@/utils/formatDate";
import "@testing-library/jest-dom";
import {ReactNode} from "react";


// eslint-disable-next-line react/display-name
jest.mock("@/components/TestValues", () => ({ title, children }: {
    title: ReactNode;
    children: ReactNode;
}) => (
    <div data-testid="test-values">
        <span>{title}</span>
        <span>{children}</span>
    </div>
));

jest.mock("@/utils/formatDate", () => ({
    dateMed: jest.fn((date: string) => {
        if (!date || typeof date as unknown !== "string") {
            throw new Error("date is empty");
        }
        return `formatted-${date}`;
    })
}));

const mockTest: TestResultShort = {
    "id": "a2fac5ba-3344-44f3-811a-fd2b7104d1c0",
    "test_id": "a2fac5ba-3344-44f3-811a-fd2b7104d1c0",
    test_name: "Sample Test",
    passed_at: "2024-06-01T12:00:00Z"
};

describe("TestHistoryShortCard", () => {
    it("renders the test name in the card header", () => {
        render(<TestHistoryShortCard test={mockTest} />);
        expect(screen.getByText("Sample Test")).toBeInTheDocument();
    });

    it("renders the formatted passed date in TestValues", () => {
        render(<TestHistoryShortCard test={mockTest} />);
        expect(screen.getByText("Дата проходження")).toBeInTheDocument();
        expect(screen.getByText("formatted-2024-06-01T12:00:00Z")).toBeInTheDocument();
    });

    it("handles missing test_name gracefully", () => {
        render(<TestHistoryShortCard test={{ ...mockTest, test_name: "" }} />);
        const header = document.querySelector('.MuiCardHeader-title');
        expect(header).toBeInTheDocument();
        expect(header).toBeEmptyDOMElement();
    });

    it("handles missing passed_at gracefully", () => {
        (dateMed as jest.Mock).mockReturnValueOnce("formatted-undefined");
        render(<TestHistoryShortCard test={{ ...mockTest, passed_at: undefined as never }} />);
        expect(screen.getByText("formatted-undefined")).toBeInTheDocument();
    });
})

