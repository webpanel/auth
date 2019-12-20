export declare type WrappedPromiseResult<T> = {
    read: () => T | undefined;
};
export declare function wrapValue<T>(v: T): WrappedPromiseResult<T>;
export declare function wrapPromise<T>(p: Promise<T>): WrappedPromiseResult<T>;
