interface Tile {
  val: string
  el: HTMLElement
}

class Game {
  grid: Array<Tile>
  grid_el: HTMLElement
  controls: HTMLElement
  moves: number = 0
  moves_disabled: boolean = false

  constructor() {
    this.grid = [];
    this.grid_el = document.getElementById("grid");
    this.controls = document.getElementById("controls");
  }

  init(): void {
    this.initGrid();

    const restart_btn = document.createElement("button");
    restart_btn.id = "restart";
    restart_btn.innerHTML = "Перемешать";
    restart_btn.addEventListener("click", this.restart.bind(this));

    this.controls.appendChild(restart_btn);
  }

  initGrid(): void {
    this.moves_disabled = false;

    for (let i = 1; i <= 15; i++) {
      const new_el = document.createElement("div");

      new_el.className = "tile";
      new_el.innerHTML = String(i);
      new_el.addEventListener("click", this.handleTileClick.bind(this));

      this.grid.push({
        val: String(i),
        el: new_el
      })
    }

    const blank_el = document.createElement("div");
    blank_el.className = "tile tile-blank";
    blank_el.innerHTML = "";

    this.grid.push({
      val: "",
      el: blank_el
    })
    
    this.shuffle();
    this.drawGrid();
  }

  makeMove(tile_1, tile_2, by_player=true): void {
    if (this.moves_disabled) {
      return;
    }

    [this.grid[tile_1], this.grid[tile_2]] = [this.grid[tile_2], this.grid[tile_1]];
    if (by_player) {
      this.moves++;
      this.drawGrid();
      if (this.checkVictory()) {
        this.win();
      }
    }
  }

  drawGrid(): void {
    this.grid_el.innerHTML = "";

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        let tile = this.grid[(i * 4) + j]
        
        tile.el.style.top = String(i * 130) + "px";
        tile.el.style.left = String(j * 130) + "px";
        this.grid_el.appendChild(tile.el)
      }
    }
  }

  checkVictory(): boolean {
    for (let i = 0; i < this.grid.length; i++) {
      if (i === 15 && this.grid[i].val === "") {
        continue;
      } else {
        if (Number(this.grid[i].val) !== i + 1) {
          return false;
        }
      }
    }

    return true;
  }

  win(): void {
    const header = document.createElement("h2"),
          moves = document.createElement("span"),
          container = document.createElement("div");

    header.id = "victory-head";
    header.innerHTML = "Победа!";

    moves.className = "victory-text";
    moves.innerHTML = "Ходов сделано: " + this.moves;

    container.id = "victory-container";
    container.appendChild(header);
    container.appendChild(moves);

    this.moves_disabled = true;
    this.controls.insertBefore(container, this.controls.firstChild);
  }

  restart(): void {
    document.getElementById("victory-container").remove();

    this.grid = [];
    this.moves = 0;
    this.initGrid();
  }

  handleTileClick(e: Event): void {
    const el = <HTMLElement> e.target,
          tile_i = this.getByValue(el.innerHTML),
          neighbours = this.getNeighbours(tile_i);
    
    let blank_neighbor_i;

    if (this.isTileMovable(neighbours)) {
      this.makeMove(tile_i, this.getEmpty());
    }
  }

  isTileMovable(neighbours: Array<Tile>): boolean {
    for (let j=0; j<neighbours.length; j++) {
      if (!neighbours[j].val) {
        return true;
      }
    }

    return false;
  }

  getByValue(val): number {
    return this.grid.findIndex(tile => {
      return tile.val === val;
    })
  }

  getEmpty(): number {
    return this.grid.findIndex(tile => {
      return tile.val === "";
    });
  }

  getNeighbours(i: number): Array<Tile> {
    const result = [];

    if (i <= 11) { // bottom
      result.push(this.grid[i + 4]);
    }

    if ((i + 1) % 4 !== 0) { // right
      result.push(this.grid[i + 1]);
    }

    if (i >= 4) { // top
      result.push(this.grid[i - 4]);
    }

    if (i % 4 !== 0) { // left
      result.push(this.grid[i - 1]);
    }


    return result;
  }

  shuffle(): void {
    let empty_i;

    for (let i = 0; i <= 1000; i++) {
      this.makeShuffleMove();
    }

    empty_i = this.getEmpty();

    while ((empty_i + 1) % 4 !== 0) {
      this.makeMove(empty_i, empty_i + 1, false);
      empty_i = empty_i + 1;
    }

    while (empty_i <= 11) {
      this.makeMove(empty_i, empty_i + 4, false);
      empty_i = empty_i + 4;
    }
  }

  makeShuffleMove(): void {
    const empty_i = this.getEmpty(),
          moves = this.getNeighbours(empty_i);

    let random = Math.floor(Math.random() * moves.length);

    this.makeMove(empty_i, this.getByValue(moves[random].val), false);
  }
}

const game = new Game();
game.init();