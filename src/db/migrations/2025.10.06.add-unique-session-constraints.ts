import { QueryInterface, DataTypes } from 'sequelize';

interface MigrationContext {
  context: QueryInterface;
}

export async function up({
  context: queryInterface,
}: MigrationContext): Promise<void> {
  // Add the check constraint to ensure only one of current or next can be true at the same time
  await queryInterface.sequelize.query(`
    ALTER TABLE academic_sessions
    ADD CONSTRAINT chk_current_next_session
    CHECK (NOT (is_current_session AND is_next_session))
  `);
}

export async function down({
  context: queryInterface,
}: MigrationContext): Promise<void> {
  // Remove the check constraint
  await queryInterface.sequelize.query(`
    ALTER TABLE academic_sessions
    DROP CONSTRAINT IF EXISTS chk_current_next_session
  `);
}
