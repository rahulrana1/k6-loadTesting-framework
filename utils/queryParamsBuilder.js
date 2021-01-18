export function buildQueryParams(data) {
    const result = [];

    Object.keys(data)
        .forEach((key) => {
            const encode = encodeURIComponent;
            result.push(encode(key) + "=" + encode(data[key]));
        });

    return result.join("&");
}