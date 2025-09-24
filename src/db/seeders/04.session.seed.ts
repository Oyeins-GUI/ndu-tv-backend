import { v4 as uuidv4 } from 'uuid';
import { QueryInterface } from 'sequelize';

interface MigrationContext {
  context: QueryInterface;
}

export async function up({
  context: queryInterface,
}: MigrationContext): Promise<void> {
  const date = new Date();

  await queryInterface.bulkInsert('academic_sessions', [
    {
      id: uuidv4(),
      session: '2024/2025',
      is_current_session: true,
      created_at: date,
      updated_at: null,
      deleted_at: null,
    },
  ]);
}

export async function down({
  context: queryInterface,
}: MigrationContext): Promise<void> {
  await queryInterface.bulkDelete('academic_sessions', {});
}
