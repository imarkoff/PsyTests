"use client";

import {createContext} from "react";
import PassTestData from "../types/PassTestData";

const PassTestContext = createContext<{
    passTest: (data: PassTestData) => Promise<void>;
    passed: boolean;
    loading: boolean;
}>({
    passTest: async () => {},
    passed: false,
    loading: false,
});

export default PassTestContext;