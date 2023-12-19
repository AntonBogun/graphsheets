package fi.graphsheets.ui;

import javax.swing.JComponent;
import javax.swing.RepaintManager;

public class GSRepaintManager extends RepaintManager {
	public volatile boolean isP = true;
	
	public synchronized void setPainting(boolean painting) {
		isP = painting;
	}
	
	@Override
	public void validateInvalidComponents() {
		if(isP) 
			super.validateInvalidComponents();
	}
	
	@Override
	public void addInvalidComponent(JComponent invalidComponent) {
		if (isP) {
			super.addInvalidComponent(invalidComponent);
		}
	}
	
	@Override
	public void addDirtyRegion(JComponent c, int x, int y, int w, int h) {
		if (isP) {
			super.addDirtyRegion(c, x, y, w, h);
		}
	}
	
	@Override
	public void markCompletelyDirty(JComponent aComponent) {
		if (isP)
			super.markCompletelyDirty(aComponent);
	}
	
	@Override
	public void paintDirtyRegions() {
		if (isP)
			super.paintDirtyRegions();
	}


	
	
}
