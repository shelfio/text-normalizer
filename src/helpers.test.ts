import { removeSymbolsAndDiacritics } from './helpers';

describe('removeSymbolsAndDiacritics', () => {
  it('removes symbols and diacritics from text', () => {
    expect(removeSymbolsAndDiacritics('Café!')).toEqual('Cafe ');
    expect(removeSymbolsAndDiacritics('résûmé')).toEqual('resume');
    expect(removeSymbolsAndDiacritics('Jalapeño')).toEqual('Jalapeno');
    expect(removeSymbolsAndDiacritics('Zoë')).toEqual('Zoe');
    expect(removeSymbolsAndDiacritics('ėlo')).toEqual('elo');
  });
  it('should remove symbols but keep one', () => {
    expect(removeSymbolsAndDiacritics('résûmé')).toEqual('resume');
  })
});
