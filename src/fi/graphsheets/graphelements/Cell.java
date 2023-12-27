package fi.graphsheets.graphelements;

import java.awt.Image;
import java.awt.image.BufferedImage;
import java.awt.image.RenderedImage;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.io.Serializable;
import java.util.ArrayList;

import javax.imageio.ImageIO;

import fi.graphsheets.SerializableImage;

public sealed interface Cell {
	
	public sealed interface Atomic extends Cell{
		public record ImageCell(SerializableImage image) implements Atomic, Serializable {}

		public record TextCell(String value) implements Atomic, Serializable {}
	}
	
	public record GraphCell(Graph graph) implements Cell {}
	
	public record SheetCell(Sheet sheet) implements Cell {}
}

