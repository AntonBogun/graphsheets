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
	
//
//	public void setZoomRegion(Rectangle zoomRegion) {
//		this.zoomRegion = zoomRegion;
//	}
//	
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
		try {
		zoomTransform.createInverse().transform(origin, origin);
		AffineTransform translate = AffineTransform.getTranslateInstance(origin.x, origin.y);
		AffineTransform scale = AffineTransform.getScaleInstance(depth, depth);
		AffineTransform translateInv = AffineTransform.getTranslateInstance(-origin.x, -origin.y);
		
		translate.concatenate(scale);
		translate.concatenate(translateInv);
		
		AffineTransform transform = translate;
		
//		System.out.println("in");
//		Shape bounds = getZoomRegion();
//		System.out.println(bounds.getBounds());
//		try {
//			bounds = translate.createInverse().createTransformedShape(bounds);
//			System.out.println(bounds.getBounds());
//			bounds = scale.createInverse().createTransformedShape(bounds);
//			System.out.println(bounds.getBounds());
//			bounds = translate.createTransformedShape(bounds);
//			System.out.println(bounds.getBounds());
//		} catch (NoninvertibleTransformException e) {
//			e.printStackTrace();
//		}
		
		zoomTransform.concatenate(transform);
		scaleTransform.concatenate(scale);
		zoomRegion = transform.createInverse().createTransformedShape(getZoomRegion()).getBounds();
		} catch (NoninvertibleTransformException e) {
			e.printStackTrace();
		}
		revalidate();
	}
	
	public void zoomFrom(Point origin, int depth) {
		try {
		zoomTransform.createInverse().transform(origin, origin);
		AffineTransform translate = AffineTransform.getTranslateInstance(origin.x, origin.y);
		AffineTransform scale = AffineTransform.getScaleInstance(depth, depth).createInverse();
		AffineTransform translateInv = AffineTransform.getTranslateInstance(-origin.x, -origin.y);
		
		translate.concatenate(scale);
		translate.concatenate(translateInv);
		
		AffineTransform transform = translate;
		
//		System.out.println("in");
//		Shape bounds = getZoomRegion();
//		System.out.println(bounds.getBounds());
//		try {
//			bounds = translate.createInverse().createTransformedShape(bounds);
//			System.out.println(bounds.getBounds());
//			bounds = scale.createInverse().createTransformedShape(bounds);
//			System.out.println(bounds.getBounds());
//			bounds = translate.createTransformedShape(bounds);
//			System.out.println(bounds.getBounds());
//		} catch (NoninvertibleTransformException e) {
//			e.printStackTrace();
//		}

		zoomTransform.concatenate(transform);
		scaleTransform.concatenate(scale);
		zoomRegion = transform.createInverse().createTransformedShape(getZoomRegion()).getBounds();
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
	
}
