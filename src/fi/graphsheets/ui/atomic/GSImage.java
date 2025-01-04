package fi.graphsheets.ui.atomic;

import java.awt.Cursor;
import java.awt.Graphics;
import java.awt.geom.AffineTransform;
import java.awt.image.BufferedImage;

import javax.swing.JComponent;
import javax.swing.SwingWorker;

import fi.graphsheets.ui.ResizeMoveMouseAdapter;
import fi.graphsheets.ui.highlight.HighlightMouseMoveAdapter;
import fi.graphsheets.ui.highlight.IHighlightable;
import fi.graphsheets.ui.zooming.IZoomableComponent;

public class GSImage extends JComponent implements IZoomableComponent, IHighlightable {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 2441393440535546372L;
	private transient BufferedImage image;
	private AffineTransform zoomTransform;
	private boolean highlight;
	public GSImage(BufferedImage image) {
//		if(image.getWidth()>1000) image = (BufferedImage) image.getScaledInstance(1000, image.getHeight(), Image.SCALE_DEFAULT);
//		if(image.getHeight()>1000) image = (BufferedImage) image.getScaledInstance(image.getHeight(), 1000, Image.SCALE_DEFAULT);
		this.image = image;
		ResizeMoveMouseAdapter ma = new ResizeMoveMouseAdapter();
		HighlightMouseMoveAdapter ha = new HighlightMouseMoveAdapter();
//		this.addMouseListener(ma);
		this.addMouseMotionListener(ma);
		this.addMouseListener(ha);
	}
	
	@Override
	public void paint(Graphics g) {
//		super.paint(g);
		g.drawImage(image, 0, 0, getWidth(), getHeight(), null);
		if(highlight) {
			g.drawRect(0, 0, getWidth() - 1, getHeight() - 1);
		}
	}
	
	public class GSImageLoadingWorker extends SwingWorker<BufferedImage, Void>{

		@Override
		protected BufferedImage doInBackground() throws Exception {
			return null;
		}
		
	}

	@Override
	public void setZoomTransform(AffineTransform zoomTransform) {
		this.zoomTransform = zoomTransform;
		
	}

	@Override
	public AffineTransform getZoomTransform() {
		return zoomTransform;
	}

	@Override
	public int getDefaultCursor() {
		return Cursor.DEFAULT_CURSOR;
	}

	@Override
	public void setHighlight() {
		highlight = true;
		
	}

	@Override
	public void clearHighlight() {
		highlight = false;
	}
	
	
	
}
