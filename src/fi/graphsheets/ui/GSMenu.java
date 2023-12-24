package fi.graphsheets.ui;

import java.awt.event.KeyEvent;

import javax.swing.JMenu;
import javax.swing.JMenuBar;
import javax.swing.JMenuItem;

@SuppressWarnings("serial")
public class GSMenu extends JMenuBar{
	
	public GSMenu() {
		super();
		initialiseMenu();
	}
	
	public void initialiseMenu() {
		JMenu addMenu = new JMenu("Add");
		addMenu.setMnemonic(KeyEvent.VK_A);
			JMenuItem addGraph = new JMenuItem("Graph");
			addGraph.addActionListener((e)->{GlobalState.setAddGraph();});
		addMenu.add(addGraph);
			
//			addMenu.add();
//			addMenu.add(new JMenuItem("Sheet"));
		
			JMenu atomicAddMenu = new JMenu("Atomic");
				JMenuItem addText = new JMenuItem("Text");
				addText.addActionListener((e)->{GlobalState.setAddText();});
			atomicAddMenu.add(addText);	
		addMenu.add(atomicAddMenu);
		
		add(addMenu);
	}

}
