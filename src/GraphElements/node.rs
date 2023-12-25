use super::types::*;
pub struct Node {
    pub id: u64,
    pub name: String,
    pub position: (f64, f64),
    pub scale: f64,
    pub edges: Vec<WeakEdgeRef>,
    pub grid: GridRef,
    // data: ***,
}

impl Node {
    pub fn new(id: u64, name: String, position: (f64, f64), scale: f64, grid: GridRef) -> Node {
        Node {
            id,
            name,
            position,
            scale,
            edges: Vec::new(),
            grid,
        }
    }
    pub fn add_edge(&mut self, edge: WeakEdgeRef) {
        self.edges.push(edge);
    }
    

}