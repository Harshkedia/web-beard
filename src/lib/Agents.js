/* eslint-disable no-continue */
/* eslint-disable no-shadow */
import { Agent, Environment, Vector, utils } from "flocc";

/* ------- PARAMETERS --------- */

class AgentManager {
  static setup(flockSize, width, height) {
    const environment = new Environment({ width, height });

    for (let i = 0; i < flockSize; i++) {
      const agent = new Agent();

      agent.set(
        "p",
        new Vector(utils.random(0, width), utils.random(0, height))
      );
      agent.set("x", agent => agent.get("p").x);
      agent.set("y", agent => agent.get("p").y);

      const angle = 2 * Math.random() * Math.PI;
      agent.set("v", new Vector(Math.cos(angle), Math.sin(angle)));

      agent.set("shape", "arrow");
      agent.set("size", 2.5);

      agent.set("vx", a => a.get("v").x);
      agent.set("vy", a => a.get("v").y);

      // eslint-disable-next-line no-use-before-define
      agent.addRule(this.tick);

      environment.addAgent(agent);
    }

    return environment;
  }

  static tick(agent, pt) {
    const { p } = agent.getData();
    const curPt = { x: p.x, y: p.y };
    const targetPt = { x: pt.x - curPt.x, y: pt.y - curPt.y };
    const newVec = new Vector(targetPt.x, targetPt.y);
    newVec.normalize();
    newVec.multiplyScalar(40);

    p.x += newVec.x;
    p.y += newVec.y;
  }
}

export default AgentManager;
