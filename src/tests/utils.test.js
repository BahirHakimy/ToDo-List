import { sortObjectArray } from '../modules/utils';

const objArray = [
  { order: 2 },
  { order: 4 },
  { order: 5 },
  { order: 3 },
  { order: 1 },
  { order: 6 },
];

test('functions sorts unsorted array correctly', () => {
  const sorted = sortObjectArray(objArray, 'order');
  expect(sorted[0].order).toBe(1);
});
