"use client";

import {useContext} from "react";
import TestContext from "@/features/dashboard/patient/tests/[testId]/[assignedTestId]/contexts/TestContext";

export const useTestContext = () => useContext(TestContext);