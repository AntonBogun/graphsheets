package fi.graphsheets.graphelements;

import java.awt.Rectangle;

public class Node {
	
	private int x;
    private int y;
    private int width = 1;
    private int height = 1;
    private Cell data;
    private Rectangle bounds;
    private int id;
	public Node(int x, int y, int width, int height, Cell data) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.data = data;
		this.bounds = new Rectangle(x, y, width, height);
	}
    
    public void setCell(Cell cell) {
    	this.data = cell;
    }


	public int getX() {
		return x;
	}
	
	public int getY() {
		return y;
	}


	public Cell getCell() {
		return data;
	}


	public void setX(int i) {
		this.bounds.x = i;
		x = i;
		
	}
	
	public void setY(int j) {
		this.bounds.y = j;
		y = j;

	}


	public int getWidth() {
		return width;
	}
	
	public int getHeight() {
		return height;
	}

	public int getID() {
		return id;
	}
	
}
