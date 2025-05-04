export default interface RadioAnswer {
    answer: string;
    value?: string | number;
    image?: RadioAnswerImage;
}

interface RadioAnswerImage {
    src: string;
    alt: string;
}