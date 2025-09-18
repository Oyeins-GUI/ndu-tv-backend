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
      role: Role.SUPER_ADMIN,
      description: 'Administrator with full platform management access',
    },
    {
      role: Role.CENTRAL_EXEC,
      description:
        'Moderator with content and user management privileges for entire tv',
    },
    {
      role: Role.FACULTY_EXEC,
      description:
        'Moderator with content and user management privileges for Facutly level',
    },
    {
      role: Role.DEPARTMENT_EXEC,
      description:
        'Moderator with content and user management privileges for Department level',
    },
  ]);
}

export async function down({
  context: queryInterface,
}: MigrationContext): Promise<void> {
  await queryInterface.bulkDelete('roles', {});
}
