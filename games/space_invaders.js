const WIDTH = 800;
const HEIGHT = 600;
const PLAYER_WIDTH = 34;
const PLAYER_HEIGHT = 40;
const PLAYER_SPEED = 5;
const BULLET_SPEED = 5;
const BULLET_DIAMETER = 4;
const ENEMY_WIDTH = 11;
const ENEMY_HEIGHT = 10;
const ENEMY_ROWS = 5;
const Y_OFFSET = 40;
const ENEMY_SPEED = 5;
const ENEMY_FPS = 50;
const COOLDOWN = 20;
var player;
var bullet_list = [];
var enemy_list = [];
var points;
var enemy_move_counter;
var shot_counter;
let enemy_img;
let ship_img;

function preload() {
    enemy_img = loadImage('games/assets/SI_enemy_green.png');
    ship_img = loadImage('games/assets/SI_ship.png');
}

function setup() {
    createCanvas(WIDTH, HEIGHT);
    player = new Player();
    for (var i = 0; i < WIDTH / (2 * ENEMY_WIDTH) - 4; i++) {
        for (var j = 0; j < ENEMY_ROWS; j++) {
            enemy = new Enemy(ENEMY_WIDTH / 2 + 2 * i * ENEMY_WIDTH, ENEMY_HEIGHT / 2 + 2 * j * ENEMY_HEIGHT);
            enemy_list.push(enemy);
        }
    }
    points = 0;
    enemy_move_counter = 0;
    shot_counter = COOLDOWN;
}

function draw() {
    enemy_move_counter += 1;
    background(0);

    if (keyIsDown(LEFT_ARROW) && player.x > 0) {
        player.move(-1);
    } else if (keyIsDown(RIGHT_ARROW) && player.x < WIDTH - PLAYER_WIDTH) {
        player.move(1);
    }

    player.show();
    shot_counter += 1;

    for (var i in enemy_list) {
        if (enemy_move_counter % (15 * ENEMY_FPS) == 1) {
            enemy_list[i].move_down();
        }
        else if (enemy_move_counter % ENEMY_FPS == 0) {
            enemy_list[i].move();
        }
        if (enemy_move_counter % (15 * ENEMY_FPS) == 0) {
            enemy_list[i].dir *= -1;
        }
        enemy_list[i].show();
    }

    for (var i in bullet_list) {
        bullet_list[i].move();
        bullet_list[i].show();
    }

    for (var i in bullet_list) {
        if (bullet_list[i].y < 0) {
            bullet_list.splice(i, 1);
        }
    }

    for (var i in bullet_list) {
        inner_loop:
        for (var j in enemy_list) {
            if (bullet_list[i].hit(enemy_list[j])) {
                points += 1;
                bullet_list.splice(i, 1);
                enemy_list.splice(j, 1);
                break inner_loop;
            }
        }
    }

    textFont('Helvetica', 30);
    text(String(points), 10, 30);
}

function keyPressed() {
    if (keyCode === 32 && shot_counter >= COOLDOWN) {
        player.shoot();
        shot_counter = 0;
    }
}

function Player() {
    this.x = Math.floor((WIDTH - PLAYER_WIDTH) / 2);
    this.y = HEIGHT - PLAYER_HEIGHT - 10;

    this.show = function () {
        image(ship_img, this.x, this.y, PLAYER_WIDTH, PLAYER_HEIGHT);
    }

    this.shoot = function () {
        bullet = new Bullet(this.x + Math.floor(PLAYER_WIDTH / 2), this.y);
        bullet_list.push(bullet);
    }

    this.move = function (dir) {
        player.x += dir * PLAYER_SPEED;
    }
}

function Bullet(x, y) {
    this.x = x;
    this.y = y;

    this.show = function () {
        fill(255);
        circle(this.x, this.y, BULLET_DIAMETER);
    }

    this.move = function () {
        this.y -= BULLET_SPEED;
    }

    this.hit = function (enemy) {
        if (this.x + Math.floor(BULLET_DIAMETER / 2) >= enemy.x && this.x - Math.floor(BULLET_DIAMETER / 2) <= enemy.x + ENEMY_WIDTH) {
            if (this.y - Math.floor(BULLET_DIAMETER / 2) <= enemy.y + ENEMY_HEIGHT && this.y + Math.floor(BULLET_DIAMETER / 2) >= enemy.y) {
                return true;
            }
        }
        return false;
    }
}

function Enemy(x, y) {
    this.x = x;
    this.y = y + Y_OFFSET;
    this.dir = 1;

    this.show = function () {
        image(enemy_img, this.x, this.y);
    }

    this.move = function () {
        this.x += this.dir * ENEMY_SPEED;
    }

    this.move_down = function () {
        this.y += ENEMY_HEIGHT;
    }
}