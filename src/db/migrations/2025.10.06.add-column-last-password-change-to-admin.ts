import { QueryInterface, DataTypes } from 'sequelize';

interface MigrationContext {
  context: QueryInterface;
}

export async function up({
  context: queryInterface,
}: MigrationContext): Promise<void> {
  await queryInterface.addColumn('admins', 'last_password_change', {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null,
  });
}

export async function down({
  context: queryInterface,
}: MigrationContext): Promise<void> {
  await queryInterface.removeColumn('admins', 'last_password_change');
}
