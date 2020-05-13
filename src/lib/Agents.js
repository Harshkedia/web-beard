/* eslint-disable no-continue */
/* eslint-disable no-shadow */
import { Agent, Environment, KDTree, Vector, utils } from "flocc";

/* ------- PARAMETERS --------- */

const ALIGNMENT = 2;
const SEPARATION = 1;
const flockSize = 320;
const width = window.innerWidth;
const height = window.innerHeight;

let tree;

export default function setup() {
  const environment = new Environment({ width, height });

  for (let i = 0; i < flockSize; i++) {
    const agent = new Agent();

    agent.set("p", new Vector(utils.random(0, width), utils.random(0, height)));
    agent.set("x", agent => agent.get("p").x);
    agent.set("y", agent => agent.get("p").y);

    const angle = 2 * Math.random() * Math.PI;
    agent.set("v", new Vector(Math.cos(angle), Math.sin(angle)));

    agent.set("shape", "arrow");
    agent.set("size", 2.5);

    agent.set("vx", a => a.get("v").x);
    agent.set("vy", a => a.get("v").y);

    // eslint-disable-next-line no-use-before-define
    agent.addRule(tick);

    environment.addAgent(agent);
  }

  tree = new KDTree(environment.getAgents(), 2);
  environment.use(tree);

  return environment;
}

function tick(agent) {
  const { p, v } = agent.getData();

  p.x += v.x;
  p.y += v.y;
  if (p.x > width) p.x -= width;
  if (p.x < 0) p.x += width;
  if (p.y > height) p.y -= height;
  if (p.y < 0) p.y += height;

  // update direction
  const d = 30;
  const neighbors = tree.agentsWithinDistance(agent, d);

  if (neighbors.length === 0) return;

  const averageVelocity = new Vector();
  const center = new Vector();
  for (let i = 0; i < neighbors.length; i++) {
    const neighbor = neighbors[i];
    if (neighbor === agent) continue;
    averageVelocity.add(neighbor.get("v"));
    let x = neighbor.get("x");
    let y = neighbor.get("y");
    if (p.x + d > width && x < d) x += width;
    if (p.x - d < 0 && x + d > width) x -= width;
    if (p.y + d > height && y < d) y += height;
    if (p.y - d < 0 && y + d > height) y -= height;
    center.x += x;
    center.y += y;
  }
  center.multiplyScalar(1 / neighbors.length);

  const meanVel = neighbors.reduce((a, b) => a.add(b.get("v")), new Vector());
  meanVel.normalize();
  meanVel.multiplyScalar(ALIGNMENT / 100);

  const towardCenter = p
    .clone()
    .add(center.multiplyScalar(-1))
    .multiplyScalar(SEPARATION / 1000);

  v.add(towardCenter);
  v.add(meanVel);
  v.normalize();
}
