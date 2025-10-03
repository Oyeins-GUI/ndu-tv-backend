import { QueryInterface, DataTypes } from 'sequelize';

interface MigrationContext {
  context: QueryInterface;
}

export async function up({
  context: queryInterface,
}: MigrationContext): Promise<void> {
  await queryInterface.addColumn('admins', 'is_admin_enabled', {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  });
}

export async function down({
  context: queryInterface,
}: MigrationContext): Promise<void> {
  await queryInterface.removeColumn('admins', 'is_admin_enabled');
}
