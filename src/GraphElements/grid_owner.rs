use super::types::*;
pub struct GridOwner {
    grids: Vec<GridRef>,
}

impl GridOwner {
    pub fn new() -> GridOwner {
        GridOwner {
            grids: Vec::new(),
        }
    }

    pub fn add_grid(&mut self, grid: GridRef) {
        self.grids.push(grid);
    }

    pub fn get_grid(&self, id: u64) -> Option<GridRef> {
        for grid in &self.grids {
            if grid.borrow().id == id {
                return Some(grid.clone());
            }
        }
        None
    }
}