use std::{fmt::Display, vec};

#[derive(Clone, Debug, PartialEq, Eq)]
#[must_use]
pub struct Sheet<T> {
  width : usize,
  underlying : Vec<T>,
}

impl<T> Sheet<T> {
  #[must_use]
  pub fn get_width(&self) -> usize {
    self.width
  }
  #[must_use]
  pub fn get_underlying(&self) -> &[T] {
    self.underlying.as_slice()
  }
  #[must_use]
  pub fn get_underlying_mut(&mut self) -> &mut [T] {
    self.underlying.as_mut_slice()
  }
  #[must_use]
  pub fn get_row(&self, y : usize) -> Option<&[T]> {
    self.underlying.chunks(self.width).nth(y)
  }
  #[must_use]
  pub fn get_row_mut(&mut self, y : usize) -> Option<&mut [T]> {
    self.underlying.chunks_mut(self.width).nth(y)
  }
  #[must_use]
  pub fn get_at(&self, x : usize, y : usize) -> Option<&T> {
    Some(&self.get_row(y)?[x])
  }
  #[must_use]
  pub fn get_at_mut(&mut self, x : usize, y : usize) -> Option<&mut T> {
    Some(&mut self.get_row_mut(y)?[x])
  }
  pub fn iter(&self) -> impl Iterator<Item = ((usize, usize), &T)> {
    self.into_iter()
  }
  pub fn iter_mut(&mut self) -> impl Iterator<Item = ((usize, usize), &mut T)> {
    self.into_iter()
  }
  pub fn pure(inner : T) -> Self {
    Sheet {
      width : 1,
      underlying : vec![inner],
    }
  }
}

#[test]
fn test_sheet_creation() {
  let mut sheet = Sheet::pure(1);
  assert_eq!(*sheet.get_at(0, 0).unwrap(), 1);
  let _ = std::mem::replace(sheet.get_at_mut(0, 0).unwrap(), 2);
  assert_eq!(*sheet.get_at(0, 0).unwrap(), 2);
  assert_eq!(*sheet.iter().next().unwrap().1, 2);
}

impl<T> IntoIterator for Sheet<T> {
  type Item = ((usize, usize), T);
  type IntoIter = impl Iterator<Item = ((usize, usize), T)>;

  fn into_iter(self) -> Self::IntoIter {
    let xs = std::iter::repeat(0..self.width).flatten();
    let ys = (0usize..).flat_map(move |y| std::iter::repeat(y).take(self.width));
    xs.zip(ys).zip(self.underlying)
  }
}

impl<'a, T> IntoIterator for &'a Sheet<T> {
  type Item = ((usize, usize), &'a T);
  type IntoIter = impl Iterator<Item = ((usize, usize), &'a T)>;

  fn into_iter(self) -> Self::IntoIter {
    let xs = std::iter::repeat(0..self.width).flatten();
    let ys = (0usize..).flat_map(|y| std::iter::repeat(y).take(self.width));
    xs.zip(ys).zip(self.underlying.iter())
  }
}

impl<'a, T> IntoIterator for &'a mut Sheet<T> {
  type Item = ((usize, usize), &'a mut T);
  type IntoIter = impl Iterator<Item = ((usize, usize), &'a mut T)>;

  fn into_iter(self) -> Self::IntoIter {
    let xs = std::iter::repeat(0..self.width).flatten();
    let ys = (0usize..).flat_map(|y| std::iter::repeat(y).take(self.width));
    xs.zip(ys).zip(self.underlying.iter_mut())
  }
}

impl<T : Display> Display for Sheet<T> {
  fn fmt(&self, f : &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    for ((x, y), t) in self {
      writeln!(f, "{x}, {y}: {t}")?;
    }
    Ok(())
  }
}

impl<T : Clone> Sheet<T> {
  pub fn insert_column(&mut self, dx : usize, content : &T) {
    self.underlying = self
      .underlying
      .chunks(self.width)
      .flat_map(|s| {
        let (l, r) = s.split_at(dx);
        l.iter().chain(std::iter::once(content)).chain(r.iter())
      })
      .cloned()
      .collect();
    self.width += 1;
  }

  pub fn delete_column(&mut self, dx : usize) {
    self.underlying = self
      .underlying
      .chunks(self.width)
      .flat_map(|s| {
        let (l, r) = s.split_at(dx);
        l.iter().chain(r.iter().skip(1))
      })
      .cloned()
      .collect();
    self.width -= 1;
  }

  pub fn insert_row(&mut self, dy : usize, content : &T) {
    let location = dy * self.width;
    self.underlying.splice(
      location..location,
      std::iter::repeat(content.clone()).take(self.width),
    );
  }

  pub fn delete_row(&mut self, dy : usize) {
    let location = dy * self.width;
    self
      .underlying
      .splice(location..location + self.width, std::iter::empty());
  }
}

#[test]
fn test_insert_column() {
  let mut sheet = Sheet::pure(1);
  sheet.insert_column(1, &2);
  sheet.insert_column(0, &3);
  assert_eq!(*sheet.get_at(0, 0).unwrap(), 3);
  assert_eq!(*sheet.get_at(1, 0).unwrap(), 1);
  assert_eq!(*sheet.get_at(2, 0).unwrap(), 2);
}

#[test]
fn test_insert_row() {
  let mut sheet = Sheet::pure(1);
  sheet.insert_row(1, &2);
  sheet.insert_row(0, &3);
  assert_eq!(*sheet.get_at(0, 0).unwrap(), 3);
  assert_eq!(*sheet.get_at(0, 1).unwrap(), 1);
  assert_eq!(*sheet.get_at(0, 2).unwrap(), 2);
}

#[test]
fn test_insert_column_row() {
  let mut sheet = Sheet::pure(1);
  sheet.insert_column(1, &2);
  sheet.insert_row(1, &3);
  sheet.insert_column(0, &4);
  sheet.insert_row(1, &5);
  assert_eq!(
    sheet,
    Sheet {
      width : 3,
      #[rustfmt::skip]
      underlying : vec![
        4, 1, 2,
        5, 5, 5,
        4, 3, 3
      ],
    }
  );
}

#[test]
fn test_delete_column_row() {
  let mut sheet = Sheet {
    width : 3,
    #[rustfmt::skip]
    underlying : vec![
      4, 1, 2,
      5, 5, 5,
      4, 3, 3
    ],
  };
  sheet.delete_row(1);
  sheet.delete_column(0);
  sheet.delete_row(1);
  sheet.delete_column(1);
  assert_eq!(sheet, Sheet::pure(1));
}
