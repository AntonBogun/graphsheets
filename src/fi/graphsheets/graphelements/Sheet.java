package fi.graphsheets.graphelements;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;
import java.util.stream.Collectors;

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
	public boolean sheetChanged;
	@SuppressWarnings("unchecked")
	public <T> Sheet(List<T> list, int width, int height) {
		if(list == null) {
			for (int i = 0; i < width * height; i++) {
				entries.add(new SheetEntry(i % width, i / width, new Cell.Atomic.TextCell("")));
			}
		} else if(list.stream().allMatch(SheetEntry.class::isInstance)) {
			this.entries = (List<SheetEntry>) list;
		} else if (list.stream().allMatch(SheetEntry.class::isInstance)) {
			for (int i = 0; i < list.size(); i++) {
				entries.add(new SheetEntry(i % width, i / width, (Cell) list.get(i)));
			}
		}
		this.width = width;
		this.height = height;
		layoutWidths = new ArrayList<Integer>();
		layoutHeights = new ArrayList<Integer>();
		for (int i = 0; i < width; i++) {
			layoutWidths.add(100);
		}
		for (int i = 0; i < height; i++) {
			layoutHeights.add(100);
		}
	}
	
	
	public Sheet() {
		this.width = 1;
		this.height = 1;
		layoutWidths = new ArrayList<Integer>();
		layoutHeights = new ArrayList<Integer>();
		layoutWidths.add(100);
		layoutHeights.add(100);
	}
	
	public int totalWidth() {
		return layoutWidths.stream().reduce(0, Integer::sum);
	}
	
	public int totalHeight() {
		return layoutHeights.stream().reduce(0, Integer::sum);
	}
	
	public void calculateCellsDimensions() {
		ArrayList<Integer> layoutWidths1 = new ArrayList<Integer>();
		ArrayList<Integer> layoutHeights1 = new ArrayList<Integer>();
		for (int i = 0; i < width; i++) {
			int maxWidth = 0;
			for (int j = 0; j < height; j++) {
				int width = get(i, j).width;
				if (width > maxWidth) {
					maxWidth = width;
				}
			}
			layoutWidths1.add(maxWidth);
		}
		
		for (int i = 0; i < height; i++) {
			int maxHeight = 0;
			for (int j = 0; j < width; j++) {
				int height = get(j, i).height;
				if (height > maxHeight) {
					maxHeight = height;
				}
			}
			layoutHeights1.add(maxHeight);
		}
		sheetChanged = !layoutWidths.equals(layoutWidths1) || !layoutHeights.equals(layoutHeights1);
		layoutWidths = layoutWidths1;
		layoutHeights = layoutHeights1;
	}
	
	@SuppressWarnings("unchecked")
	public void updateCellsLayout() {
		calculateCellsDimensions();
		ArrayList<Integer> layoutWidths1 = new ArrayList<Integer>();
		layoutWidths1.add(0);
		layoutWidths1.addAll(layoutWidths);
		int[] layourWidths1arr = layoutWidths1.stream().mapToInt(i -> i).toArray();
		List<Integer> xPositions = new ArrayList<Integer>();
		Arrays.parallelPrefix(layourWidths1arr, (a,b)->a+b);
		xPositions = Arrays.stream(layourWidths1arr).boxed().collect(Collectors.toList());
		for(int i = 0; i < height; i++) {
			for (int j = 0; j < width; j++) {
				get(j, i).setDisplayX(xPositions.get(j));
			}
		}
		
		List<Integer> layoutHeights1 = new ArrayList<Integer>();
		layoutHeights1.add(0);
		layoutHeights1.addAll(layoutHeights);
		int[] layourHeights1arr = layoutHeights1.stream().mapToInt(i -> i).toArray(); 
		List<Integer> yPositions = new ArrayList<Integer>();
		Arrays.parallelPrefix(layourHeights1arr, (a,b)->a+b);
		yPositions = Arrays.stream(layourHeights1arr).boxed().collect(Collectors.toList());
		for (int i = 0; i < width; i++) {
			for (int j = 0; j < height; j++) {
				System.out.println(yPositions.get(j));
				get(i, j).setDisplayY(yPositions.get(j));
			}
		}
		
//		for (int i = 0; i < height; i++) {
////			int y = 0;
////			for (int j = 0; j < height; j++) {
////				get(i, j).setDisplayX(x);
////				get(i, j).setWidth(layoutWidths.get(i));
////				y += layoutWidths.get(i);
////			}
//			
//		}
//		for (int i = 0; i < height; i++) {
//			int x = 0;
//			for (int j = 0; j < width; j++) {
//				get(j, i).setDisplayX(x);
//				get(j, i).setHeight(layoutHeights.get(i));
//				x += layoutHeights.get(i);
//			}
//		}
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
