export default function extractFilename(disposition: string) {
    let filename = '';

    const filenameRegex = /filename\*\s*=\s*(?:UTF-8'')?([^;\n]+)/i;
    const matches = disposition.match(filenameRegex);
    if (matches) {
        filename = decodeURIComponent(matches[1] || matches[2]);
    }

    return filename;
}