package fi.graphsheets.graphelements;

import java.awt.Rectangle;
import java.io.Serializable;

public class Node implements Serializable{
	
	private static final long serialVersionUID = -8883714416725612204L;
	private int x;
    private int y;
    private int width = 1;
    private int height = 1;
    private Cell data;
    private Rectangle bounds;
    private int id;
	public Node(int x, int y, int width, int height, int id, Cell data) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.id = id;
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
	
	public static double getDistance(Node node1, Node node2) {
		return Math.sqrt(Math.pow(node1.getX() - node2.getX(), 2) + Math.pow(node1.getY() - node2.getY(), 2));
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

	public void setWidth(int width) {
		this.width = width;
		
	}

	public void setHeight(int height) {
		this.height = height;
		
	}
	
}
