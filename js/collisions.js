Math.roundTo = (p, v) => Math.round(v * p) / p;
Math.ezRound = v => Math.roundTo(1e5, v);

function calcMags(players, ball, a, b) {
  const { x: bX, y: bY } = ball;

  const mags = [];
  const len = players.length;
  for (let i = 0; i < len; i++) {
    const player = players[i];
    const { arrayX: Ax, arrayY: Ay } = player;
  
    const v = [ Ax[a] - Ax[b], Ay[a] - Ay[b] ];
    const m = player.width;
  
    const ptv = [ bX - Ax[b], bY - Ay[b] ];
  
    const unitV = [ v[0] / m, v[1] / m ];
    const projM = math.dot(ptv, unitV);
  
    let dVx = bX, dVy = bY;
    if  (projM < 0)
      dVx -= Ax[a], dVy -= Ay[a];
    else if (projM > m)
      dVx -= Ax[b], dVy -= Ay[b];
    else {
      dVx -= Ax[b] + unitV[0] * projM;
      dVy -= Ay[b] + unitV[1] * projM;
    }
  
    mags.push(Math.hypot(dVx, dVy));
  }

  return mags;
}

function collide(players, ball, a, b, pVMagMult, bPush, angleAdd, bPMult, pVMult) {
  const mags = calcMags(players, ball, a, b);

  const { radius: bR } = ball;

  const len = players.length;
  for (let i = 0; i < len; i++) {
    const player = players[i];

    if (mags[i] < bR) { // hit
      $('.ball-hit').trigger('play');

      const { rot: pRot, vel: pV } = player;
      const { velX: bVx, velY: bVy } = ball;

      const turnAngle = pRot * Math.PI / 180;
      const bounceAngle = Math.atan(bVy / (bVx + pV));

      let vM = Math.hypot(bVy, bVx + pV * pVMagMult);
      if (bPush !== false && vM < pV)
        vM = pV + bPush;

      const angle = turnAngle + bounceAngle + angleAdd;

      const cos = Math.ezRound(Math.cos(angle));
      const sin = Math.ezRound(Math.sin(angle));

      ball.velX = -vM * cos;
      ball.velY = -vM * sin;

      ball.x += -vM * cos * bPMult;
      ball.y += -vM * sin * bPMult;

      player.vel *= pVMult;
    }
  }
}

const CarBallCollision = {
  front(players, ball) {
    collide(players, ball, 0, 1, 1.5, 2, Math.PI / 2, 2, 1);
  },
  right(players, ball) {
    collide(players, ball, 2, 0, 1, false, Math.PI, 1, 0.9);
  },
  left(players, ball) {
    collide(players, ball, 1, 3, 1, false, 0, 1, 0.9);
  },
  back(players, ball) {
    collide(players, ball, 2, 3, 1, 2, -Math.PI / 2, 2, 1);
  },
};

function isCornerInBall(x, y) {
  const { x: bX, y: bY, radius: bR } = ball;

  return (x - bX) ** 2 + (y - bY) ** 2 < bR ** 2;
}

function cornerCollide(players, ball, a, angleAdd) {
  const len = players.length;
  for (let i = 0; i < len; i++) {
    const player = players[i];
    if (isCornerInBall(player.arrayX[a], player.arrayY[a])) {
      $('.ball-hit').trigger('play');

      const { rot: pRot, vel: pV } = player;
      const { velX: bVx, velY: bVy } = ball;

      const turnAngle = pRot * Math.PI / 180;
      const bounceAngle = Math.atan(bVy / (bVx + pV));

      const vM = Math.hypot(bVy, bVx + pV * pVMagMult);

      const angle = turnAngle + bounceAngle + angleAdd;

      const cos = Math.ezRound(Math.cos(angle));
      const sin = Math.ezRound(Math.sin(angle));

      ball.velX = -vM * cos;
      ball.velY = -vM * sin;

      ball.x += -vM * cos;
      ball.y += -vM * sin;
    }
  }
}

const CornerBallCollision = {
  NE(players, ball) {
    cornerCollide(players, ball, 0, Math.PI * 3 / 4);
  },
  NW(players, ball) {
    cornerCollide(players, ball, 1, Math.PI / 4);
  },
  SE(players, ball) {
    cornerCollide(players, ball, 2, -Math.PI * 3 / 4);
  },
  SW(players, ball) {
    cornerCollide(players, ball, 3, -Math.PI / 4);
  },
};

function intersectPlayers(player1CornerArray, player2CornerArray) {

}


function ballWallCollisionDetect(bound) {
  if (ball.x + ball.radius >= CANVAS_WIDTH) {
  ////////////////////////////////////////////////////////////
  //  GOAL LOGIC AND RESPONSE -- BLUE GOAL (RIGHT)
  ////////////////////////////////////////////////////////////
    if (ball.y + ball.radius <= CANVAS_HEIGHT - bound && ball.y - ball.radius >= bound) {

      // GIVE POINT
      scoreOrange++;
      $('.orange').text(scoreOrange);
      // CUE CELEBRATION ANIMATION
      $('.goal-impact').trigger("play");
      $('.goal-horn').trigger("play");
      // RESET STATE
      resetGame();

    } else {
      while (ball.x + ball.radius >= CANVAS_WIDTH) {
        ball.x -= 2;
      }
      ball.velX = -ball.velX;
      ball.velX += .5;
    }
  }
  if (ball.x - ball.radius <= 0) {
  ////////////////////////////////////////////////////////////
  //  GOAL LOGIC AND RESPONSE -- ORANGE GOAL (LEFT)
  ////////////////////////////////////////////////////////////
    if (ball.y + ball.radius <= CANVAS_HEIGHT - bound && ball.y - ball.radius >= bound) {

      // GIVE POINT
      scoreBlue++;
      $('.blue').text(scoreBlue);
      // CUE CELEBRATION ANIMATION
      $('.goal-impact').trigger("play");
      $('.goal-horn').trigger("play");
      // RESET STATE
      resetGame();

    } else {

      while (ball.x - ball.radius <= 0) {
        ball.x += 2;
      }
      ball.velX = -ball.velX;
      ball.velX -= .5;
    }
  }
  if (ball.y + ball.radius >= CANVAS_HEIGHT) {
    while (ball.y + ball.radius >= CANVAS_HEIGHT) {
      ball.y -= 2;
    }
    ball.velY = -ball.velY;
    ball.velY += .5;
  }
  if (ball.y - ball.radius <= 0) {
    while (ball.y - ball.radius <= 0) {
      ball.y += 2;
    }
    ball.velY = -ball.velY;
    ball.velY -= .5;
  }
}

