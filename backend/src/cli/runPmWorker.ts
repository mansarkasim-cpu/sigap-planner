import 'reflect-metadata';
import { AppDataSource } from '../ormconfig';
import pmService from '../services/pmService';

async function main() {
  try {
    await AppDataSource.initialize();
    console.log('DB initialized — running PM update');
    const res = await pmService.updateEquipmentStatusAll();
    console.log('PM update finished, items:', res.length);
    process.exit(0);
  } catch (err) {
    console.error('runPmWorker error', err);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
