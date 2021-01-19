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
};

/**
 * Deep merge style object
 *
 * @description only works in jsx
 * @example `{ A: x, B: x } + { A: y, B: y } = { A: [x, y], B: [x, y] }`
 * @return StyleProp
 * **/
export function deepMergeStyle(...objects){
    try{
        return Array.prototype.reduce.call(
            objects,
            (prev, obj)=>{
                Object.keys(obj).forEach(key => {
                    prev[key] = [].concat(prev[key], obj[key])
                });
                return prev;
            },
            {}
        )
    }catch (e) {
        return {}
    }
}
