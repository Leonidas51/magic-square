interface Tile {
  val: string
  el: HTMLElement
}

class Game {
  grid: Array<Tile>
  grid_el: HTMLElement
  moves: number = 0

  constructor() {
    this.grid = [];
    this.grid_el = document.getElementById("grid");
  }

  init(): void {
    for (let i = 1; i <= 15; i++) {
      let new_el = document.createElement("div");

      new_el.className = "tile";
      new_el.innerHTML = String(i);
      new_el.addEventListener("click", this.handleTileClick.bind(this));

      this.grid.push({
        val: String(i),
        el: new_el
      })
    }

    let blank_el = document.createElement("div");
    blank_el.className = "tile tile-blank";
    blank_el.innerHTML = "";

    this.grid.push({
      val: "",
      el: blank_el
    })

    //this.shuffle();
    this.drawGrid();
  }

  makeMove(tile_1, tile_2, by_player=true): void {
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