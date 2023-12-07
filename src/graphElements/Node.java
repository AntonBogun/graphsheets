package graphElements;

public class Node {
	
	private int x;
    private int y;
    private String name;
    private int id;
	public Node(int x, int y, String name) {
		this.x = x;
		this.y = y;
		this.name = name;
	}
	

    public Node() {
		this.x = 0;
		this.y = 0;
		this.name = "dummy";
    }
    
    public void setName(String name) {
    	this.name = name;
    }


	public int getX() {
		return this.x;
	}
	
	public int getY() {
		return this.y;
	}


	public String getName() {
		return this.name;
	}


	public void setX(int i) {
		this.x = i;
		
	}
	
	public void setY(int j) {
		this.y = j;

	}
}
