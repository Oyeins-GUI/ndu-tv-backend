import { v4 as uuidv4 } from 'uuid';
import { QueryInterface } from 'sequelize';
import { Role } from '../../shared/enums';

interface MigrationContext {
  context: QueryInterface;
}

export async function up({
  context: queryInterface,
}: MigrationContext): Promise<void> {
  const date = new Date();

  await queryInterface.bulkInsert('roles', [
    {
      id: uuidv4(),
      role: Role.SUPER_ADMIN,
      description: 'Administrator with full platform management access',
      created_at: date,
      updated_at: null,
      deleted_at: null,
    },
    {
      id: uuidv4(),
      role: Role.BASIC_ADMIN,
      description: 'Platform Admin with managed acess',
      created_at: date,
      updated_at: null,
      deleted_at: null,
    },
  ]);
}

export async function down({
  context: queryInterface,
}: MigrationContext): Promise<void> {
  await queryInterface.bulkDelete('roles', {});
}
