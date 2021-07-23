const BLOCK_SIZE = 20;
const SIZE = 600;

/** 
* Wird vor Spielstart aufgerufen
* @requires module:p5.js
*/
function setup() {
    createCanvas(SIZE, SIZE);
    snake = new Snake();
    apple_loc = createVector(Math.floor(Math.random() * (SIZE / BLOCK_SIZE)) * BLOCK_SIZE,
        Math.floor(Math.random() * (SIZE / BLOCK_SIZE)) * BLOCK_SIZE);
    apple = new Apple(apple_loc.x, apple_loc.y);
    frameRate(10);
}

/**
 * Wird auf jedem Frame aufgerufen
 * @requires module:p5.js
 */
function draw() {
    background(51);
    snake.death();
    snake.update();
    snake.show();

    if (snake.eat(apple_loc)) {
        // neuen Apfel an zufälliger Stelle spawnen
        apple_loc = createVector(Math.floor(Math.random() * (SIZE / BLOCK_SIZE)) * BLOCK_SIZE,
            Math.floor(Math.random() * (SIZE / BLOCK_SIZE)) * BLOCK_SIZE);
        apple = new Apple(apple_loc.x, apple_loc.y);
    }

    apple.show();
}

/**
 * Nimmt Tasten-Drücke auf und ändert die Bewegungsrichtung der Schlange
 */
function keyPressed() {
    if (keyCode === UP_ARROW && snake.y_vel != 1) {
        snake.dir(0, -1);
    } else if (keyCode === DOWN_ARROW && snake.y_vel != -1) {
        snake.dir(0, 1);
    } else if (keyCode === LEFT_ARROW && snake.x_vel != 1) {
        snake.dir(-1, 0);
    } else if (keyCode === RIGHT_ARROW && snake.x_vel != -1) {
        snake.dir(1, 0);
    }
}

/**
 * Klasse stellt Schlange bereit
*/
function Snake() {
    this.x = 0;
    this.y = 0;
    this.x_vel = 1;
    this.y_vel = 0;
    this.length = 0;
    this.tail = [];

    /**
     * Bewegt den Schlangenkopf in die aktuelle Bewegungsrichtung, aktualisiert den Schwanz
     */
    this.update = function () {
        for (var i = 0; i < this.tail.length - 1; i++) {
            this.tail[i] = this.tail[i + 1];
        }
        this.tail[this.length - 1] = createVector(this.x, this.y);

        this.x = (this.x + this.x_vel * BLOCK_SIZE) % SIZE;
        if (this.x < 0) {
            this.x = this.x + SIZE;
        }
        this.y = (this.y + this.y_vel * BLOCK_SIZE) % SIZE;
        if (this.y < 0) {
            this.y = this.y + SIZE;
        }
    }

    /**
     * Zeichnet die Schlange
     */
    this.show = function () {
        fill(color("white"));
        for (var i = 0; i < this.length; i++) {
            rect(this.tail[i].x, this.tail[i].y, BLOCK_SIZE, BLOCK_SIZE);
        }
        rect(this.x, this.y, BLOCK_SIZE, BLOCK_SIZE);
    }

    /**
     * Aktualisiert die Bewegungsrichtung der Schlange
     * @param {number} x - Orientierung in x-Richtung (-1, 0, 1) 
     * @param {number} y - Orientierung in y-Richtung (-1, 0, 1) 
     */
    this.dir = function (x, y) {
        this.x_vel = x;
        this.y_vel = y;
    }

    /** 
    * Bestimmt, ob die Schlange an der Position pos ist
    * @param {vector} pos - Position des Apfels
    * @return {boolean} true, wenn Schlange an Position des Apfels, sonst false
    */
    this.eat = function (pos) {
        var d = dist(this.x, this.y, pos.x, pos.y);
        if (d < 1) {
            this.length++;
            return true;
        } else {
            return false;
        }
    }

    /**
     * Setzt die Länge der Schlange auf 1 zurück, wenn die Schlange mit sich selbst kollidiert
     */
    this.death = function () {
        for (var i = 0; i < this.tail.length; i++) {
            var pos = this.tail[i]
            var d = dist(this.x, this.y, pos.x, pos.y);
            if (d < 1) {
                this.length = 0;
                this.tail = [];

            }
        }
    }
}
/** 
* Klasse stellt den Apfel bereit
* @param {number} x - x-Position des Apfels
* @param {number} y - y-Position des Apfels
*/
function Apple(x, y) {
    this.x = x;
    this.y = y;

    /**
     * Zeichnet den Apfel
     */
    this.show = function () {
        fill(color("red"));
        rect(this.x, this.y, BLOCK_SIZE, BLOCK_SIZE);
    }
}