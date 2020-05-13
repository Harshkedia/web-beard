function isBetween(a, b, c) {
  const crossproduct = (c.y - a.y) * (b.x - a.x) - (c.x - a.x) * (b.y - a.y);

  if (Math.abs(crossproduct) > 0.01) {
    return false;
  }
  const dotproduct = (c.x - a.x) * (b.x - a.x) + (c.y - a.y) * (b.y - a.y);

  if (dotproduct < 0) {
    return false;
  }
  const squaredlengthba = (b.x - a.x) * (b.x - a.x) + (b.y - a.y) * (b.y - a.y);

  if (dotproduct > squaredlengthba) {
    return false;
  }

  return true;
}

function intersects(A, B, C, D) {
  const a1 = B.y - A.y;
  const b1 = A.x - B.y;
  const c1 = a1 * A.x + b1 * A.y;

  const a2 = D.y - C.y;
  const b2 = C.x - D.x;
  const c2 = a2 * C.x + b2 * C.y;

  const determinant = a1 * b2 - a2 * b1;

  if (determinant === 0) {
    return false;
  }
  const x = (b2 * c1 - b1 * c2) / determinant;
  const y = (a1 * c2 - a2 * c1) / determinant;

  if (isBetween(C, D, { x, y }) && isBetween(A, B, { x, y })) {
    return true;
  }
  return false;
}

export default function insidePolygon(point, polygon) {
  const lineExt = [point, { x: 10000, y: point.y }];
  let numInts = 0;
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < polygon.length - 2; i++) {
    const curLine = [polygon[i], polygon[i + 1]];
    if (intersects(lineExt[0], lineExt[1], curLine[0], curLine[1])) {
      // eslint-disable-next-line no-plusplus
      numInts++;
    }
  }
  if (Math.floor(numInts % 2) !== 0) {
    return true;
  }
  return false;
}
