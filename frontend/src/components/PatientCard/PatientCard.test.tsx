import {render, screen, fireEvent} from "@testing-library/react";
import PatientCard from "./PatientCard";
import { mockedPatient } from "./mockedPatient";
import "@testing-library/jest-dom";

jest.mock("@/utils/formatPhone", () => (
    {
        __esModule: true,
        default: (phone: string) => `mocked-${phone}`,
    })
);

it("renders patient full name and formatted phone", () => {
    render(<PatientCard patient={{...mockedPatient, patronymic: "Smith"}} />);

    expect(screen.getByText("Doe John Smith")).toBeInTheDocument();
    expect(screen.getByText(`mocked-${mockedPatient.phone}`)).toBeInTheDocument();
});

it("renders footer content if provided", () => {
    render(<PatientCard patient={mockedPatient} footer={<div>Footer Content</div>} />);

    expect(screen.getByText("Footer Content")).toBeInTheDocument();
});

it("calls onClick with patient when card is clicked", () => {
    const handleClick = jest.fn();

    render(<PatientCard patient={mockedPatient} onClick={handleClick} />);
    fireEvent.click(screen.getByRole("button"));

    expect(handleClick).toHaveBeenCalledWith(mockedPatient);
});

it("shows needs attention chip when needsAttention is true", () => {
    render(<PatientCard patient={mockedPatient} needsAttention />);

    expect(screen.getByText("Потребує уваги")).toBeInTheDocument();
    expect(screen.getByTestId("ErrorOutlineIcon")).toBeInTheDocument();
});

it("does not show needs attention chip when needsAttention is false", () => {
    render(<PatientCard patient={mockedPatient} />);

    expect(screen.queryByText("Потребує уваги")).not.toBeInTheDocument();
});

it("applies selected style when selected is true", () => {
    render(<PatientCard patient={mockedPatient} selected />);

    expect(screen.getByTestId("patient-card")).toHaveAttribute("aria-selected", "true");
});

it("renders correctly when surname and patronymic are missing", () => {
    const patient = { ...mockedPatient, surname: undefined, patronymic: undefined };

    render(<PatientCard patient={patient} />);

    expect(screen.getByText("John")).toBeInTheDocument();
});