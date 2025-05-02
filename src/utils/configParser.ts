export const parseConfig = (raw: string): string[] => {
    try {
        return JSON.parse(raw) || []
    } catch (e) {
        console.error('Failed to parse config JSON:', e)
        return []
    }
}
