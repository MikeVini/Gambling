import { Transaction } from './transaction.entity';

describe('Transaction', () => {
  it('should be defined', () => {
    expect(new Transaction()).toBeDefined();
  });
});
