use super::cell::*;
pub struct Grid {
    pub id: u64,
    pub cells: Vec<Box<Cell>>,
}