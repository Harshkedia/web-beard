import setup from "./Agents";
import insidePolygon from "./GeometryUtil";

class DrawingFunctions {
  static drawLandmarks(ctx, detections) {
    for (let i = 0; i < detections.length; i++) {
      const { jawOutline } = detections[i].parts;
      this.drawPart(ctx, this.getBeard(jawOutline));
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
    return regular.concat(reversed);
  }

  static drawPart(ctx, feature) {
    const xMin = 0;
    const xMax = 800;
    const yMin = 0;
    const yMax = 500;

    const totalPoints = 50;
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
      if (insidePolygon(pt, feature)) {
        points.push(pt);
        ctx.fillStyle = "rgba(0, 192, 222)";
        ctx.ellipse(x, y, 5, 5, Math.PI / 4, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
  }

  static setupEnvironment() {
    return setup();
  }

  static tick(environment) {
    environment.tick();
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
