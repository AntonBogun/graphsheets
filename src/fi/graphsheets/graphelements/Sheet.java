package fi.graphsheets.graphelements;

public class Sheet {
	
	private Cell[][] cells;
	public Sheet(Cell[][] cells) {
		this.cells = cells;
	}
	
	public Sheet() {
		this.cells = new Cell[1][1];
	}
	
	public Cell[][] getCells() {
		return cells;
	}

}
