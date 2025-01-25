"use client";

import {redirect} from "next/navigation";
// import {Button, Card} from "@mui/material";
// import {getMe} from "@/services/usersService";
// import {getTests} from "@/services/patientTestsService";

export default function Home() {
    // const onClick = async () => {
    //     const response = await getMe();
    //     console.log(response);
    // }
    //
    // const onTestsClick = async () => {
    //     const response = await getTests();
    //     console.log(response);
    // }

    redirect("/login");
    // return (
    //     <Card>
    //         <Button onClick={onClick}>Me</Button>
    //         <Button onClick={onTestsClick}>Tests</Button>
    //     </Card>
    // );
}
