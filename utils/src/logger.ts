const methodToColorMap = {
    debug: `#7f8c8d`,
    log: `#2ecc71`,
    warn: `#f39c12`,
    error: `#c0392b`
};

type LogMethod = 'debug' | 'log' | 'warn' | 'error';

export const createLogPrinter = (context: string) => {
    const print = (method: LogMethod) => {

        const styles = [
            `background: ${methodToColorMap[method]}`,
            `border-radius: 0.5em`,
            `color: white`,
            `font-weight: bold`,
            `padding: 2px 0.5em`,
        ];
        
        const logPrefix = [`%c${context}`, styles.join(';')];
        return (...args: any[]) => {
            if(Array.isArray(args))
                console[method](...logPrefix, ...args);
            else
                console[method](...logPrefix, args);
        }
    };

    return {
        debug: print('debug'),
        log: print('log'),
        warn: print('warn'),
        error: print('error')
    }
}
