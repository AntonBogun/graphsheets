package fi.graphsheets.graphelements;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class Sheet implements Iterable<Sheet.SheetEntry>{

	public static class SheetEntry {
		private int x;
		private int y;
		private int displayX;
		private int displayY;
		private int width;
		private int height;
		private Cell cell;
		
		public SheetEntry(int x, int y, Cell cell) {
			this.x = x;
			this.y = y;
			this.width = 100;
			this.height = 100;
			this.cell = cell;
		}
		
		public SheetEntry(int x, int y, int width, int height, Cell cell) {
			this.x = x;
			this.y = y;
			this.width = width;
			this.height = height;
			this.cell = cell;
		}
		
		
		public int x() {
			return x;
		}
		
		public void setX(int x) {
			this.x = x;
		}
		
		public int y() {
			return y;
		}
		
		public void setY(int y) {
			this.y = y;
		}
		
		public int displayX() {
			return displayX;
		}
		
		public void setDisplayX(int displayX) {
			this.displayX = displayX;
		}
		
		public int displayY() {
			return displayY;
		}
		
		public void setDisplayY(int displayY) {
			this.displayY = displayY;
		}

		public int width() {
			return width;
		}

		public void setWidth(int width) {
			this.width = width;
		}
		
		public int height() {
			return height;
		}
		
		public void setHeight(int height) {
			this.height = height;
		}
		
		public Cell cell() {
			return cell;
		}
		public void setCell(Cell cell) {
			this.cell = cell;
		}
	}
	
	private List<SheetEntry> entries = new ArrayList<SheetEntry>();
	private int width;
	private int height;
	private ArrayList<Integer> layoutWidths;
	private ArrayList<Integer> layoutHeights;
	public <T> Sheet(List<T> list, int width, int height) {
		if(list.stream().allMatch(SheetEntry.class::isInstance)) {
			this.entries = (List<SheetEntry>) list;
		} else if (list.stream().allMatch(SheetEntry.class::isInstance)) {
			this.entries = list.stream().map((cell) -> new SheetEntry())
		}
		this.width = width;
		this.height = height;
		layoutWidths = new ArrayList<Integer>();
		layoutHeights = new ArrayList<Integer>();
	}
	
	
	public Sheet() {
		this.width = 1;
		this.height = 1;
		layoutWidths = new ArrayList<Integer>();
		layoutHeights = new ArrayList<Integer>();
		
	}
	
	public void calculateCellsDimensions() {
		layoutWidths.clear();
		layoutHeights.clear();
		for (int i = 0; i < width; i++) {
			int maxWidth = 0;
			for (int j = 0; j < height; j++) {
				int width = get(i, j).width;
				if (width > maxWidth) {
					maxWidth = width;
				}
			}
			layoutWidths.add(maxWidth);
		}
		
		for (int i = 0; i < height; i++) {
			int maxHeight = 0;
			for (int j = 0; j < width; j++) {
				int height = get(j, i).height;
				if (height > maxHeight) {
					maxHeight = height;
				}
			}
			layoutHeights.add(maxHeight);
		}
	}
	
	public void updateCellsLayout() {
		calculateCellsDimensions();
		for (int i = 0; i < width; i++) {
			int x = 0;
			for (int j = 0; j < height; j++) {
				get(i, j).setDisplayX(x);
				get(i, j).setWidth(layoutWidths.get(i));
				x += layoutWidths.get(i);
			}
		}
		for (int i = 0; i < height; i++) {
			int y = 0;
			for (int j = 0; j < width; j++) {
				get(j, i).setDisplayY(y);
				get(i, j).setHeight(layoutHeights.get(i));
				y += layoutHeights.get(i);
			}
		}
	}
	
	public SheetEntry get(int i, int j) {
		return entries.get(i+width*j);
	}
	
	public Iterator<SheetEntry> iterator(){
		return entries.iterator();
    
	}
	
//	@Override
//	public Iterator<SheetEntry> iterator() {
//		return new Iterator<SheetEntry>() {
//			private int curX = 0;
//			private int curY = 0;
//			
//			@Override
//			public boolean hasNext() {
//				return curX + width*curY < cells.size();
//			}
//
//			@Override
//			public SheetEntry next() {
//				SheetEntry entry = new SheetEntry(curX, curY, get(curX, curY));
//				curX++;
//				if(curX > width - 1) {
//					curX %= width;
//					curY++;
//				}
//				return entry;
//			}
//			
//		};
//	};
	

}
