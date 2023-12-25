package fi.graphsheets.graphelements;

import java.io.Serializable;

public sealed interface Cell {
	
	public sealed interface Atomic extends Cell{
		public record TextCell(String value) implements Atomic, Serializable {}
	}
	
	public record GraphCell(Graph graph) implements Cell {}
	
	public record SheetCell(Sheet sheet) implements Cell {}
}

