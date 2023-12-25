use std::{rc::Rc, cell::RefCell};
use crate::id_manager;
use super::types::*;
pub struct Edge {
    pub id: u64,
    pub name: String,
    pub from: WeakNodeRef,
    pub to: WeakNodeRef,
    // data: ***,
}

impl Edge {
    pub fn new(from: NodeRef, to: NodeRef, name: String) -> EdgeRef {
        Rc::new(RefCell::new(Edge {
            id: id_manager::edge_id(),
            name: name,
            from: Rc::downgrade(&from),
            to: Rc::downgrade(&to),
        }))
    }
    pub fn get_from(&self) -> Option<NodeRef> {
        match self.from.upgrade() {
            Some(node) => Some(node),
            None => None,
        }
    }
    pub fn get_to(&self) -> Option<NodeRef> {
        match self.to.upgrade() {
            Some(node) => Some(node),
            None => None,
        }
    }
}