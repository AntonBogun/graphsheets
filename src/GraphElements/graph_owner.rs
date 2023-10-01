use super::types::*;
pub struct GraphOwner {
    pub graphs: Vec<GraphRef>,
}


impl GraphOwner {
    pub fn new() -> GraphOwner {
        GraphOwner {
            graphs: Vec::new(),
        }
    }
    pub fn add_graph(&mut self, graph: GraphRef) {
        self.graphs.push(graph);
    }
    pub fn get_graph(&self, id: u64) -> Option<GraphRef> {
        for graph in &self.graphs {
            if graph.lock().unwrap().id == id {
                return Some(graph.clone());
            }
        }
        None
    }
}
