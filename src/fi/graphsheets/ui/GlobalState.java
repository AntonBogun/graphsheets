package fi.graphsheets.ui;

import java.awt.Cursor;

import javax.swing.JFrame;

public class GlobalState {
	
	private volatile static JFrame frame;
	public static synchronized void initaliseState(JFrame frame) {
		GlobalState.frame = frame;
	}
	
	private volatile static boolean addGraph;
	public static synchronized void setAddGraph() {
		addGraph = true;
		frame.setCursor(Cursor.getPredefinedCursor(Cursor.CROSSHAIR_CURSOR));
	}
	
	public static synchronized boolean isAddGraph() {
		return addGraph;
	}
	
	private volatile static boolean addText;
	public static synchronized void setAddText() {
		addText = true;
		frame.setCursor(Cursor.getPredefinedCursor(Cursor.CROSSHAIR_CURSOR));
	}
	
	public static synchronized void clearAdd() {
		addText = false;
		addGraph = false;
		frame.setCursor(Cursor.getPredefinedCursor(Cursor.DEFAULT_CURSOR));
	}
	
	public static synchronized boolean isAddText() {
		return addText;
	}
	

}
