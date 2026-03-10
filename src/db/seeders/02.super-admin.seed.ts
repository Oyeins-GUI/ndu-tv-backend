import { v4 as uuidv4 } from 'uuid';
import { QueryInterface } from 'sequelize';
import { Role } from '../../shared/enums';
import * as bcrypt from 'bcrypt';

interface MigrationContext {
  context: QueryInterface;
}

export async function up({
  context: queryInterface,
}: MigrationContext): Promise<void> {
  const date = new Date();

  const [roles] = await queryInterface.sequelize.query(
    `SELECT id FROM roles WHERE role = '${Role.SUPER_ADMIN}' LIMIT 1`,
  );

  const superAdminRole = roles[0] as { id: string };

  if (!superAdminRole)
    throw new Error('Super admin role not found, run role seeder first');

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(
    process.env.SUPER_ADMIN_PASSWORD || '123@builder',
    salt,
  );

  await queryInterface.bulkInsert('admins', [
    {
      id: uuidv4(),
      name: 'Super Admin',
      email: process.env.SUPER_ADMIN_EMAIL || 'superadmin@gmail.com',
      password: hashedPassword,
      role_id: superAdminRole.id,
      must_set_password: false,
      is_admin_enabled: true,
      last_login_at: null,
      last_password_change: null,
      created_at: date,
      updated_at: null,
      deleted_at: null,
    },
  ]);
}

export async function down({
  context: queryInterface,
}: MigrationContext): Promise<void> {
  await queryInterface.bulkDelete('admins', {
    email: process.env.SUPER_ADMIN_EMAIL || 'superadmin@gmail.com',
  });
}
