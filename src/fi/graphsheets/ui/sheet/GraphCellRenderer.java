package fi.graphsheets.ui.sheet;

import java.awt.Component;

import javax.swing.JTable;
import javax.swing.table.TableCellRenderer;

import fi.graphsheets.graphelements.Cell;
import fi.graphsheets.graphelements.Graph;
import fi.graphsheets.ui.graph.GraphContainerFactory;

public class GraphCellRenderer implements TableCellRenderer {

	@Override
	public Component getTableCellRendererComponent(JTable table, Object value, boolean isSelected, boolean hasFocus, int row, int column) {
		if(value instanceof Cell.GraphCell graph) {
			return GraphContainerFactory.createZoomableGraphContainer(graph.graph());
		}
		return table.getDefaultRenderer(String.class).getTableCellRendererComponent(table, "GRAPH ERROR", isSelected, hasFocus, row, column);
	}
}
