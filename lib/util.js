/**
 * Format a time string as mm:ss
 *
 * @param {int} time time in milliseconds
 * @return {string} formatted time string in mm:ss format
 */
export const formatTime = ( seconds=0 ) => {
    let formatArr = Boolean(parseInt(seconds / 60 / 60)>0)?
        [
            parseInt(seconds / 60 / 60),
            parseInt(seconds / 60 % 60),
            parseInt(seconds % 60)
        ]:
        [
            parseInt(seconds / 60 % 60),
            parseInt(seconds % 60)
        ];
    return formatArr
        .join(":")
        .replace(/\b(\d)\b/g, "0$1");
}
