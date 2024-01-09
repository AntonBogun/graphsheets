package fi.graphsheets.graphelements;

import java.io.Serializable;

import fi.graphsheets.SerializableImage;

public sealed interface Cell {
	
	public sealed interface Atomic extends Cell{
		public record ImageCell(SerializableImage image) implements Atomic, Serializable {}

		public record TextCell(String value) implements Atomic, Serializable {}
	}
	
	public record GraphCell(Graph graph) implements Cell, Serializable {}
	
	public record SheetCell(Sheet sheet) implements Cell, Serializable {}
}

