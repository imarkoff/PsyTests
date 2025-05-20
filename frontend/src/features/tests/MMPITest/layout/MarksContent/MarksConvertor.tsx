"use client";

import MMPITest from "@/features/tests/MMPITest/schemas/MMPITest";
import {Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography} from "@mui/material";
import { useForm } from "react-hook-form";
import {useEffect, useMemo, useState} from "react";
import MMPIScale from "@/features/tests/MMPITest/schemas/MMPIScale";

interface ConvertorForm {
    scale: string;
    value: number;
    multiplier?: number;
}

/**
 * Component for converting raw MMPI marks
 * @param test
 * @constructor
 */
export default function MarksConvertor({test}: { test: MMPITest }) {
    const scalesQuestions = useMemo(() => countQuestions(test), [test]);
    const [result, setResult] = useState<number | null>(null);

    const { register, unregister, watch, handleSubmit } = useForm<ConvertorForm>({
        mode: "onChange",
        defaultValues: { scale: test.scales[0].label }
    });
    const scaleLabel = watch("scale");

    const currentScale = useMemo(
        () => test.scales.find(s => s.label === scaleLabel),
        [scaleLabel, test.scales]
    )

    useEffect(() => {
        if (currentScale?.multiply) register("multiplier", { required: true });
        else unregister("multiplier");
    }, [scaleLabel, currentScale, register, unregister]);

    const onSubmit = (data: ConvertorForm) => {
        const scale = test.scales.find(s => s.label === data.scale);
        if (!scale) return;

        setResult(convertResults(data, scale, scalesQuestions));
    };

    return (
        <FormControl
            component={"form"}
            sx={{display: "flex", flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 2}}
            onSubmit={handleSubmit(onSubmit)}
        >
            <Typography fontWeight={"500"}>
                Конвертор сирих балів:
            </Typography>

            <Box sx={{ position: "relative" }}>
                <InputLabel id={"label"}>Шкала</InputLabel>
                <Select
                    labelId={"scale-select"}
                    required
                    defaultValue={test.scales[0].label}
                    label={"Шкала"}
                    sx={{minWidth: 80}}
                    {...register("scale")}
                >
                    {test.scales.map((scale, index) => (
                        <MenuItem
                            value={scale.label}
                            key={index}
                        >
                            {scale.label}
                        </MenuItem>
                    ))}
                </Select>
            </Box>

            <TextField
                label={scaleLabel + " - бали"}
                type={"number"}
                required
                {...register("value", {required: true})}
            />
            {currentScale?.multiply && (
                <TextField
                    label={currentScale.multiply.scale + " - бали"}
                    type={"number"}
                    required
                    {...register("multiplier", {required: true})}
                />
            )}

            <Button type={"submit"}>Перевести</Button>

            {result && (
                <Typography sx={{ml: "auto"}}>
                    <b>Результат:</b> {result.toFixed(1)}
                </Typography>
            )}
        </FormControl>
    );
}

const convertResults = (
    data: ConvertorForm,
    scale: MMPIScale,
    scalesQuestions: { [key: string]: number }
) => {
    const baseValue = Number(data.value);
    const extraValue = scale.multiply
        ? (Number(data.multiplier) ?? 0) * scale.multiply.multiplier
        : 0
    const collected = baseValue + extraValue;

    const maxBase = scalesQuestions[data.scale] ?? 0;
    const maxExtra = scale.multiply
        ? scalesQuestions[scale.multiply.scale] * scale.multiply.multiplier
        : 0;
    const maxQuestions = maxBase + maxExtra;

    return scale.min + (scale.max - scale.min) * collected / maxQuestions;
};

const countQuestions = (test: MMPITest) => {
    const scales: { [key: string]: number } = {};

    test.questions.forEach(question => {
        question.answers.forEach(answer => {
            answer.scales.forEach(scale => {
                scales[scale] = scales[scale] ? scales[scale] + 1 : 1;
            });
        });
    });

    return scales;
};