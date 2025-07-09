function isClose(a, b, rel_tol = 1e-8, abs_tol = 1e-8) {
    return Math.abs(a - b) <= Math.max(rel_tol * Math.max(Math.abs(a), Math.abs(b)), abs_tol);
}


function degToRad(x) {
    return x / 180.0 * Math.PI;
}

function rotateX(coord, t) {
    const x = coord[0];
    const y = coord[1];
    const z = coord[2];
    return [
        x,
        y * Math.cos(t) - z * Math.sin(t),
        y * Math.sin(t) + z * Math.cos(t)];
}

function rotateY(coord, t) {
    const x = coord[0];
    const y = coord[1];
    const z = coord[2];
    return [
        x * Math.cos(t) + z * Math.sin(t),
        y,
        -x * Math.sin(t) + z * Math.cos(t)];
}

export { isClose, degToRad, rotateX, rotateY };