package fi.graphsheets.ui;

import java.awt.Point;
import java.awt.Rectangle;
import java.awt.geom.AffineTransform;
import java.awt.geom.NoninvertibleTransformException;

import javax.swing.JComponent;

import fi.graphsheets.graphelements.Cell;

@SuppressWarnings("serial")
public abstract class AbstractZoomableContainer extends JComponent {

	private Rectangle zoomRegion;
	private AffineTransform zoomTransform = AffineTransform.getScaleInstance(1, 1);
	private AffineTransform scaleTransform = AffineTransform.getScaleInstance(1, 1);
	
//	
	public abstract int getMaxZoom();
	
	public abstract int getMinZoom();
	
	public abstract int getZoomCounter();
	
	public abstract void incrementZoomCounter();
	
	public abstract void decrementZoomCounter();
	
	public abstract boolean isZoomingEnabled();
	
	
	
	
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
	
	private AffineTransform prevScaleTransform;
	public boolean forcedRepaint;
	public void zoomTo(Point origin, int depth) {
		if(!isZoomingEnabled()) return;
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
		
		prevScaleTransform = scale;
		zoomTransform.concatenate(transform);
		scaleTransform.concatenate(scale);
		zoomRegion = transform.createInverse().createTransformedShape(getZoomRegion()).getBounds();
		} catch (NoninvertibleTransformException e) {
			e.printStackTrace();
		}
		doLayout();
		revalidate();
	}
	
	public void zoomFrom(Point origin, int depth) {
		if(!isZoomingEnabled()) return;
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

		prevScaleTransform = scale;
		zoomTransform.concatenate(transform);
		scaleTransform.concatenate(scale);
		zoomRegion = transform.createInverse().createTransformedShape(getZoomRegion()).getBounds();
		} catch (NoninvertibleTransformException e) {
			e.printStackTrace();
		}
		doLayout();
		revalidate();
	}
	
	public void convertFromScreen(Point point) {
		try {
			zoomTransform.createInverse().transform(point, point);
		} catch (NoninvertibleTransformException e) {
			e.printStackTrace();
		}
	}
	
	public void convertScaleFromScreen(Point point) {
		try {
			scaleTransform.createInverse().transform(point, point);
		} catch (NoninvertibleTransformException e) {
			e.printStackTrace();
		}
	}
	
	public void addZoomTransform(AffineTransform zoomTransform) {
		this.prevScaleTransform = zoomTransform;
		if(zoomTransform == null) return;
		if(this.zoomTransform == null) this.zoomTransform = AffineTransform.getRotateInstance(0);
		if(this.scaleTransform == null) this.scaleTransform = AffineTransform.getRotateInstance(0);
		this.zoomTransform.concatenate(zoomTransform);
		this.scaleTransform.concatenate(zoomTransform);
		try {
			this.zoomRegion = zoomTransform.createInverse().createTransformedShape(getZoomRegion()).getBounds();
		} catch (NoninvertibleTransformException e) {
			e.printStackTrace();
		}
		doLayout();
		revalidate();
	}

	public AffineTransform getZoomTransform() {
		return zoomTransform;
	}
	
	public AffineTransform getScaleTransform() {
		return scaleTransform;
	}

	public AffineTransform getPrevScaleTransform() {
		if(prevScaleTransform == null) prevScaleTransform = AffineTransform.getRotateInstance(0);
		return prevScaleTransform;
	}

	public void forceRepaint() {
		forcedRepaint = true;
		doLayout();
		
	}
	
	
	
}
