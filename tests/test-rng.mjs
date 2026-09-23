import { suite, test, ok, eq, ne, ge, le, throws } from './harness.mjs';
import { makeRng, hashString } from '../src/engine/rng.js';

suite('ГПСЧ');

test('один и тот же сид даёт одну и ту же последовательность', () => {
  const a = makeRng('привет'), b = makeRng('привет');
  for (let i = 0; i < 50; i++) eq(a.next(), b.next(), `шаг ${i}`);
});

test('разные сиды дают разные последовательности', () => {
  const a = makeRng('A'), b = makeRng('B');
  const seqA = Array.from({ length: 8 }, () => a.next());
  const seqB = Array.from({ length: 8 }, () => b.next());
  ne(JSON.stringify(seqA), JSON.stringify(seqB));
});

test('значения в диапазоне [0,1)', () => {
  const r = makeRng(12345);
  for (let i = 0; i < 5000; i++) { const v = r.next(); ge(v, 0); le(v, 1 - 1e-12); }
});

test('int(n) не выходит за границы', () => {
  const r = makeRng('x');
  for (let i = 0; i < 2000; i++) { const v = r.int(7); ge(v, 0); le(v, 6); }
});

test('shuffle — перестановка, а не потеря элементов', () => {
  const r = makeRng('shuffle');
  const src = Array.from({ length: 40 }, (_, i) => i);
  const out = r.shuffle(src);
  eq(out.length, src.length);
  deepEqSorted(out, src);
});

test('shuffle детерминирован и действительно перемешивает', () => {
  const src = Array.from({ length: 30 }, (_, i) => i);
  const a = makeRng('s').shuffle(src);
  const b = makeRng('s').shuffle(src);
  eq(JSON.stringify(a), JSON.stringify(b));
  ne(JSON.stringify(a), JSON.stringify(src));
});

test('fork даёт независимый поток, но воспроизводимый', () => {
  const a = makeRng('root').fork('tag');
  const b = makeRng('root').fork('tag');
  eq(a.next(), b.next());
});

test('weighted уважает нулевой вес', () => {
  const r = makeRng('w');
  const items = ['a', 'b', 'c'];
  for (let i = 0; i < 200; i++) eq(r.weighted(items, (x) => (x === 'b' ? 1 : 0)), 'b');
});

test('hashString стабилен и различает строки', () => {
  eq(hashString('abc'), hashString('abc'));
  ne(hashString('abc'), hashString('abd'));
});

function deepEqSorted(a, b) {
  const A = a.slice().sort((x, y) => x - y);
  const B = b.slice().sort((x, y) => x - y);
  eq(JSON.stringify(A), JSON.stringify(B));
}
