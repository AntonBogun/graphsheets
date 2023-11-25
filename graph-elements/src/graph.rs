use std::collections::HashSet;

pub struct Graph<T> {
  nodes : Vec<T>,
  edges : HashSet<(usize, usize)>,
}

impl<T> Graph<T> {
  pub fn pure(inner : T) -> Self {
    Graph {
      nodes : vec![inner],
      edges : HashSet::new(),
    }
  }
  #[must_use]
  pub fn get_nodes(&self) -> &[T] {
    self.nodes.as_slice()
  }
  #[must_use]
  pub fn get_nodes_mut(&mut self) -> &mut [T] {
    self.nodes.as_mut_slice()
  }
  #[must_use]
  pub fn get_edges(& self) -> &HashSet<(usize, usize)> {
    &self.edges
  }
  /// # Panics
  /// if the edge is not starting or ending from a valid node, this panics.
  pub fn put_edge(&mut self, e : (usize, usize)) {
    assert!(e.0 < self.nodes.len() && e.1 < self.nodes.len());
    self.edges.insert(e);
  }
  pub fn delete_edge(&mut self, e : &(usize, usize)) {
    self.edges.remove(e);
  }
}
