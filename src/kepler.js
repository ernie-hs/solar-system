function isClose(a, b, rel_tol = 1e-8, abs_tol = 1e-8) {
    return Math.abs(a - b) <= Math.max(rel_tol * Math.max(Math.abs(a), Math.abs(b)), abs_tol);
}

function newtonRaphson(x, fn, dfn, r = 0) {
    const y = fn(x);
    const x2 = x - y / dfn(x);
    const y2 = fn(x2);
    if (isClose(y2, y) || r > 8) return x2;
    return newtonRaphson(x2, fn, dfn, r + 1);
}

function kepler(epsilon, M) {
    function f(E) {
        return E - epsilon * Math.sin(E) - M;
    };

    function df(E) {
        return 1.0 - epsilon * Math.cos(E);
    };

    function theta(E) {
        const theta = 2.0 * Math.atan(Math.sqrt((1.0 + epsilon) / (1.0 - epsilon)) * Math.tan(E / 2.0));
        return theta < 0 ? (2.0 * Math.PI) + theta : theta;
    }

    return {
        M: M,

        epsilon: epsilon,

        trueAnomoly: theta(newtonRaphson(Math.PI, f, df))
    };
}

export { kepler };