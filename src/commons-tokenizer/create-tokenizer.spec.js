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

const uNdefined = [{ name: 'code', rules: 'soft' }];

describe('tokenizer', function () {
  it('count 2', function () {
    const tokenizer = createTokenizer(fields);
    const tokens = tokenizer({ libelle: 'commerce commerce' });

    expect(Array.isArray(tokens)).toBe(true);
    expect(typeof tokens[0]).toBe('object');
    expect(tokens.length).toBe(1);
    expect(tokens[0].value).toBe('commerc');
    expect(tokens[0].count).toBe(2);
  });

  it('count 2 with 2 token', function () {
    const tokenizer = createTokenizer(fields);
    const tokens = tokenizer({ libelle: 'commerce commerce tabac' });

    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBe(2);

    expect(tokens[0].value).toBe('commerc');
    expect(tokens[0].count).toBe(2);

    expect(tokens[1].value).toBe('tabac');
    expect(tokens[1].count).toBe(1);
  });

  it('soft field', function () {
    const tokenizer = createTokenizer(soft);

    const tokens = tokenizer({ code: "10éA,2'3.1" });
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBe(1);

    expect(tokens[0].value).toBe('10ea,2-3.1');
    expect(tokens[0].count).toBe(1);
  });

  it('undefined', function () {
    const tokenizer = createTokenizer(uNdefined);

    const tokens = tokenizer({ code: "10éA,2'3.1" });
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBe(1);

    expect(tokens[0].value).toBe('10ea,2-3.1');
    expect(tokens[0].count).toBe(1);
  });
});
