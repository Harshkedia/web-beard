import AgentManager from "./Agents";

class DrawingFunctions {
  static drawLandmarks(ctx, detections, environment) {
    for (let i = 0; i < detections.length; i++) {
      // const { jawOutline } = detections[i].parts;
      // this.drawPart(ctx, this.getBeard(jawOutline));
      this.fillBeard(ctx, environment);
    }
  }

  static getBeard(feature) {
    const regular = feature.map(pt => {
      return { x: pt._x, y: pt._y };
    });
    const reversed = feature
      .map(pt => {
        return { x: pt._x, y: pt._y + 100 };
      })
      .reverse();

    reversed.shift();
    reversed.pop();
    return regular.concat(reversed);
  }

  static fillBeard(ctx, environment) {
    const xMin = 0;
    const xMax = 800;
    const yMin = 0;
    const yMax = 500;

    const totalPoints = 10;
    const points = [];
    while (points.length < totalPoints) {
      const x = this.changeDomain(
        Math.random(),
        { st: 0, end: 1 },
        { st: xMin, end: xMax }
      );
      const y = this.changeDomain(
        Math.random(),
        { st: 0, end: 1 },
        { st: yMin, end: yMax }
      );
      const pt = { x, y };
      if (ctx.isPointInPath(x, y)) {
        points.push(pt);
      }
    }

    this.tick(environment, points);
    ctx.fillStyle = "black";
    environment.getAgents().forEach(agent => {
      this.drawPoint(ctx, agent.get("x"), agent.get("y"));
    });
  }

  static drawPoint(ctx, x, y) {
    ctx.beginPath();
    ctx.ellipse(x, y, 1, 1, Math.PI / 4, 0, 2 * Math.PI);
    ctx.fill();
  }

  static drawPart(ctx, feature) {
    ctx.beginPath();
    for (let i = 0; i < feature.length; i++) {
      const { x } = feature[i];
      const { y } = feature[i];
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.stroke();
  }

  static setupEnvironment(numBoids, width, height) {
    return AgentManager.setup(numBoids, width, height);
  }

  static tick(environment, points) {
    const agents = environment.getAgents();
    agents.forEach((agent, index) => {
      const targetPt = points[index];
      AgentManager.tick(agent, targetPt);
    });
  }

  /**
   * Change the domain of an array of numbers
   * @param {Float} x
   * @param {st: Float, end: Float} oldDomain
   * @param {st: Float, end: Float} newDomain
   */
  static changeDomain(x, oldDomain, newDomain) {
    return (
      ((x - oldDomain.st) / (oldDomain.end - oldDomain.st)) *
        (newDomain.end - newDomain.st) +
      newDomain.st
    );
  }
}

export default DrawingFunctions;
