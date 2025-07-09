import { isClose } from "./math";

const MAXR = 8;

function newtonRaphson(x, fn, dfn, r = 0) {
    const y = fn(x);
    const x2 = x - y / dfn(x);
    const y2 = fn(x2);
    if (isClose(y2, y) || r >= MAXR) return x2;
    return newtonRaphson(x2, fn, dfn, r + 1);
}

export { newtonRaphson };
