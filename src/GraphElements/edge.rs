use std::{sync::Arc, sync::Mutex};
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
        Arc::new(Mutex::new(Edge {
            id: id_manager::edge_id(),
            name: name,
            from: Arc::downgrade(&from),
            to: Arc::downgrade(&to),
        }))
    }
    pub fn get_from(&self) -> NodeRef {
        self.from.upgrade().unwrap()
    }
    pub fn get_to(&self) -> NodeRef {
        self.to.upgrade().unwrap()
    }
}