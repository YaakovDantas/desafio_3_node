import { getRepository, getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Category from '../models/Category';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const categoryRepository = await getRepository(Category);
    const repository = await getCustomRepository(TransactionsRepository);
    const balance = await repository.getBalance();

    if (type === 'outcome' && value > balance.total) {
      throw new AppError('Outcome transaction without a valid balance', 400);
    }

    let searched_category = await categoryRepository.findOne({
      where: { title: category },
    });

    if (!searched_category) {
      searched_category = await categoryRepository.create({ title: category });
      searched_category = await categoryRepository.save(searched_category);
    }

    const transaction = repository.create({
      title,
      value,
      type,
      category_id: searched_category.id,
    });

    await repository.save(transaction);
    return transaction;
  }
}

export default CreateTransactionService;
