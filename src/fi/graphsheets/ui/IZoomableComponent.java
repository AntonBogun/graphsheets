package fi.graphsheets.ui;

import java.awt.geom.AffineTransform;

import javax.swing.JComponent;
import javax.swing.JPanel;

import fi.graphsheets.graphelements.Node;

public interface IZoomableComponent {
		
	public void setZoomTransform(AffineTransform zoomTransform);
	
	public JComponent getMipMapComponent(Node node);

	public boolean isMipMapRequired(AffineTransform zoomTransform);

	
}
