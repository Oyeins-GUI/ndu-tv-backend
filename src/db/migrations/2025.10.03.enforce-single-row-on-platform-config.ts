import { QueryInterface } from 'sequelize';

interface MigrationContext {
  context: QueryInterface;
}

export async function up({
  context: queryInterface,
}: MigrationContext): Promise<void> {
  await queryInterface.sequelize.query(`
     CREATE UNIQUE INDEX IF NOT EXISTS one_row_only_uidx ON app_settings ((true));
  `);
}

export async function down({
  context: queryInterface,
}: MigrationContext): Promise<void> {
  await queryInterface.sequelize.query(`
    DROP INDEX one_row_only_uidx;
  `);
}
