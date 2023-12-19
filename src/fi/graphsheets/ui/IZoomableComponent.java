package fi.graphsheets.ui;

import java.awt.geom.AffineTransform;

import javax.swing.JComponent;
import javax.swing.JPanel;

import fi.graphsheets.graphelements.Node;

public interface IZoomableComponent {
		
	public void setZoomTransform(AffineTransform zoomTransform);
	
	public JComponent getMipMapComponent(Node node);
//	default public void computeMipMap() {}
//	
//	default public boolean isMipMapped() { return true; }
//	

	public boolean isMipMapRequired(AffineTransform zoomTransform);

	
}
