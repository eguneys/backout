import text from '../text';

import * as u from '../util';


export default function view(ctrl, g) {
  
  const { tileWidth, tileHeight, width, height } = ctrl.data.game;

  const b = g.buffers;


  this.render = ctrl => {
    ctrl = ctrl.play;

    ctrl.spots.each(_ => renderSpot(ctrl, _, g));

    renderBackground(ctrl, g);

    renderEdges(ctrl, g);

    ctrl.data.paddles.forEach(_ => renderPaddle(ctrl, _, g));
    ctrl.blocks.each(_ => renderBlock(_, g));
    renderHero(ctrl, g);


    renderUi(ctrl, g);
  };

  function renderSpot(ctrl, spot, g) {
    g.renderTarget = b.Buffer;

    const { x, y, radius, color } = spot.data;
    
    g.fillCircle(x, y, radius, color);
    g.fillCircle(x, y, radius * 0.6, color + 1);

  }

  function renderBackground(ctrl, g) {
    g.renderTarget = b.Background;

    let rx0 = 0,
        rx1 = width / tileWidth,
        ry0 = 0,
        ry1 = height / tileHeight;

    for (let i = rx0; i < rx1; i++) {
      for (let j = ry0; j < ry1; j++) {
        let x, y;

        x = i * tileWidth,
        y = j * tileHeight;

        let tc = g.pget(x, y, b.Buffer);

        g.fr(x, y, tileWidth, tileHeight, tc);
      }
    }
  }

  function renderEdges(ctrl, g) {
    const off = 41;
    const on = 38;

    const edge = ctrl.data.hero.edge,
          left = edge==='left'?on:off,
          right = edge==='right'?on:off,
          up = edge==='up'?on:off,
          down = edge==='down'?on:off;

    g.renderTarget = b.Midground;

    g.fr(0, 0, width, 1, up);
    g.fr(0, 0, 1, height, left);
    g.fr(0, height - 2, width, 1, down);
    g.fr(width - 2, 0, 1, height, right);
  }

  function renderPaddle(ctrl, paddle, g) {
    
    g.renderTarget = b.Collision;
    const { x, y, w, h, side } = paddle;

    const { vx, vy } = paddle;

    const off = 15,
          on = 12,
          color = (vx === 1 || vy === 1) ? on: off;

    let moveX = 0, moveY = 0;

    switch (side) {
    case 'left':
      moveX = h * 0.08;

      moveY = ((height / 2) - y) * 0.03;
      break;
    case 'right':
      moveX = -h * 0.08;

      moveY = ((height / 2) - y) * 0.03;
      break;
    case 'up':
      moveY = w * 0.08;

      moveX = ((width / 2) - x) * 0.01;
      break;
    case 'down':
      moveY = -w * 0.08;

      moveX = ((width / 2) - x) * 0.01;
      break;
    }

    g.fr(x + moveX, y + moveY, w, h, 16);

    g.renderTarget = b.Midground;

    g.fr(x + moveX, y + moveY, w, h, 16);
    g.fr(x, y, w, h, color);

  }

  function renderBlock(ctrl, g) {
    g.renderTarget = b.Collision;
    const { x, y, angle, length, color } = ctrl.data;
    let c = Math.cos(angle) * length,
        s = Math.sin(angle) * length;
    g.line(x, y, x + c, y + s, color);
  }

  function renderHero(ctrl, g) {
    g.renderTarget = b.Collision;
    const { vx, vy, x, y, radius, rotation, color, active, tick } = ctrl.data.hero;
    g.fillCircle(x, y, radius, color);

    g.renderTarget = b.Midground;

    const rC = Math.cos(rotation),
          rS = Math.sin(rotation);

    const alphas = [40, 5, 4, 3, 2];
    const highlight = alphas[Math.floor(active) % alphas.length];

    g.fillCircle(x - vx * 0.5, y - vy * 0.5, radius, 43);
    g.fillCircle(x, y, radius, highlight);
    g.fillCircle(x - rC, y - rS, radius * 0.5, 41);
  }

  function renderUi(ctrl, g) {
    const score = ctrl.data.game.score + '';

    g.renderTarget = b.Ui;
    
    const scoreLabel = text({
      x: width * 0.1,
      y: 10,
      text: 'score',
      color: 48,
      scale: 1
    }, g);

    text({
      x: scoreLabel.ex + 20,
      y: 10,
      text: score,
      color: 48,
      scale: 1
    }, g);    
  }
}