use std::sync::Mutex;
use std::sync::Arc;

mod id_manager;
mod GraphElements;
use GraphElements as ge;
mod bevy_rendering;
use bevy_rendering as br;
 fn main(){
	let mut graph = ge::Graph::new();
	let grid1 = ge::Grid{ id: 0, cells: vec![]};
	let node1 = ge::Node::new("node1".to_string(), (0.0,0.0), 10.0 ,Arc::new(Mutex::new(grid1)));
	graph.lock().unwrap().add_node(node1.clone());
	let grid2 = ge::Grid{ id: 0, cells: vec![]};
	let node2 = ge::Node::new("node2".to_string(), (0.0,0.0), 10.0 ,Arc::new(Mutex::new(grid2)));
	graph.lock().unwrap().add_node(node2.clone());
	let edge1 = ge::Edge::new(node1.clone(), node2.clone(), "edge1".to_string());
	graph.lock().unwrap().add_edge(edge1);
	br::start(graph);
 } 
