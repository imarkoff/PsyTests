import TestBase from "@/schemas/TestBase";
import {Role} from "@/schemas/Role";

export default interface TestInfoType<T extends TestBase> {
    test: T;
    role: Role;
    disabled: boolean;
}