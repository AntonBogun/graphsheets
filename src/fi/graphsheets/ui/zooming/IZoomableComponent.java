package fi.graphsheets.ui.zooming;

import java.awt.geom.AffineTransform;

public interface IZoomableComponent {
		
	public void setZoomTransform(AffineTransform zoomTransform);
	public AffineTransform getZoomTransform();
	public int getDefaultCursor();
	
	
	
}
