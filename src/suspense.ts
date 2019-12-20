export type WrappedPromiseResult<T> = { read: () => T | undefined };
export function wrapValue<T>(v: T): WrappedPromiseResult<T> {
  return { read: () => v };
}
export function wrapPromise<T>(p: Promise<T>): WrappedPromiseResult<T> {
  let status: "pending" | "error" | "success" = "pending";
  let result: T;
  let suspender = p.then(
    r => {
      status = "success";
      result = r;
    },
    e => {
      status = "error";
      result = e;
    }
  );
  return {
    read() {
      if (status === "pending") {
        throw suspender;
      } else if (status === "error") {
        throw result;
      }
      return result;
    }
  };
}
