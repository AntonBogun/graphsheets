use super::types::*;
pub enum CellContent {
    Grid(GridRef),
    Node(NodeRef),
    None,
}
pub struct Cell {
    pub id: u64,
    pub name: String,
    pub position: (f64, f64),
    pub scale: f64,
    pub content: CellContent,
    // data: ***,
}