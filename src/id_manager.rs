
static mut _GRID_ID: u64 = 0;
static mut _NODE_ID: u64 = 0;
static mut _EDGE_ID: u64 = 0;
static mut _GRAPH_ID: u64 = 0;
static mut _CELL_ID: u64 = 0;
static mut _ANY_ID: u64 = 0;

macro_rules! create_id_method {
    ($name:ident, $field:ident) => {
        pub fn $name() -> u64 {
            unsafe {
                let id = $field;
                $field += 1;
                id
            }
        }
    };
}

create_id_method!(grid_id, _GRID_ID);
create_id_method!(node_id, _NODE_ID);
create_id_method!(edge_id, _EDGE_ID);
create_id_method!(graph_id, _GRAPH_ID);
create_id_method!(cell_id, _CELL_ID);
create_id_method!(any_id, _ANY_ID);
