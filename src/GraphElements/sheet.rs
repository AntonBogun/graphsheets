use std::{collections::HashMap, fmt::Display, hash::Hash, mem};

#[derive(Clone, Debug)]
pub struct Sheet<T> {
  width : usize,
  height : usize,
  underlying : HashMap<(usize, usize), T>,
}

// FIXME this probably requires unsafe
// struct SheetIteratorMut<'a, T>(&'a mut Sheet<T>, usize, usize);
// impl<'a, T> Iterator for SheetIteratorMut<'a, T> {
//   type Item = &'a mut T;

//   fn next(&mut self) -> Option<Self::Item> {
//     let (oldx, oldy) = (self.1, self.2);
//     self.1 += 1;
//     if self.1 >= self.0.width {
//       self.1 -= self.0.width;
//       self.2 += 1;
//     }
//     if oldx < self.0.width && oldy < self.0.height {
//       Some(self.0.get_at_mut(self.1, self.2))
//     } else {
//       None
//     }
//   }
// }

impl<T> Sheet<T> {
  pub fn get_at(&self, x : usize, y : usize) -> &T { self.underlying.get(&(x, y)).unwrap() }
  pub fn get_at_mut(&mut self, x : usize, y : usize) -> &mut T {
    self.underlying.get_mut(&(x, y)).unwrap()
  }
  pub fn iter(&self) -> impl Iterator<Item = (usize, usize, &T)> {
    (0..self.height).flat_map(move |y| (0..self.width).map(move |x| (x, y, self.get_at(x, y))))
  }
  // fn iter_mut<'a>(&'a mut self) -> SheetIteratorMut<'a, T> {
  //   SheetIteratorMut(self, 0, 0)
  // }
  pub fn pure(inner : T) -> Self {
    Sheet {
      width : 1,
      height : 1,
      underlying : HashMap::from([((0, 0), inner)]),
    }
  }
}

#[test]
fn test_sheet_creation() {
  let mut sheet = Sheet::pure(1);
  assert_eq!(*sheet.get_at(0, 0), 1);
  mem::swap(sheet.get_at_mut(0, 0), &mut 2);
  assert_eq!(*sheet.get_at(0, 0), 2);
  assert_eq!(*sheet.iter().next().unwrap().2, 2);
}

impl<T : Display> Display for Sheet<T> {
  fn fmt(&self, f : &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    for (x, y, t) in self.iter() {
      writeln!(f, "{x}, {y}: {t}")?;
    }
    Ok(())
  }
}

impl<T : Clone> Sheet<T> {
  pub fn insert_column(self, dx : usize, content : &T) -> Self {
    let Sheet {
      width,
      height,
      underlying,
    } = self;
    let mut ret = HashMap::new();
    for ((x, y), t) in underlying {
      let new_x = if x >= dx { x + 1 } else { x };
      ret.insert((new_x, y), t);
    }
    for y in 0..height {
      ret.insert((dx, y), content.clone());
    }
    Sheet {
      width : width + 1,
      height,
      underlying : ret,
    }
  }

  pub fn insert_row(self, dy : usize, content : &T) -> Self {
    let Sheet {
      width,
      height,
      underlying,
    } = self;
    let mut ret = HashMap::new();
    for ((x, y), t) in underlying {
      let new_y = if y >= dy { y + 1 } else { y };
      ret.insert((x, new_y), t);
    }
    for x in 0..width {
      ret.insert((x, dy), content.clone());
    }
    Sheet {
      width,
      height : height + 1,
      underlying : ret,
    }
  }
}

#[test]
fn test_insert_column() {
  let mut sheet = Sheet::pure(1);
  sheet = sheet.insert_column(1, &2);
  sheet = sheet.insert_column(0, &3);
  assert_eq!(*sheet.get_at(0, 0), 3);
  assert_eq!(*sheet.get_at(1, 0), 1);
  assert_eq!(*sheet.get_at(2, 0), 2);
}

#[test]
fn test_insert_row() {
  let mut sheet = Sheet::pure(1);
  sheet = sheet.insert_row(1, &2);
  sheet = sheet.insert_row(0, &3);
  assert_eq!(*sheet.get_at(0, 0), 3);
  assert_eq!(*sheet.get_at(0, 1), 1);
  assert_eq!(*sheet.get_at(0, 2), 2);
}

#[test]
fn test_insert_column_row() {
  let mut sheet = Sheet::pure(1);
  sheet = sheet.insert_column(1, &2);
  sheet = sheet.insert_row(1, &3);
  sheet = sheet.insert_column(0, &4);
  sheet = sheet.insert_row(1, &5);
  assert_eq!(sheet.to_string(), "0, 0: 4\n1, 0: 1\n2, 0: 2\n0, 1: 5\n1, 1: 5\n2, 1: 5\n0, 2: 4\n1, 2: 3\n2, 2: 3\n");
}
