import { QueryInterface, DataTypes } from 'sequelize';

interface MigrationContext {
  context: QueryInterface;
}

export async function up({
  context: queryInterface,
}: MigrationContext): Promise<void> {
  await queryInterface.addColumn('academic_sessions', 'is_next_session', {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  });
}

export async function down({
  context: queryInterface,
}: MigrationContext): Promise<void> {
  await queryInterface.removeColumn('academic_sessions', 'is_next_session');
}
