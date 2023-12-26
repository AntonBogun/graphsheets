package fi.graphsheets.graphelements;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class Sheet implements Iterable<Sheet.SheetEntry>{

	public static class SheetEntry {
		private int x;
		private int y;
		private Cell cell;
		
		public SheetEntry(int x, int y, Cell cell) {
			this.x = x;
			this.y = y;
			this.cell = cell;
		}
		
		
		public int x() {
			return x;
		}
		public int y() {
			return y;
		}
		public Cell cell() {
			return cell;
		}
		public void setCell(Cell cell) {
			this.cell = cell;
		}
	}
	
	private List<Cell> cells = new ArrayList<Cell>();
	private int width;
	private int height;
	public Sheet(List<Cell> cells, int width, int height) {
		this.cells = cells;
		this.width = width;
		this.height = height;
	}
	
	public Sheet() {
		this.width = 1;
		this.height = 1;
	}
	
	public Cell get(int i, int j) {
		return cells.get(i+width*j);
	}
	

	@Override
	public Iterator<SheetEntry> iterator() {
		return new Iterator<SheetEntry>() {
			private int curX = 0;
			private int curY = 0;
			
			@Override
			public boolean hasNext() {
				return curX + width*curY < cells.size();
			}

			@Override
			public SheetEntry next() {
				SheetEntry entry = new SheetEntry(curX, curY, get(curX, curY));
				curX++;
				if(curX > width - 1) {
					curX %= width;
					curY++;
				}
				return entry;
			}
			
		};
	};
	

}