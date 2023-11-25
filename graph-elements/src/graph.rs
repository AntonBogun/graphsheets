use std::collections::HashSet;

pub struct Graph<T> {
  nodes : Vec<T>,
  edges : HashSet<(usize, usize)>,
}
