package fi.graphsheets.ui.graph;

import java.awt.Component;
import java.awt.Container;
import java.awt.Dimension;
import java.awt.LayoutManager;
import java.awt.Rectangle;

import javax.swing.JComponent;
import javax.swing.JPanel;
import javax.swing.RepaintManager;
import javax.swing.SwingUtilities;

import fi.graphsheets.graphelements.Node;
import fi.graphsheets.ui.AbstractZoomableContainer;
import fi.graphsheets.ui.GSRepaintManager;
import fi.graphsheets.ui.IZoomableComponent;

public class GraphLayout implements LayoutManager {
	
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
    
    private Rectangle previousBounds = new Rectangle();
    @Override
    public void layoutContainer(Container parent) {
    	if(parent instanceof AbstractZoomableContainer container) {
    		if(container.getZoomRegion() == previousBounds) return;
    		((GSRepaintManager)RepaintManager.currentManager(container)).setPainting(false);
//    		GraphContainerFactory.realiseGraphElementsInRenderRegion(parent, container.getZoomRegion());
	    	Component[] components = parent.getComponents();
			for (Component component : components) {
				if(component instanceof JComponent jcomponent && jcomponent.getClientProperty("node") instanceof Node node) {
					
					Rectangle defaultBounds = new Rectangle(node.getX(), node.getY(), node.getWidth(), node.getHeight());
					component.setBounds(container.getZoomTransform().createTransformedShape(defaultBounds).getBounds());
					
					if(jcomponent.getClientProperty("controller") instanceof IZoomableComponent zcomponent) {
						
						zcomponent.setZoomTransform(container.getZoomTransform());
						
					}
					
				}
				
			}
    		((GSRepaintManager)RepaintManager.currentManager(container)).setPainting(true);
			SwingUtilities.invokeLater(() -> {
				((GSRepaintManager) RepaintManager.currentManager(container)).markCompletelyDirty(container);
				((GSRepaintManager) RepaintManager.currentManager(container)).paintDirtyRegions();
			});
	    	previousBounds = container.getZoomRegion();
    	}
    	
    }
}
