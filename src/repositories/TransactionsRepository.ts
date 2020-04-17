/* eslint-disable no-param-reassign */
import { EntityRepository, Repository, getRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const income = transactions.reduce((total, transaction) => {
      return (total += transaction.type === 'income' ? transaction.value : 0);
    }, 0);

    const outcome = transactions.reduce((total, transaction) => {
      return (total += transaction.type === 'outcome' ? transaction.value : 0);
    }, 0);

    return { income, outcome, total: income - outcome };
  }

  public async getTransactions(): Promise<Transaction[]> {
    const transactions = await this.find({ relations: ['category'] });

    transactions.forEach((item: Transaction) => {
      delete item.created_at;
      delete item.updated_at;
      delete item.category_id;
      delete item.category.created_at;
      delete item.category.updated_at;
    });

    return transactions;
  }
}

export default TransactionsRepository;
