import { QueryInterface } from 'sequelize';
import { DataType } from 'sequelize-typescript';
import { ExecType } from '../../shared/enums/execs.enum';

interface MigrationContext {
  context: QueryInterface;
}

export async function up({
  context: queryInterface,
}: MigrationContext): Promise<void> {
  await queryInterface.addColumn('nans_executives', 'exec_type', {
    type: DataType.ENUM(...Object.values(ExecType)),
    allowNull: false,
  });
}

export async function down({
  context: queryInterface,
}: MigrationContext): Promise<void> {
  await queryInterface.removeColumn('nans_executives', 'exec_type');
}
