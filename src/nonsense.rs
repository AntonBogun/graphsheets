use std::cell::RefCell;

#[derive(Debug)]
struct Node {
    value: i32,
}

type None = ();

#[derive(Debug)]
enum MyEnum <None> {
    None,
    None2(None),
}

fn main() {
    let v = vec![
        RefCell::new(Node { value: 1 }),
        RefCell::new(Node { value: 2 }),
    ];

    // This will compile because although v is immutable, its elements are wrapped in RefCell, which allows mutability.
    v[0].borrow_mut().value = 10;

    let x: MyEnum<None> = MyEnum::None2(None);
    println!("{:?}", v[0].borrow());
    println!("{:?}", x);
    
}
