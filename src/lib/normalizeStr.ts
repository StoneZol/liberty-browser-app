export const normalizeStr = (str: string) => {
    return str
        .replace(/¶/g, '')
        .trim()
}