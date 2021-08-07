const X_SIZE = 10;
const Y_SIZE = 20
const BLOCK_SIZE = 40;

/**
 * Wird vor Spielstart aufgerufen
 * @requires module:p5.js
 */
function setup() {
    createCanvas(X_SIZE * BLOCK_SIZE, Y_SIZE * BLOCK_SIZE);
}

/**
 * Wird auf jedem Frame aufgerufen
 * @requires module:p5.js
 */
function draw() {
    /**
     * Zeichnet das hintenliegende Gitter
     */
    function draw_grid() {
        for (var i = 0; i < X_SIZE; i++) {
            for (var j = 0; j < Y_SIZE; j++) {
                rect(i * BLOCK_SIZE, j * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        }
    }

    background(255);
    draw_grid();
}

/**
 * Prüft, ob ein Tetris vorliegt
 * @param {array} grid - das aktuelle Spielgitter
 * @param {number} y - zu prüfende Reihe
 * @return {boolean} true, wenn in der Reihe ein Tetris ist, sonst false
 */
function check_tetris(grid, y) {
    for (var i = 0; i < grid[y].length; i++) {
        if (grid[y][i] == null) {
            return false;
        }
    }
    return true;
}

/**
 * Löscht eine Reihe aus dem Spielgitter
 * @param {array} grid - das aktuelle Spielgitter
 * @param {number} y - zu löschende Reihe
 * @return {array} das aktualisierte Spielgitter
 */
function delete_line(grid, y) {
    for (var i = 0; i < y; i++) {
        grid[y - i] = grid[y - i - 1];
        for (var j = 0; j < grid[y - i].length; j++) {
            if (grid[y - i][j] != null) {
                grid[y - i][j].y = y - i;
            }
        }
    }
    for (var i = 0; i < grid[0].length; i++) {
        grid[0][i] = null;
    }
    return grid;
}

/**
 * Klasse stellt die einzelnen Blöcke bereit
 * @param {number} x - x-Position des Blocks
 * @param {number} y - y-Position des Blocks
 * @param {string} color - Farbe des Blocks
 */
function Block(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.current = true;

    /**
     * Zeichnet den Block auf das Spielcanvas
     */
    this.draw = function () {
        if (this.y >= 4) {
            fill(this.color);
            rect(this.x * BLOCK_SIZE + 1, (this.y - 4) * BLOCK_SIZE + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2);
        }
    }
}

/**
 * Klasse stellt die Tetrominos bereit
 * @param {number} x - x-Position des Tetrominos
 * @param {number} y - y-Position des Tetrominos
 * @param {string} shape - Form des Tetrominos (abgekürzt als "O", "I", "T", "Z", "S", "L", "J")
 */
function Shape(x, y, shape) {
    this.COLORS = { "O": "yellow", "I": "cyan", "T": "violet", "Z": "red", "S": "green", "L": "orange", "J": "blue" };
    this.OFFSETS = {
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
    this.color = this.COLORS[self.type];

    /**
     * Bewegt das Tetromino nach unten
     */
    this.move_down = function () {
        this.y += 1;
    }

    /**
     * Bewegt das Tetromino nach links
     */
    this.move_left = function () {
        this.x -= 1;
    }

    /**
     * Bewegt das Tetromino nach rechts
     */
    this.move_right = function () {
        this.x += 1;
    }

    /**
     * Rotiert das Tetromino
     */
    this.rotate = function () {
        this.rotation += 1;
        this.rotation %= length(this.OFFSETS[this.type]);
    }

    /**
     * Prüft, ob das Tetromino bei Bewegung mit dem Rand oder anderen Blöcken kollidiert
     * @param {array} grid - das aktuelle Spielgitter
     * @param {number} move_x - Bewegungsorientierung in x-Richtung
     * @param {number} move_y - Bewegungsorientierung in y-Richtung
     * @return {boolean} true, wenn der Block kollidiert, sonst false
     */
    this.collide = function (grid, move_x, move_y) {
        var collision = false;
        for (var i = 0; i < 4; i++) {
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

    /**
     * Prüft, ob das Tetromino bei Rotation mit dem Rand oder anderen Blöcken kollidiert
     * @param {array} grid - das aktuelle Spielgitter
     * @return {boolean} true, wenn der Block kollidiert, sonst false
     */
    this.rot_collide = function (grid) {
        var collision = false;
        for (var i = 0; i < 4; i++) {
            x = this.x - 1 + this.OFFSETS[this.type][(this.rotation + 1) % length(this.OFFSETS[this.type])][i][0];
            y = this.y - 1 + this.OFFSETS[this.type][(this.rotation + 1) % length(this.OFFSETS[this.type])][i][1];
            if (x < 0) {
                collision = true;
            } else if (x >= X_SIZE) {
                collision = true;
            } else if (y == Y_SIZE + 4) {
                collision = true;
            } else if (grid[y][x] != null) {
                if (!(grid[y][x].current)) {
                    collision = true;
                }
            }
        }
        return collision;
    }

    /**
    * Erstellt das Tetromino aus Blöcken
    * @param {array} grid - das aktuelle Spielgitter
    * @return {array} - das aktualisierte Spielgitter
    */
    this.make = function (grid) {
        for (var i = 0; i < 4; i++) {
            x = this.x - 1 + this.OFFSETS[this.type][this.rotation][i][0];
            y = this.y - 1 + this.OFFSETS[this.type][this.rotation][i][1];
            grid[y][x] = Block(x, y, this.color);
        }
        return grid;
    }

    /**
     * Löscht das Tetromino aus dem Spielgitter
     * @param {array} grid - das aktuelle Spielgitter
     * @return {array} das aktualisierte Spielgitter
     */
    this.destroy = function (grid) {
        for (var i = 0; i < 4; i++) {
            x = this.x - 1 + this.OFFSETS[this.type][this.rotation][i][0];
            y = this.y - 1 + this.OFFSETS[this.type][this.rotation][i][1];
            grid[y][x] = null;
        }
        return grid;
    }
}