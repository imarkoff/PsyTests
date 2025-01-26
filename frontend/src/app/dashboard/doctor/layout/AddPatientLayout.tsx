"use client";

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import {ReactNode, SyntheticEvent, useState} from "react";
import CreatePatient from "@/app/dashboard/doctor/layout/CreatePatient";

interface TabPanelProps {
    children?: ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return value === index && (
        <Box
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {children}
        </Box>
    );
}

const a11yProps = (index: number) => ({
    id: `patient-tab-${index}`,
    'aria-controls': `patient-tabpanel-${index}`,
});

export default function AddPatientLayout() {
    const [value, setValue] = useState(0);

    const handleChange = (event: SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box sx={{width: {xs: "100%", sm: 400}}}>
            <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 3, marginBottom: 2 }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" centered>
                    <Tab label="Створити пацієнта" {...a11yProps(0)} />
                    <Tab label="Знайти пацієнта" {...a11yProps(1)} />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                <CreatePatient />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                Item Two
            </CustomTabPanel>
        </Box>
    );
}
