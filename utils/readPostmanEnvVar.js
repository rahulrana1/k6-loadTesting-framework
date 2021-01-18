
export function getPostmanEnvValue(jsonData, key) {
    let value
    try {
        for (let i = 0; i <= jsonData.values.length - 1; i++){
            if (jsonData.values[i].key === key) {
                value = jsonData.values[i].value
                return value
            }
        }

        if (typeof value === 'undefined') {
            throw new Error('could not find postman env variable');
        }
    }
    catch (err) {
        console.error(err);
    }
}
