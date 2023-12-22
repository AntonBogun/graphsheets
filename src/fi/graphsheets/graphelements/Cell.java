package fi.graphsheets.graphelements;

public sealed interface Cell {
	
	public sealed interface Atomic extends Cell{
		public record TextCell(String value) implements Atomic {}
	}
	
	public record GraphCell(Graph graph) implements Cell {}
	
	public record SheetCell(Sheet sheet) implements Cell {}
}

