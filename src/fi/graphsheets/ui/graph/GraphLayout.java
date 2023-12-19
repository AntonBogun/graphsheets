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
	
	
//	/**
//	 * Sets the bounding box that this layout for the view of this GraphLayout
//	 * 
//	 * @param height
//	 */
//	public void setViewBounds(int height, Point origin) {
//		this.height = height;
//		if(origin != null) {
//			this.origin = origin;
//		}
//	}
	
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
    //FIXED FIX-ME GraphLayout layoutContainer
    @Override
    public void layoutContainer(Container parent) {
    	//get children
    	if(parent instanceof AbstractZoomableContainer container) {
    		if(container.getZoomRegion() == previousBounds) return;
    		((GSRepaintManager)RepaintManager.currentManager(container)).setPainting(false);
    		GraphContainerFactory.realiseGraphElementsInRenderRegion(parent, container.getZoomRegion());
	    	Component[] components = parent.getComponents();
			for (Component component : components) {
				if(component instanceof JComponent jcomponent && jcomponent.getClientProperty("node") instanceof Node node) {
//					if(component.getBounds().isEmpty())
					Rectangle defaultBounds = new Rectangle(node.getX(), node.getY(), node.getWidth(), node.getHeight());
//					if (!defaultBounds.intersects(container.getZoomRegion())) {
//						component.setVisible(false);
//						continue;
//					} else {
//						component.setVisible(true);
//					}


					
//					component.setVisible(defaultBounds.intersects(container.getZoomRegion()));
					component.setBounds(container.getZoomTransform().createTransformedShape(defaultBounds).getBounds());
//					component.setBounds(
//							(int)((component.getX() - container.getZoomRegion().getCenterX()) * (container.getWidth()/container.getZoomRegion().width)),
//							(int)((node.getY() - container.getZoomRegion().getCenterY()) * (container.getHeight()/container.getZoomRegion().height))	,
//							node.getWidth() * (container.getWidth()/container.getZoomRegion().width),
//							node.getHeight() * (container.getHeight()/container.getZoomRegion().height)
//							);
					if(jcomponent.getClientProperty("controller") instanceof IZoomableComponent zcomponent) {
//						if(!zcomponent.isMipMapped()){
//							zcomponent.computeMipMap();
//						}
//						if(textArea.getFont().getSize()<12.0) {
//							////TO DO make mipmap text component
//						}
						//float fontSize = (float) (textArea.getFont().getSize() * (container.getScaleTransform().getScaleX()));
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
