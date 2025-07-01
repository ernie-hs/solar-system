function degToRad(x) {
    return x / 180.0 * Math.PI;
}

function ellipse(eccentricity, semi_major_axis) {
    const A = semi_major_axis * (1.0 - Math.pow(eccentricity, 2));
    return function* (t0, tn, ts) {
        for (let t = t0; t < tn; t += ts) {
            const r = A / (1.0 + eccentricity * Math.cos(t));
            yield [r * Math.cos(t), 0, r * Math.sin(t)];
        }
    };
}

export { degToRad, ellipse };