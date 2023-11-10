use std::{collections::HashSet, marker::PhantomData, sync::Arc, vec};

use super::{atomic::Atomic, sheet::Sheet};

#[derive(Debug)]
pub struct Idx<T> {
  pub raw : usize,
  _phatom : PhantomData<fn() -> T>,
}

impl<T> Clone for Idx<T> {
  fn clone(&self) -> Self {
    *self
  }
}
impl<T> Copy for Idx<T> {}
impl<T> PartialEq for Idx<T> {
  fn eq(&self, other : &Self) -> bool {
    self.raw == other.raw
  }
}
impl<T> Eq for Idx<T> {}
impl<T> PartialOrd for Idx<T> {
  fn partial_cmp(&self, other : &Self) -> Option<std::cmp::Ordering> {
    Some(self.cmp(other))
  }
}
impl<T> Ord for Idx<T> {
  fn cmp(&self, other : &Self) -> std::cmp::Ordering {
    self.raw.cmp(&other.raw)
  }
}
impl<T> std::hash::Hash for Idx<T> {
  fn hash<H : std::hash::Hasher>(&self, state : &mut H) {
    self.raw.hash(state);
  }
}

impl<T> Idx<T> {
  pub fn from_raw(r : usize) -> Idx<T> {
    Idx {
      raw : r,
      _phatom : PhantomData,
    }
  }
}

#[derive(Debug, Clone)]
pub enum Cell {
  Graph {
    nodes : Vec<Idx<Cell>>,
    edges : Vec<(Idx<Cell>, Idx<Cell>)>,
  },
  S(Sheet<Idx<Cell>>),
  Atom(Arc<dyn Atomic>),
}

impl Cell {
  fn nothing() -> Cell {
    Cell::Atom(Arc::new(()))
  }
  fn pure_sheet(inside : Idx<Cell>) -> Cell {
    Cell::S(Sheet::pure(inside))
  }
  fn pure_graph(inside : Idx<Cell>) -> Cell {
    Cell::Graph {
      nodes : vec![inside],
      edges : vec![],
    }
  }
}

#[derive(Debug)]
pub struct CellArena {
  raw : Vec<Cell>,
}

// pub struct CellIterator<'a> {
//   of : &'a CellArena,
//   visited : HashSet<Idx<Cell>>,
//   next : Idx<Cell>,
// }

// impl CellIterator<'_> {
//   fn new_from_root(of : &CellArena, id : Idx<Cell>) -> CellIterator {
//     CellIterator {
//       of,
//       visited : HashSet::new(),
//       next : id,
//     }
//   }
// }

// impl<'a> Iterator for CellIterator<'a> {
//   type Item = &'a Cell;

//   fn next(&mut self) -> Option<Self::Item> {
//     let ret = self.of.get(self.next);
//     match ret {
//       Cell::Graph { nodes, edges: _ } => {
//         for n in nodes {
//           if !(self.visited.contains(n)) {
//             self.next = *n;
//             break;
//           }
//         }
//       }
//       Cell::S(sheet) => {
//         for (_, _, n) in sheet.iter() {
//           if !(self.visited.contains(n)) {
//             self.next = *n;
//             break;
//           }
//         }
//       }
//       Cell::Atom(_) => {},
//     }
//     Some(ret)
//   }
// }

impl CellArena {
  pub fn get(&self, id : Idx<Cell>) -> &Cell {
    &self.raw[id.raw]
  }
  pub fn get_mut(&mut self, id : Idx<Cell>) -> &mut Cell {
    &mut self.raw[id.raw]
  }
  pub fn put(&mut self, cell : Cell) -> Idx<Cell> {
    self.raw.push(cell);
    Idx {
      raw : self.raw.len(),
      _phatom : PhantomData,
    }
  }
  /// create a new `CellArena` with the first element [0] as the empty cell,
  /// and the second element [1] as root containing a 1x1 sheet, pointing to the
  /// empty cell
  pub fn new() -> CellArena {
    let mut ret = CellArena { raw : vec![] };
    let nothing = ret.put(Cell::nothing());
    assert_eq!(nothing.raw, 0);
    let root = ret.put(Cell::pure_sheet(nothing));
    assert_eq!(root.raw, 1);
    ret
  }
}
