function calcPositions(player) {
  const rad = player.rot * Math.PI / 180;
  const sinTheta = Math.sin(rad), cosTheta = Math.cos(rad);

  const w = player.width / 2, h = player.height / 2;

  player.southEastCorner = [
    player.xMid + w * cosTheta - h * sinTheta,
    player.yMid + w * sinTheta + h * cosTheta
  ];

  player.southWestCorner = [
    player.xMid - w * cosTheta - h * sinTheta,
    player.yMid - w * sinTheta + h * cosTheta
  ];

  player.northEastCorner = [
    player.xMid + w * cosTheta + h * sinTheta,
    player.yMid + w * sinTheta - h * cosTheta
  ];

  player.northWestCorner = [
    player.xMid - w * cosTheta + h * sinTheta,
    player.yMid - w * sinTheta - h * cosTheta
  ];

  player.arrayX = [ player.northEastCorner[0], player.northWestCorner[0], player.southEastCorner[0], player.southWestCorner[0] ];
  player.arrayY = [ player.northEastCorner[1], player.northWestCorner[1], player.southEastCorner[1], player.southWestCorner[1] ];

  return player;
}

function carWallCollisionDetect() {
  const len = players.length;
  for (let i = 0; i < len; i++) {
    const player = calcPositions(players[i]);

    for (let j = 0; j < 4; j++) {
      while (player.arrayX[j] >= CANVAS_WIDTH) {
        player.xMid -= 2;
        calcPositions(player);
      }

      while (player.arrayX[j] <= 0) {
        player.xMid += 2;
        calcPositions(player);
      }

      while (player.arrayY[j] >= CANVAS_HEIGHT) {
        player.yMid -= 2;
        calcPositions(player);
      }

      while (player.arrayY[j] <= 0) {
        player.yMid += 2;
        calcPositions(player);
      }
    }
  }
}