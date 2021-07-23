const X_SIZE = 10;
const Y_SIZE = 20
const BLOCK_SIZE = 40;

function setup() {
    createCanvas(X_SIZE * BLOCK_SIZE, Y_SIZE * BLOCK_SIZE);
}

function draw() {
    background(255);
}

function Block(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.current = true;
}

function Shape(x, y, shape) {
    COLORS = { "O": "yellow", "I": "cyan", "T": "violet", "Z": "red", "S": "green", "L": "orange", "J": "blue" };
    OFFSETS = {
        "O": [[(0, 0), (1, 0), (0, 1), (1, 1)]],
        "I": [[(0, 0), (0, 1), (0, 2), (0, 3)],
        [(-1, 1), (0, 1), (1, 1), (2, 1)],
        [(1, 0), (1, 1), (1, 2), (1, 3)],
        [(-1, 2), (0, 2), (1, 2), (2, 2)]],
        "T": [[(0, 0), (-1, 1), (0, 1), (1, 1)],
        [(0, 0), (0, 1), (1, 1), (0, 2)],
        [(0, 2), (-1, 1), (0, 1), (1, 1)],
        [(0, 0), (0, 1), (-1, 1), (0, 2)]],
        "Z": [[(0, 0), (1, 0), (1, 1), (2, 1)],
        [(2, 0), (1, 1), (2, 1), (1, 2)],
        [(0, 1), (1, 1), (1, 2), (2, 2)],
        [(1, 0), (1, 1), (0, 1), (0, 2)]],
        "S": [[(1, 0), (2, 0), (1, 1), (0, 1)],
        [(1, 0), (1, 1), (2, 1), (2, 2)],
        [(1, 1), (2, 1), (1, 2), (0, 2)],
        [(0, 0), (0, 1), (1, 1), (1, 2)]],
        "L": [[(2, 0), (2, 1), (1, 1), (0, 1)],
        [(1, 0), (1, 1), (1, 2), (2, 2)],
        [(0, 1), (1, 1), (2, 1), (0, 2)],
        [(0, 0), (1, 0), (1, 1), (1, 2)]],
        "J": [[(0, 0), (0, 1), (1, 1), (2, 1)],
        [(1, 0), (2, 0), (1, 1), (1, 2)],
        [(0, 1), (1, 1), (2, 1), (2, 2)],
        [(1, 0), (1, 1), (1, 2), (0, 2)]]
    };

    this.x = x;
    this.y = y;
    this.rotation = 0;
    this.type = shape;
    this.color = COLORS[self.type];

    this.move_down = function () {
        this.y += 1;
    }

    this.move_left = function () {
        this.x -= 1;
    }

    this.move_right = function () {
        this.x += 1;
    }

    this.rotate = function () {
        this.rotation += 1;
        this.rotation %= length(this.OFFSETS[this.type]);
    }

    this.collide = function (grid, move_x, move_y) {
        collision = false;
        for (let i = 0, ; i < 4; i++) {
            x = this.x - 1 + this.OFFSETS[this.type][this.rotation][i][0] + move_x;
            y = this.y - 1 + this.OFFSETS[this.type][this.rotation][i][1] + move_y;
            if (x < 0) {
                collision = true;
            } else if (x >= X_SIZE) {
                collision = true;
            } else if (y == Y_SIZE + 4) {
                collision = true;
            } else if (grid[y, x] != null) {
                if (!(grid[y, x].current)) {
                    collision = true;
                }
            }
        }
        return collision;
    }
}