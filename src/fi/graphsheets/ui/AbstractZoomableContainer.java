package fi.graphsheets.ui;

import java.awt.Point;
import java.awt.Rectangle;
import java.awt.geom.AffineTransform;
import java.awt.geom.NoninvertibleTransformException;
import java.lang.reflect.Type;

import javax.swing.JComponent;

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
	
//	public static Object lock = new Object();
//	
//	public void setProcessingLock() {
////		processingZooming = true;
//		lock.
//	}
//	
//	public boolean isProcessing() {
//		return processingZooming;
//	}
//	
//
//	public void clearProcessingLock() {
//		processingZooming = false;
//	}
	
	
	
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
	public void zoomTo(Point origin, int depth) {
		System.out.println("zoom in");
		if(!isZoomingEnabled()) {
//			clearProcessingLock();
			return;
		}
		if(getZoomCounter() > getMaxZoom()) {
//			clearProcessingLock();
			return;
		}
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
		System.out.println("zoom out");
		if(!isZoomingEnabled()) {
//			clearProcessingLock();
			return;
		}
		if(getZoomCounter() < getMinZoom()) {
//			clearProcessingLock();
			return;
		}
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
	
	private double prevz;
	public void addZoomTransform(AffineTransform zoomTransform) {
		System.out.println("add zoom");
//		if(Math.abs(Math.log(this.zoomTransform.getScaleX())/Math.log(2)-prevz)-1>0.1) {
////			zoomTransform.concatenate(AffineTransform.getScaleInstance(0.5, 0.5));
			System.out.println(Math.log(this.zoomTransform.getScaleX())/Math.log(2)-prevz);
//		}
		prevz = Math.log(this.zoomTransform.getScaleX())/Math.log(2);
		this.prevScaleTransform = zoomTransform;
		if(zoomTransform == null) {
//			clearProcessingLock();
			return;
		}
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
//	
//	private AbstractZoomComponent root;
//	
//	public void selectAt(Point point) {
//		
//	}

	public AffineTransform getPrevScaleTransform() {
		if(prevScaleTransform == null) prevScaleTransform = AffineTransform.getRotateInstance(0);
		return prevScaleTransform;
	}
	
}
