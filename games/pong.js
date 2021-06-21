const WIDTH = 600;
const HEIGHT = 400;
const PADDLE_HEIGHT = 100;
const PADDLE_WIDTH = 20;
const RADIUS = 20;
const BALL_SPEED = 5;
var x_ball = Math.floor(WIDTH / 2);
var y_ball = Math.floor(HEIGHT / 2);
var x_speed_ball = 5;
var y_speed_ball = 0;
var paddle_speed = 5;
var left_paddle;
var right_paddle;
var left_score = 0;
var right_score = 0;

function setup() {
    createCanvas(WIDTH, HEIGHT);
    left_paddle = new Paddle(10, (HEIGHT - PADDLE_HEIGHT) / 2);
    right_paddle = new Paddle(WIDTH - 10 - PADDLE_WIDTH, (HEIGHT - PADDLE_HEIGHT) / 2);
}

function draw() {
    background(0);

    fill(255);
    noStroke();
    ellipse(x_ball, y_ball, RADIUS, RADIUS);

    x_ball += x_speed_ball;
    y_ball += y_speed_ball;

    // Ball nicht getroffen
    if (x_ball < RADIUS / 2) {
        x_ball = Math.floor(WIDTH / 2);
        y_ball = Math.floor(HEIGHT / 2);
        x_speed_ball = 5;
        y_speed_ball = 0;
        right_score += 1
    } else if (x_ball > WIDTH - (RADIUS / 2)) {
        x_ball = Math.floor(WIDTH / 2);
        y_ball = Math.floor(HEIGHT / 2);
        x_speed_ball = -5;
        y_speed_ball = 0;
        left_score += 1
    }
    // Ball oben oder unten
    if (y_ball < RADIUS / 2 || y_ball > HEIGHT - (RADIUS / 2)) {
        y_speed_ball *= -1;
    }

    // Kollision Ball u. Paddle
    if (x_speed_ball < 0 && x_ball <= left_paddle.x + PADDLE_WIDTH && y_ball >= left_paddle.y && y_ball <= left_paddle.y + PADDLE_HEIGHT) {
        bounce_angle = angle(left_paddle.y, y_ball);
        x_speed_ball = cos(bounce_angle) * BALL_SPEED;
        y_speed_ball = -1 * sin(bounce_angle) * BALL_SPEED;
    } else if (x_speed_ball > 0 && x_ball >= right_paddle.x && y_ball >= right_paddle.y && y_ball <= right_paddle.y + PADDLE_HEIGHT) {
        bounce_angle = angle(right_paddle.y, y_ball);
        x_speed_ball = -1 * cos(bounce_angle) * BALL_SPEED;
        y_speed_ball = -1 * sin(bounce_angle) * BALL_SPEED;
    }

    // Paddle-Steuerung
    if (keyIsDown(UP_ARROW) && right_paddle.y > 0) {
        right_paddle.move(-1);
    } else if (keyIsDown(DOWN_ARROW) && right_paddle.y < HEIGHT - PADDLE_HEIGHT) {
        right_paddle.move(1);
    }
    if (keyIsDown(87) && left_paddle.y > 0) { // W-Taste
        left_paddle.move(-1);
    } else if (keyIsDown(83) && left_paddle.y < HEIGHT - PADDLE_HEIGHT) { // S-Taste
        left_paddle.move(1);
    }

    left_paddle.show();
    right_paddle.show();
    textFont('Helvetica', 30);
    text(String(left_score), Math.floor(WIDTH / 4), 40);
    text(String(right_score), Math.floor(WIDTH / 4) * 3, 40);
}

function Paddle(x, y) {
    this.x = x;
    this.y = y;

    this.show = function () {
        fill(255);
        rect(this.x, this.y, PADDLE_WIDTH, PADDLE_HEIGHT);
    }

    this.move = function (y) {
        this.y += y * paddle_speed;
    }
}

// Berechne Rückschlagwinkel des Balls
function angle(paddle_y, ball_y) {
    const MAX_ANGLE = PI / 2;
    var relative_y = paddle_y + PADDLE_HEIGHT / 2 - ball_y;
    var normalized_y = relative_y / PADDLE_HEIGHT;
    var angle = normalized_y * MAX_ANGLE;
    return angle;
}