package fi.graphsheets.ui.graph;

import java.awt.Component;
import java.awt.Container;
import java.awt.Dimension;
import java.awt.LayoutManager;
import java.awt.Rectangle;
import java.awt.geom.AffineTransform;
import java.awt.geom.NoninvertibleTransformException;

import javax.swing.JComponent;
import javax.swing.JLayer;
import javax.swing.RepaintManager;
import javax.swing.SwingUtilities;

import fi.graphsheets.graphelements.Cell;
import fi.graphsheets.graphelements.Node;
import fi.graphsheets.ui.AbstractZoomableContainer;
import fi.graphsheets.ui.GSRepaintManager;
import fi.graphsheets.ui.IZoomableComponent;
import fi.graphsheets.ui.ZoomableContainerLayout;
import fi.graphsheets.ui.atomic.GSTextArea;

public class GraphLayout extends ZoomableContainerLayout implements LayoutManager {
	
    @Override
    public void addLayoutComponent(String name, Component comp) {
    	
    }

    @Override
    public void removeLayoutComponent(Component comp) {
    }
    

    @Override
    public Dimension preferredLayoutSize(Container parent) {
        return null;
    }

    @Override
    public Dimension minimumLayoutSize(Container parent) {
        return null;
    }
    
//  TO DONE merge graph and sheet rendering finally. 
    //make list of nodes to redraw once they get too small. List<Component> toRelayout
    //try to figure out why the graph disappears when zooming in or out too fast?
	public void layoutComponent(Component component, AbstractZoomableContainer container) {
		
		if(component instanceof JComponent jcomponent && jcomponent.getClientProperty("node") instanceof Node node) {
			
			Rectangle defaultBounds = new Rectangle(node.getX(), node.getY(), node.getWidth(), node.getHeight());
//			if(node.getCell() instanceof Cell.Atomic.TextCell textcell && textcell.value()=="ab")
//				System.out.println(container.getZoomTransform());
			component.setBounds(container.getZoomTransform().createTransformedShape(defaultBounds).getBounds());
			
			
			if(jcomponent instanceof IZoomableComponent zcomponent) {
				zcomponent.setZoomTransform(container.getZoomTransform());
			} else if(jcomponent instanceof JLayer jlayer && jlayer.getView() instanceof AbstractZoomableContainer subcontainer) {
//				System.out.println(container.getClass());
				//TODO put region zoom layout code in zoomin and zoomout rather than here
				subcontainer.addZoomTransform(container.getPrevScaleTransform());
				
			}
			
		}
		
	}

	@Override
	public void layoutContainer(Container parent) {

//		synchronized(AbstractZoomableContainer.lock) {
		super.layoutZoomableContainer(parent);
//		}
	}
}
