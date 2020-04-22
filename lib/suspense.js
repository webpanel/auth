export function wrapValue(v) {
    return { read: function () { return v; } };
}
export function wrapPromise(p) {
    var status = "pending";
    var result;
    var suspender = p.then(function (r) {
        status = "success";
        result = r;
    }, function (e) {
        status = "error";
        result = e;
    });
    return {
        read: function () {
            if (status === "pending") {
                throw suspender;
            }
            else if (status === "error") {
                throw result;
            }
            return result;
        }
    };
}
//# sourceMappingURL=suspense.js.map