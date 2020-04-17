import csv from 'csvtojson';
import path from 'path';
import uploadConfig from '../config/upload';
import CreateTransactionService from './CreateTransactionService';

interface Request {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class ImportTransactionsService {
  async execute(fileName: string): Promise<Request[]> {
    const createTransactionService = new CreateTransactionService();

    const filePath = path.join(uploadConfig.directory, fileName);

    const transactions = await csv().fromFile(filePath);

    async function handleTransactions(
      transactionArray: Request[],
    ): Promise<void> {
      for (const transaction of transactionArray) {
        await createTransactionService.execute(transaction);
      }
    }

    await handleTransactions(transactions);
    return transactions;
  }
}

export default ImportTransactionsService;
