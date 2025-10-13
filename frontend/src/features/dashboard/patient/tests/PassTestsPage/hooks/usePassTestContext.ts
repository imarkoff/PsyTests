"use client";

import {useContext} from "react";
import PassTestContext from "@/features/dashboard/patient/tests/PassTestsPage/contexts/PassTestContext";

export const usePassTestContext = () => useContext(PassTestContext);