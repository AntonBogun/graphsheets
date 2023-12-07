package UI;

import java.awt.Color;
import java.awt.Component;
import java.awt.Dimension;
import java.awt.Graphics;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.util.ArrayList;

import javax.swing.JComponent;
import javax.swing.JLabel;
import javax.swing.JPanel;

import graphElements.Graph;
import graphElements.Node;

@SuppressWarnings("serial")
public class GraphSheetComponent  extends JPanel{
	
	private Graph graph;
    private int startX = 5;
    private int startY = 0;
    private int endX = 10;
    private int endY = 10;
    private int sizeX = 100;
    private int sizeY = 100;
	private boolean moving = false;
	private int indexToMove = -1;
	//Order of nodeComponents matters
	private ArrayList<JComponent> nodesComponents = new ArrayList<JComponent>();
	public GraphSheetComponent(Graph graph) {
		super(new GridBagLayout());
		this.graph = graph;
	}
	
	public void cellClicked(int i, int j) {
//		System.out.println(i + " " + j);
//		System.out.println(i + j*sizeX);
		if (moving) {
//			System.out.println("No clicked");
			if(indexToMove == i + j*sizeX) {
				return;
			}
			
			moving = false;
			
			NodeComponent paneToMove = (NodeComponent)nodesComponents.get(indexToMove);
			int index = i + j*sizeX;
			JComponent toSwap = nodesComponents.get(index);
			
			
			GridBagLayout layout = (GridBagLayout)getLayout();
			GridBagConstraints swap = layout.getConstraints(toSwap);
			GridBagConstraints original = layout.getConstraints(paneToMove);
			swap.gridx = original.gridx;
			swap.gridy = original.gridy;
			original.gridx = i;
			original.gridy = j;
		    layout.setConstraints(toSwap, swap);
		    layout.setConstraints(paneToMove, original);
		    
		    graph.getNodeByCoordinates(paneToMove.node.getX(), paneToMove.node.getY()).setX(i);
		    graph.getNodeByCoordinates(paneToMove.node.getX(), paneToMove.node.getY()).setY(j);
			if (toSwap instanceof NodeComponent) {
				graph.getNodeByCoordinates(((NodeComponent) toSwap).node.getX(), ((NodeComponent) toSwap).node.getY()).setX(swap.gridx);
				graph.getNodeByCoordinates(((NodeComponent) toSwap).node.getX(), ((NodeComponent) toSwap).node.getY()).setY(swap.gridy);
			}	
		    
			revalidate();
			repaint();
		    
		    
			nodesComponents.set(index, paneToMove);
			nodesComponents.set(indexToMove, toSwap);
			indexToMove = -1;
		} else if(nodesComponents.get(i + j*sizeX) instanceof NodeComponent) {
//			System.out.println("Node clicked");
			moving = true;
			indexToMove = i + j*sizeX;
		}
	}
	
	public void displayGraph() {
		this.removeAll();
		nodesComponents.clear();
		Color labelcolor = Color.GRAY;
		for (int j = 0; j < sizeY; j++) {
			for (int i = 0; i < sizeX; i++) {
				GridBagConstraints c = new GridBagConstraints();
				c.gridx = i;
				c.gridy = j;
				c.weightx = 1;
				c.weighty = 1;
				c.fill = GridBagConstraints.BOTH;
				c.insets.set(5, 5, 0, 0);
				JLabel label = new JLabel();
				label.setOpaque(true);
				label.setBackground(labelcolor.darker());
				labelcolor = labelcolor.darker();
				label.setPreferredSize(new Dimension(2, 2));
				label.addMouseListener(new MouseAdapter() {
				    @Override
				    public void mousePressed(MouseEvent e) {
				    	GridBagConstraints c = ((GridBagLayout)getLayout()).getConstraints((Component) e.getSource());
				    	cellClicked(c.gridx, c.gridy);
				    }
				});
				
				label.addMouseMotionListener(new MouseAdapter() {
                    @Override
                    public void mouseMoved(MouseEvent e) {
//                    	GridBagConstraints c = ((GridBagLayout)getLayout()).getConstraints((Component) e.getSource());
//                    	startX = c.gridx;
//                    	System.out.println(endX);
                    }
                });
				
				if (i > endX || j > endY || i < startX || j < startY) {
					label.setVisible(false);
				}
				
				nodesComponents.add(label);
				this.add(nodesComponents.get(nodesComponents.size()-1), c);
			}
		}
		
		
		for (int i = 0; i < graph.getNodes().size(); i++) {
			Node node = graph.getNodes().get(i);
			NodeComponent nodeComponent = new NodeComponent(graph.getNodes().get(i));
			if (node.getX() < startX || node.getY() < startY || node.getX() > endX || node.getY() > endY) {
				continue;
			}
			int index = node.getX() + node.getY()*sizeX;
			JComponent toRemove = nodesComponents.get(index);
			
			GridBagLayout layout = (GridBagLayout)getLayout();
			GridBagConstraints c = layout.getConstraints(toRemove);
			remove(toRemove);
			
			
			nodeComponent.getViewport().getView().addMouseListener(new MouseAdapter() {
			    @Override
			    public void mousePressed(MouseEvent e) {
			    	GridBagConstraints c1 = ((GridBagLayout)getLayout()).getConstraints(((Component) e.getSource()).getParent().getParent());
			    	cellClicked(c1.gridx, c1.gridy);
			    }
			});
			
			nodeComponent.setPreferredSize(new Dimension(2, 2));
			nodesComponents.set(index, nodeComponent);
			this.add(nodeComponent, c);
			nodeComponent.textArea.setText(node.getName());
			
		}
		
	}
	

	@Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);
    }
	
	

}
