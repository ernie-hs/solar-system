import { kepler } from "./kepler";

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

function rt(r, t) {
    return [r * Math.cos(t), 0.0, r * Math.sin(t)]
}

function orbit(props) {
    const A = props.semi_major_axis * (1.0 - Math.pow(props.eccentricity, 2));
    return {
        p: function (t) {
            const r = A / (1.0 + props.eccentricity * Math.cos(t));
            const c = rt(r, t);
            return rotateY(rotateX(rotateY(c, degToRad(props.argument_of_periapsis)),
                degToRad(props.inclination)),
                degToRad(props.longitude_of_ascending_node));
        },
        o: function* (t0, tn, ts) {
            for (let t = t0; t < tn; t += ts)
                yield this.p(t);
        },

    };
}

export { degToRad, orbit };