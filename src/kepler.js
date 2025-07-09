import { degToRad, rotateX, rotateY } from "./math";
import { newtonRaphson } from "./newton";

function rt(r, theta) {
    return [r * Math.cos(theta), 0.0, r * Math.sin(theta)]
}

function orbit(props) {
    const A = props.semiMajorAxis * (1.0 - Math.pow(props.eccentricity, 2));
    return {
        p: function (theta) {
            const r = A / (1.0 + props.eccentricity * Math.cos(theta));
            const c = rt(r, theta);
            return rotateY(rotateX(rotateY(c, degToRad(props.argumentOfPeriapsis)),
                degToRad(props.inclination)),
                degToRad(props.longitudeOfAscendingNode));
        },
        o: function* (theta0, thetaN, thetaS) {
            for (let theta = theta0; theta < thetaN; theta += thetaS)
                yield this.p(theta);
        },

    };
}

function kepler(e, M) {
    function f(E) {
        return E - e * Math.sin(E) - M;
    };

    function df(E) {
        return 1.0 - e * Math.cos(E);
    };

    function theta(E) {
        const theta = 2.0 * Math.atan(Math.sqrt((1.0 + e) / (1.0 - e)) * Math.tan(E / 2.0));
        return theta < 0 ? (2.0 * Math.PI) + theta : theta;
    }

    return {
        M: M,

        e: e,

        trueAnomoly: theta(newtonRaphson(Math.PI, f, df))
    };
}

export { kepler, orbit };