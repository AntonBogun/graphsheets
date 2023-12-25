use std::{cell::RefCell, rc::Rc};
use crate::id_manager;
use super::types::*;
pub struct Graph {
    pub id: u64,
    pub nodes: Vec<NodeRef>,
    pub edges: Vec<EdgeRef>,
}


impl Graph {
    pub fn new() -> GraphRef {
        Rc::new(RefCell::new(Graph {
            id: id_manager::graph_id(),
            nodes: Vec::new(),
            edges: Vec::new(),
        }))
    }
    pub fn add_node(&mut self, node: NodeRef) {
        self.nodes.push(node);
    }
    pub fn add_edge(&mut self, edge: EdgeRef) {
        self.edges.push(edge);
    }
    pub fn get_node(&self, id: u64) -> Option<NodeRef> {
        for node in &self.nodes {
            if node.borrow().id == id {
                return Some(node.clone());
            }
        }
        None
    }
    pub fn get_edge(&self, id: u64) -> Option<EdgeRef> {
        for edge in &self.edges {
            if edge.borrow().id == id {
                return Some(edge.clone());
            }
        }
        None
    }
}