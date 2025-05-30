import {UseFormRegisterReturn} from "react-hook-form";

export const mockedContext = {
    register: () => ({ name: "test", onChange: jest.fn(), onBlur: jest.fn() }) as unknown as UseFormRegisterReturn,
    error: undefined,
    index: 0,
    moduleName: "science",
    chosenAnswer: undefined,
    handleAnswerChange: jest.fn()
}