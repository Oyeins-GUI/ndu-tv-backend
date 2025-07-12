import { Sequelize } from 'sequelize';
import { Umzug, SequelizeStorage } from 'umzug';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { env } from './src/config';

dotenv.config();

const sequelize = new Sequelize({
  dialect: 'postgres',
  dialectOptions: {
    ...(process.env.NODE_ENV === 'development'
      ? {}
      : {
          ssl: {
            require: false,
            rejectUnauthorized: false,
          },
        }),
  },
  host: env.DB_HOST,
  port: env.PORT,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
});

const umzug = new Umzug({
  migrations: { glob: './src/database/migrations/*.ts' },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
});

const seeder = new Umzug({
  migrations: { glob: './src/database/seeders/*.ts' },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
});

const task = (process.argv[2] || '').trim();
const migrationFile = process.argv[3]; // Add an argument for the specific file

const migrationPath = `./src/database/migrations/${migrationFile}`;
const seederPath = `./src/database/seeders/${migrationFile}`;

// Function to run specific migration file
async function runSpecificMigration(file: string) {
  try {
    const result = await umzug.up({ to: file });
    console.log(`Migration ${file} ran successfully!`, result);
  } catch (error) {
    console.error(`Error running specific migration ${file}:`, error);
  }
}

// Main function to handle all tasks
async function run() {
  try {
    if (migrationFile) {
      // Run a specific migration or seeder file
      if (fs.existsSync(migrationPath)) {
        await runSpecificMigration(migrationFile);
      } else if (fs.existsSync(seederPath)) {
        await seeder.up({ to: migrationFile });
      }
    } else {
      switch (task) {
        case 'up':
          await umzug.up();
          console.log('Migrations up successful!');
          break;
        case 'down':
          await umzug.down();
          console.log('Migrations down successful!');
          break;
        case 'reset':
          await umzug.down({ to: '0' as const });
          console.log('Migrations reset successful!');
          break;
        case 'seed-up':
          await seeder.up();
          console.log('Seeder up successful!');
          break;
        case 'seed-down':
          await seeder.down();
          console.log('Seeder down successful!');
          break;
        case 'seed-reset':
          await seeder.down({ to: '0' as const });
          console.log('Seeder reset successful!');
          break;
        default:
          console.log('Invalid command');
          break;
      }
    }
  } catch (error) {
    console.error('Migration error:', error);
  } finally {
    process.exit(0);
  }
}

run();
