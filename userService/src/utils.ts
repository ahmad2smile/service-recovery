export const sleepAsync = (ms: number): Promise<void> =>
    new Promise((resolve, reject) => {
        setTimeout(resolve, ms);
    });
