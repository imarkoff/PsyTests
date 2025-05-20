export default interface MMPIScale {
    label: string;
    abbrev: string | null;
    name: string;
    min: number; // min - 0
    max: number; // max - 110
    multiply: MMPIMultiplier;
}

export interface MMPIMultiplier {
    scale: string;
    multiplier: number;
}