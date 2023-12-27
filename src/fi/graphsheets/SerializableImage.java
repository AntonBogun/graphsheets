package fi.graphsheets;

import java.awt.image.BufferedImage;
import java.awt.image.ColorModel;
import java.awt.image.IndexColorModel;
import java.awt.image.WritableRaster;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.io.Serializable;
import java.util.Hashtable;

import javax.imageio.ImageIO;

public class SerializableImage implements Serializable {

	private static final long serialVersionUID = -2621235222076307826L;
	private transient BufferedImage image;
	public SerializableImage(BufferedImage image) {
		this.image = image;
	}


	private void writeObject(ObjectOutputStream out) throws IOException {
        out.defaultWriteObject();
        ImageIO.write(image, "png", out);
    }
	
	private void readObject(ObjectInputStream in) throws IOException, ClassNotFoundException {
        in.defaultReadObject();
        this.image = ImageIO.read(in);
    }
	
	public BufferedImage getBufferedImage() {
		return image;
	}
	
	

}
