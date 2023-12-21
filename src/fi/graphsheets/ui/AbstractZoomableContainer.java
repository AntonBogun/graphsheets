package fi.graphsheets.ui;

import java.awt.Color;
import java.awt.Container;
import java.awt.Graphics2D;
import java.awt.Point;
import java.awt.Rectangle;
import java.awt.geom.AffineTransform;
import java.awt.geom.NoninvertibleTransformException;

import javax.swing.JComponent;

@SuppressWarnings("serial")
public abstract class AbstractZoomableContainer extends JComponent {

	private Rectangle zoomRegion;
	private AffineTransform zoomTransform = AffineTransform.getScaleInstance(1, 1);
	private AffineTransform scaleTransform = AffineTransform.getScaleInstance(1, 1);
	
	public abstract int getMaxZoom();
	
	public abstract int getMinZoom();
	
	public abstract int getZoomCounter();
	
	public abstract void incrementZoomCounter();
	
	public abstract void decrementZoomCounter();
	
	public Rectangle getZoomRegion() {
		if(zoomRegion == null) {
			zoomRegion = new Rectangle(this.getWidth(), this.getHeight());
		}
		return zoomRegion;
	}
	
	@Override
	public boolean isOptimizedDrawingEnabled() {
		return true;
	}
	

	public void zoomTo(Point origin, int depth) {
		if(getZoomCounter() > getMaxZoom()) return;
		incrementZoomCounter();
		try {
		zoomTransform.createInverse().transform(origin, origin);
		AffineTransform translate = AffineTransform.getTranslateInstance(origin.x, origin.y);
		AffineTransform scale = AffineTransform.getScaleInstance(depth, depth);
		AffineTransform translateInv = AffineTransform.getTranslateInstance(-origin.x, -origin.y);
		
		translate.concatenate(scale);
		translate.concatenate(translateInv);
		
		AffineTransform transform = translate;
		
		zoomTransform.concatenate(transform);
		scaleTransform.concatenate(scale);
		zoomRegion = transform.createInverse().createTransformedShape(getZoomRegion()).getBounds();
		} catch (NoninvertibleTransformException e) {
			e.printStackTrace();
		}
		revalidate();
	}
	
	public void zoomFrom(Point origin, int depth) {
		if(getZoomCounter() < getMinZoom()) return;
		decrementZoomCounter();
		try {
		zoomTransform.createInverse().transform(origin, origin);
		AffineTransform translate = AffineTransform.getTranslateInstance(origin.x, origin.y);
		AffineTransform scale = AffineTransform.getScaleInstance(depth, depth).createInverse();
		AffineTransform translateInv = AffineTransform.getTranslateInstance(-origin.x, -origin.y);
		
		translate.concatenate(scale);
		translate.concatenate(translateInv);
		
		AffineTransform transform = translate;
		
		zoomTransform.concatenate(transform);
		scaleTransform.concatenate(scale);
		zoomRegion = transform.createInverse().createTransformedShape(getZoomRegion()).getBounds();
		} catch (NoninvertibleTransformException e) {
			e.printStackTrace();
		}
		revalidate();
	}
	
	public void setZoomTransform(AffineTransform zoomTransform) {

		this.zoomTransform = AffineTransform.getScaleInstance(zoomTransform.getScaleX(), zoomTransform.getScaleY());
		this.scaleTransform = AffineTransform.getScaleInstance(zoomTransform.getScaleX(), zoomTransform.getScaleY());
		try {
			this.zoomRegion = zoomTransform.createInverse().createTransformedShape(getZoomRegion()).getBounds();
		} catch (NoninvertibleTransformException e) {
			e.printStackTrace();
		}
		revalidate();
	}

	public AffineTransform getZoomTransform() {
		return zoomTransform;
	}
	
	public AffineTransform getScaleTransform() {
		return scaleTransform;
	}
//	
//	private AbstractZoomComponent root;
//	
//	public void selectAt(Point point) {
//		
//	}
	
}
