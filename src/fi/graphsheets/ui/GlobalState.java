package fi.graphsheets.ui;

import java.awt.Cursor;
import java.awt.Toolkit;
import java.awt.datatransfer.DataFlavor;
import java.awt.datatransfer.Transferable;
import java.awt.datatransfer.UnsupportedFlavorException;
import java.awt.image.BufferedImage;
import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.io.PrintWriter;
import java.io.StringWriter;

import javax.swing.JFileChooser;
import javax.swing.JFrame;
import javax.swing.JLayer;
import javax.swing.JOptionPane;
import javax.swing.filechooser.FileFilter;

import fi.graphsheets.graphelements.Graph;
import fi.graphsheets.graphelements.Node;
import fi.graphsheets.ui.graph.GraphContainerFactory;
import fi.graphsheets.ui.zooming.AbstractZoomableContainer;

public class GlobalState {
	
	private volatile static JFrame frame;
	private volatile static Graph rootGraph;
	private volatile static boolean addEdge;
	private volatile static boolean addImage;
	public volatile static BufferedImage clipboardImage;
	public volatile static Node firstEdgeNode;
	public volatile static File prevFile;
	public static synchronized void initaliseState(JFrame frame, Graph rootGraph) {
		GlobalState.frame = frame;
		GlobalState.rootGraph = rootGraph;
	}
	
	private volatile static boolean addGraph;
	public static synchronized void setAddGraph() {
		addGraph = true;
		frame.setCursor(Cursor.getPredefinedCursor(Cursor.CROSSHAIR_CURSOR));
	}
	
	public static synchronized boolean isAddGraph() {
		return addGraph;
	}
	
	public static synchronized void setAddEdge() {
		addEdge = true;
	}
	
	public static synchronized boolean isAddEdge() {
		return addEdge;
	}
	
	private volatile static boolean addText;
	private static boolean addSheet;
	public static synchronized void setAddText() {
		addText = true;
		frame.setCursor(Cursor.getPredefinedCursor(Cursor.CROSSHAIR_CURSOR));
	}
	
	public static synchronized void clearAdd() {
		addText = false;
		addGraph = false;
		addImage = false;
		addEdge = false;
		addSheet = false;
		firstEdgeNode = null;
		clipboardImage = null;
		frame.setCursor(Cursor.getPredefinedCursor(Cursor.DEFAULT_CURSOR));
	}
	
	public static synchronized boolean isAddText() {
		return addText;
	}
	
	public static void setAddSheet() {
		addSheet = true;
		frame.setCursor(Cursor.getPredefinedCursor(Cursor.CROSSHAIR_CURSOR));
	}
	
	public static synchronized void saveFile() {
		JFileChooser chooser = new JFileChooser();
		chooser.setSelectedFile(prevFile);
		chooser.setFileFilter(new FileFilter() {

			@Override
			public boolean accept(File f) {
				
				return f.getName().endsWith(".gsf");
			}

			@Override
			public String getDescription() {
				return "GraphSheet files";
			}

		});
		
		
		
		if(chooser.showOpenDialog(new JFrame()) == JFileChooser.APPROVE_OPTION) {
			File file = chooser.getSelectedFile();
			String[] options = {"Yes", "No"};


			if(!file.getAbsolutePath().endsWith(".gsf")){
			    file = new File(file + ".gsf");
			}
			
			if(file.exists() &&
					JOptionPane.showOptionDialog(new JFrame(), "The file " + file.getName() + " already exists. Override?", 
								"File exists", JOptionPane.YES_NO_OPTION, JOptionPane.QUESTION_MESSAGE, null, options, 
									options[1]) == JOptionPane.NO_OPTION) return;
			
			
			try {
				File outFile = new File(file + "~");
				
				FileOutputStream fout = new FileOutputStream(outFile);

				BufferedOutputStream bout = new BufferedOutputStream(fout);
				
				ObjectOutputStream output = new ObjectOutputStream(bout);
				
				output.writeObject(GlobalState.rootGraph);
				
				output.close();
				
				fout.close();

				file.delete();
				
				outFile.renameTo(file);
				
			} catch (IOException e) {
				StringWriter sw = new StringWriter();
				e.printStackTrace(new PrintWriter(sw));
				String exceptionAsString = sw.toString();
				JOptionPane.showMessageDialog(new JFrame(), "Error occured while saving graphsheet. \n" + exceptionAsString, "Error", JOptionPane.ERROR_MESSAGE);
				e.printStackTrace();
			}

			
			prevFile = file;
			
		}
	}

	public static synchronized void loadFile() {
		JFileChooser chooser = new JFileChooser();
		chooser.setSelectedFile(prevFile);
		chooser.setFileFilter(new FileFilter() {

			@Override
			public boolean accept(File f) {
				
				return f.getName().endsWith(".gsf");
			}

			@Override
			public String getDescription() {
				return "GraphSheet files";
			}

		});
		
		if(chooser.showOpenDialog(new JFrame()) == JFileChooser.APPROVE_OPTION) {
			
			prevFile = chooser.getSelectedFile();
			
			try {

				FileInputStream fin;
				
				fin = new FileInputStream(chooser.getSelectedFile());
				
				BufferedInputStream bin = new BufferedInputStream(fin);
				
				try (ObjectInputStream input = new ObjectInputStream(bin)) {
					Graph graph;
					graph = (Graph) input.readObject();
					
					GlobalState.rootGraph.replaceGraph(graph);
					
					frame.getContentPane().removeAll();
					
					JLayer<? extends AbstractZoomableContainer> layer = GraphContainerFactory.createZoomableGraphContainer(graph, true);
					
					frame.add(layer);
					
					frame.revalidate();
					frame.repaint();
				}

			} catch (ClassNotFoundException e) {
				StringWriter sw = new StringWriter();
				e.printStackTrace(new PrintWriter(sw));
				String exceptionAsString = sw.toString();
				JOptionPane.showMessageDialog(new JFrame(), "Graphsheet versions are incompatible(?!) \n" + exceptionAsString, "Error", JOptionPane.ERROR_MESSAGE);
				e.printStackTrace();
			} catch (FileNotFoundException e) {
				StringWriter sw = new StringWriter();
				e.printStackTrace(new PrintWriter(sw));
				String exceptionAsString = sw.toString();
				JOptionPane.showMessageDialog(new JFrame(), "The selected file cannot be found. \n" + exceptionAsString, "Error", JOptionPane.ERROR_MESSAGE);
				e.printStackTrace();
			} catch (IOException e) {
				StringWriter sw = new StringWriter();
				e.printStackTrace(new PrintWriter(sw));
				String exceptionAsString = sw.toString();
				JOptionPane.showMessageDialog(new JFrame(), "Error occured while loading graphsheet. \n" + exceptionAsString, "Error", JOptionPane.ERROR_MESSAGE);
				e.printStackTrace();
			} 
			
		}
		
	}

	public static void addImageFromClipboard() {
		Transferable clipboard = Toolkit.getDefaultToolkit().getSystemClipboard().getContents(null);
		if (clipboard == null) {
			System.out.println("Clipboard is empty");
		} else if (!clipboard.isDataFlavorSupported(DataFlavor.imageFlavor)) {
			System.out.println("Clipboard does not contain an image");
		} else {
			try {
				clipboardImage = (BufferedImage) clipboard.getTransferData(DataFlavor.imageFlavor);
				setAddImage();
				frame.setCursor(Cursor.getPredefinedCursor(Cursor.CROSSHAIR_CURSOR));	
			} catch (UnsupportedFlavorException | IOException e) {
				e.printStackTrace();
			}
		}
	}
	
	public static BufferedImage getClipboardImage() {
		return clipboardImage;
	}
//	
//	public static void clearClipboardImage() {
//		clipboardImage = null;
//	}
	
	public static void setAddImage() {
		addImage = true;
	}
	
	public static void clearAddImage() {
		addImage = true;
	}

	public static boolean isAddImage() {
		return addImage;
	}

	public static boolean shouldProcessAddMouseEvents() {
		return isAddEdge() || isAddGraph() || isAddImage() || isAddText() || isAddSheet();
	}

	public static boolean isAddSheet() {
		return addSheet;
	}
	
	public static JFrame getRootFrame() {
		return frame;
	}


}
