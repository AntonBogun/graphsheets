package fi.graphsheets.ui;

import java.awt.Cursor;
import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;

import javax.swing.JFileChooser;
import javax.swing.JFrame;
import javax.swing.JLayer;
import javax.swing.JOptionPane;
import javax.swing.filechooser.FileFilter;

import fi.graphsheets.graphelements.Graph;
import fi.graphsheets.ui.graph.GraphContainerFactory;

public class GlobalState {
	
	private volatile static JFrame frame;
	private volatile static Graph rootGraph;
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
	
	public static synchronized void saveFile() throws IOException {
		JFileChooser chooser = new JFileChooser();
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
			File file = null;

			if(!chooser.getSelectedFile().getAbsolutePath().endsWith(".gsf")){
			    file = new File(chooser.getSelectedFile() + ".gsf");
			}
			
			String[] options = {"Yes", "No"};
			if(file.exists() && 
					JOptionPane.showOptionDialog(new JFrame(), "The file " + file.getName() + " already exists. Override?", 
							"File exists", JOptionPane.YES_NO_OPTION, JOptionPane.QUESTION_MESSAGE, null, options, options[1]) == JOptionPane.NO_OPTION) return;
			
			FileOutputStream fout = new FileOutputStream(file);

			BufferedOutputStream bout = new BufferedOutputStream(fout);
			
			ObjectOutputStream output = new ObjectOutputStream(bout);
			
			output.writeObject(GlobalState.rootGraph);
			
			output.close();
			
			fout.close();
			
		}
	}

	public static synchronized void loadFile() throws IOException, ClassNotFoundException {
		JFileChooser chooser = new JFileChooser();
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
			
			FileInputStream fin = new FileInputStream(chooser.getSelectedFile());

			BufferedInputStream bin = new BufferedInputStream(fin);
			
			ObjectInputStream input = new ObjectInputStream(bin);
			
			Graph graph = (Graph) input.readObject();
			
			GlobalState.rootGraph.replaceGraph(graph);
			
			frame.getContentPane().removeAll();
			
			JLayer<? extends AbstractZoomableContainer> layer = GraphContainerFactory.createZoomableGraphContainer(graph, true);
			
			frame.add(layer);
			
			frame.revalidate();
			frame.repaint();
			
		}
	}
	

}
