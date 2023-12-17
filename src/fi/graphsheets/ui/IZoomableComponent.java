package fi.graphsheets.ui;

import java.awt.geom.AffineTransform;

public interface IZoomableComponent {
	
	public void setZoomTransform(AffineTransform zoomTransform);
	
	default public void computeMipMap() {}
	
	default public boolean isMipMapped() { return true; }
	
	
}
