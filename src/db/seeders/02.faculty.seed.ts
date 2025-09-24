import { v4 as uuidv4 } from 'uuid';
import { QueryInterface } from 'sequelize';

interface MigrationContext {
  context: QueryInterface;
}

export async function up({
  context: queryInterface,
}: MigrationContext): Promise<void> {
  const date = new Date();

  await queryInterface.bulkInsert('faculties', [
    {
      id: uuidv4(),
      faculty: 'Admin',
      created_at: date,
      updated_at: null,
      deleted_at: null,
    },
    {
      id: uuidv4(),
      faculty: 'Arts',
      created_at: date,
      updated_at: null,
      deleted_at: null,
    },
    {
      id: uuidv4(),
      faculty: 'Agriculture',
      created_at: date,
      updated_at: null,
      deleted_at: null,
    },
    {
      id: uuidv4(),
      faculty: 'Basic Medical Sciences',
      created_at: date,
      updated_at: null,
      deleted_at: null,
    },
    {
      id: uuidv4(),
      faculty: 'Engineering',
      created_at: date,
      updated_at: null,
      deleted_at: null,
    },
    {
      id: uuidv4(),
      faculty: 'Education',
      created_at: date,
      updated_at: null,
      deleted_at: null,
    },
    {
      id: uuidv4(),
      faculty: 'Environmental Sciences',
      created_at: date,
      updated_at: null,
      deleted_at: null,
    },
    {
      id: uuidv4(),
      faculty: 'Law',
      created_at: date,
      updated_at: null,
      deleted_at: null,
    },
    {
      id: uuidv4(),
      faculty: 'Science',
      created_at: date,
      updated_at: null,
      deleted_at: null,
    },
    {
      id: uuidv4(),
      faculty: 'Management Sciences',
      created_at: date,
      updated_at: null,
      deleted_at: null,
    },
    {
      id: uuidv4(),
      faculty: 'Nursing Sciences',
      created_at: date,
      updated_at: null,
      deleted_at: null,
    },
    {
      id: uuidv4(),
      faculty: 'Pharmacy',
      created_at: date,
      updated_at: null,
      deleted_at: null,
    },
    {
      id: uuidv4(),
      faculty: 'Social Sciences',
      created_at: date,
      updated_at: null,
      deleted_at: null,
    },
  ]);
}

export async function down({
  context: queryInterface,
}: MigrationContext): Promise<void> {
  await queryInterface.bulkDelete('faculties', {});
}
