import { Sequelize } from 'sequelize';
import { Umzug, SequelizeStorage } from 'umzug';
import * as dotenv from 'dotenv';
import * as fs from 'node:fs';

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
  host: process.env.DB_HOST as string,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
  database: process.env.DB_NAME as string,
});

const migration = new Umzug({
  migrations: { glob: './src/db/migrations/*.ts' },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
});

const seeder = new Umzug({
  migrations: { glob: './src/db/seeders/*.ts' },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
});

const task = (process.argv[2] || '').trim();
const migrationFile = process.argv[3]; // Add an argument for the specific file

const migrationPath = `./src/db/migrations/${migrationFile}`;
const seederPath = `./src/db/seeders/${migrationFile}`;

// Function to run specific migration file
async function runSpecificMigration(file: string) {
  try {
    const result = await migration.up({ to: file });
    console.log(`Migration ${file} ran successfully!`, result);
  } catch (error) {
    console.error(`Error running specific migration ${file}:`, error);
  }
}

async function createMigration(name: string) {
  try {
    const result = await migration.create({
      name: name,
      folder: './src/db/migrations',
      prefix: 'DATE',
    });
    console.log(`Migration file created successfully`);
  } catch (error) {
    console.error(`Error creating migration file:`, error);
  }
}

async function createSeeder(name: string) {
  try {
    const result = await seeder.create({
      name: name,
      folder: './src/db/seeders',
      prefix: 'NONE',
    });
    console.log(`Seeder file created successfully`);
  } catch (error) {
    console.error(`Error creating seeder file:`, error);
  }
}

// Main function to handle all tasks
async function run() {
  try {
    if (
      migrationFile &&
      task != 'seeder-create' &&
      task != 'migration-create'
    ) {
      // Run a specific migration or seeder file
      if (fs.existsSync(migrationPath)) {
        await runSpecificMigration(migrationFile);
      } else if (fs.existsSync(seederPath)) {
        const result = await seeder.up({ to: migrationFile });
        console.log(`Seeder ${migrationFile} ran successfully!`, result);
      }
    } else {
      switch (task) {
        case 'up':
          await migration.up();
          console.log('Migrations up successful!');
          break;
        case 'down':
          await migration.down();
          console.log('Migrations down successful!');
          break;
        case 'reset':
          await migration.down({ to: '0' as const });
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
        case 'seeder-create':
          await createSeeder(migrationFile);
          break;
        case 'migration-create':
          await createMigration(migrationFile);
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
