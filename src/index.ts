import * as Path from "path";
import { isNullOrUndefined } from "util";

let MAP = {};
let POINTS: {};

const mapdule = (name: string) => MAP[name] ? require(MAP[name]) : undefined;
const set = (name: string, target?: string) => { MAP[name] = target; };

const load = (setup: {
  map?: { [name: string]: string; };
  points?: { [point: string]: string; };
} = {}) => {
  const map = setup.map || {};
  const points = setup.points || {};

  Object.keys(map).forEach(name => set(name, map[name]));
  Object.keys(points).forEach(point => from(point).set(points[point]));
};

const from = (point: string) => ({
  set: (path: string) => {
    if (isNullOrUndefined(point)) {
      return undefined;
    }

    const absolute = Path.isAbsolute(path) ? path : Path.resolve(path);
    POINTS[point] = absolute;
    return absolute;
  },
  to: (to: string) => {
    const initial = isNullOrUndefined(point) ? Path.resolve(".") : POINTS[point];
    const target = Path.resolve(initial, to);
    return require(target);
  },
});

const reset = () => {
  MAP = {};
  POINTS = {};
};

module.exports = mapdule;
module.exports.set = set;
module.exports.load = load;
module.exports.from = from;
module.exports.reset = reset;
