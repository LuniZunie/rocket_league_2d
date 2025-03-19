class Timer {
    static format(time) { // to mm:ss
        const s = time / 1e+3 | 0;
        const m = time / 60e+3 | 0;

        return `${m.toFixed(2)}:${s.toFixed(2)}`;
    }

    init = 0; // in ms
    time = 0; // in ms
    constructor(time) {
        this.init = time;
        this.time = time;
    }

    update(Δtime) { // time since last frame
        const prevTime = this.time;
        const time = Math.max(0, prevTime - Δtime);

        $('.count-down').text(Timer.format(this.time = time));
        if (time <= 30e+3 && prevTime > 30e+3)
            $('.two-minute-warning').trigger('play');
        else if (time <= 10e+3 && time > 0 && ((time / 1e+3 | 0) < (prevTime / 1e+3 | 0))) { // every second < 10
            $('.timer-running-out').trigger('pause');
            $('.timer-running-out').prop('currentTime', 0);
            $('.timer-running-out').trigger('play');
        } else if (time === 0) {
            $('.game-over').trigger('play');
            return false; // end game
        }

        return true;
    }

    reset() {
        this.time = this.init;
    }
}

class Game {
    static {
        this.LENGTH = 120e+3;
    }

    timer = new Timer(Game.LENGTH);
}

class Ball {
    static {
        this.RADIUS = 30;
    }

    x = 0;
    y = 0;

    vx = 0;
    vy = 0;

    constructor(x, y) {
        this.reset(x, y);
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
    }

    reset(x, y) {
        this.x = x, this.y = y;
        this.vx = 0, this.vy = 0;
    }

    draw(canvas) {
        const r = Ball.RADIUS;
        canvas.drawImage(ballDrawing, this.x - r, this.y - r, r * 2, r * 2);
    }
}

class Team {
    score = 0;
    players = [];
}

class OrangeTeam extends Team {
    static ID = 0x0;
    static name = 'orange';

    id = OrangeTeam.ID;
    name = OrangeTeam.name;
}

class BlueTeam extends Team {
    static ID = 0x1;
    static name = 'blue';

    id = BlueTeam.ID;
    name = BlueTeam.name;
}