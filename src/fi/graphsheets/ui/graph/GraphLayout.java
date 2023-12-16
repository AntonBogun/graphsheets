package fi.graphsheets.ui.graph;

import java.awt.Component;
import java.awt.Container;
import java.awt.Dimension;
import java.awt.LayoutManager;
import java.awt.Rectangle;
import java.awt.geom.AffineTransform;
import java.awt.geom.NoninvertibleTransformException;

import javax.swing.JComponent;
import javax.swing.JTextArea;

import fi.graphsheets.graphelements.Node;
import fi.graphsheets.ui.AbstractZoomableContainer;

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
    
    //FIXME GraphLayout layoutContainer
    @Override
    public void layoutContainer(Container parent) {
    	//get children
    	if(parent instanceof AbstractZoomableContainer container) {
	    	Component[] components = parent.getComponents();
			for (Component component : components) {
				if(component instanceof JComponent jcomponent && jcomponent.getClientProperty("node") instanceof Node node) {
//					if(component.getBounds().isEmpty())
						component.setBounds(node.getX(), node.getY(), node.getWidth(), node.getHeight());
					
					
					component.setBounds(container.getZoomTransform().createTransformedShape(component.getBounds()).getBounds());

//					component.setBounds(
//							(int)((component.getX() - container.getZoomRegion().getCenterX()) * (container.getWidth()/container.getZoomRegion().width)),
//							(int)((node.getY() - container.getZoomRegion().getCenterY()) * (container.getHeight()/container.getZoomRegion().height))	,
//							node.getWidth() * (container.getWidth()/container.getZoomRegion().width),
//							node.getHeight() * (container.getHeight()/container.getZoomRegion().height)
//							);
					
					if(component instanceof JTextArea textArea) {
						if(textArea.getFont().getSize()<12.0) {
							//TODO make mipmap text component
						}
						textArea.setFont(textArea.getFont().deriveFont(container.getScaleTransform()));
					}
				}
				
			}
    	}
    	
    }
}
