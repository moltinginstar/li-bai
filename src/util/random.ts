export const choose = (arr: any[]) => {
    const index = Math.floor(Math.random() * arr.length);

    return arr[index];
};
