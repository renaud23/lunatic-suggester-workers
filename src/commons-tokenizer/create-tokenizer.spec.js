import { ExpectationFailed } from 'http-errors';
import createTokenizer from './create-tokenizer';

const fields = [
  {
    name: 'libelle',
    rules: ['[\\w]+'],
    language: 'French',
    min: 3,
  },
];

const soft = [{ name: 'code', rules: 'soft' }];

const uNdefined = [{ name: 'code' }];

describe('tokenizer', function () {
  it('count 2', function () {
    const tokenizer = createTokenizer(fields);
    const tokens = tokenizer({ libelle: 'commerce commerce' });

    expect(typeof tokens).toBe('object');
    const entries = Object.entries(tokens);
    expect(entries.length).toBe(1);
    const [value, count] = entries[0];
    expect(value).toBe('commerc');
    expect(count).toBe(2);
  });

  it('count 2 with 2 token', function () {
    const tokenizer = createTokenizer(fields);
    const tokens = tokenizer({ libelle: 'commerce commerce tabac' });

    expect(typeof tokens).toBe('object');
    const entries = Object.entries(tokens);
    expect(entries.length).toBe(2);
    const [value, count] = entries[0];
    expect(value).toBe('commerc');
    expect(count).toBe(2);
    const [value2, count2] = entries[1];
    expect(value2).toBe('tabac');
    expect(count2).toBe(1);
  });

  it('soft field', function () {
    const tokenizer = createTokenizer(soft);

    const tokens = tokenizer({ code: "10éA,2'3.1" });
    const entries = Object.entries(tokens);
    expect(entries.length).toBe(1);
    const [value, count] = entries[0];
    expect(value).toBe('10ea,2-3.1');
    expect(count).toBe(1);
  });

  it('undefined', function () {
    const tokenizer = createTokenizer(uNdefined);
    const tokens = tokenizer({ code: "10éA,2'3.1" });
    const entries = Object.entries(tokens);
    expect(entries.length).toBe(1);
    // expect(value).toBe('10ea,2-3.1');
    // expect(count).toBe(1);
  });
});
