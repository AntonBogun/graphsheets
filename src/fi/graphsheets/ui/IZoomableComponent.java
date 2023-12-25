package fi.graphsheets.ui;

import java.awt.geom.AffineTransform;

public interface IZoomableComponent {
		
	public void setZoomTransform(AffineTransform zoomTransform);
	public AffineTransform getZoomTransform();
	public int getDefaultCursor();
	
	
	
}
