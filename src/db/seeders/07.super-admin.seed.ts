import { v4 as uuidv4 } from 'uuid';
import { QueryInterface } from 'sequelize';
import { Role } from '../../shared/enums';
import { SCOPE } from '../../shared/enums';
import * as bycryt from 'bcrypt';

interface MigrationContext {
  context: QueryInterface;
}

export async function up({
  context: queryInterface,
}: MigrationContext): Promise<void> {
  const date = new Date();

  // Get SUPER_ADMIN role ID
  const [roleResults] = await queryInterface.sequelize.query(
    `SELECT id FROM roles WHERE role = '${Role.SUPER_ADMIN}' LIMIT 1`,
  );

  if (!roleResults || roleResults.length === 0) {
    throw new Error(
      'SUPER_ADMIN role not found. Please run the roles seeder first.',
    );
  }

  const roleId = (roleResults[0] as any).id;

  // Get SUPER position ID
  const [positionResults] = await queryInterface.sequelize.query(
    `SELECT id FROM sug_positions WHERE position = 'SUPER' LIMIT 1`,
  );

  if (!positionResults || positionResults.length === 0) {
    throw new Error(
      'SUPER position not found. Please run the sug_positions seeder first.',
    );
  }

  const positionId = (positionResults[0] as any).id;

  // Get Engineering faculty ID
  const [facultyResults] = await queryInterface.sequelize.query(
    `SELECT id FROM faculties WHERE faculty = 'Engineering' LIMIT 1`,
  );

  if (!facultyResults || facultyResults.length === 0) {
    throw new Error(
      'Engineering faculty not found. Please run the faculty seeder first.',
    );
  }

  const facultyId = (facultyResults[0] as any).id;

  // Get Electrical/Electronic Engineering department ID
  const [departmentResults] = await queryInterface.sequelize.query(
    `SELECT id FROM departments WHERE department = 'Electrical/Electronic Engineering' AND faculty_id = '${facultyId}' LIMIT 1`,
  );

  if (!departmentResults || departmentResults.length === 0) {
    throw new Error(
      'Electrical/Electronic Engineering department not found. Please run the department seeder first.',
    );
  }

  const departmentId = (departmentResults[0] as any).id;

  // Get current academic session
  const [sessionResults] = await queryInterface.sequelize.query(
    `SELECT id FROM academic_sessions ORDER BY created_at DESC LIMIT 1`,
  );

  if (!sessionResults || sessionResults.length === 0) {
    throw new Error(
      'No academic session found. Please create an academic session first.',
    );
  }

  const sessionId = (sessionResults[0] as any).id;

  const salt = await bycryt.genSalt(10);

  const hashedPasswod = await bycryt.hash('adminPassword999', salt);

  // First create a SUG Executive for the admin
  const executiveId = uuidv4();

  await queryInterface.bulkInsert('sug_executives', [
    {
      id: executiveId,
      name: 'Super Admin',
      email: 'admin@ndu.edu.ng',
      phone_number: '08000000000',
      matric_number: 'UG/00/0001',
      image_url: 'https://example.com/images/admin.jpg',
      position_id: positionId,
      session_id: sessionId,
      scope: SCOPE.CENTRAL,
      faculty_id: facultyId,
      department_id: departmentId,
      created_at: date,
      updated_at: null,
      deleted_at: null,
    },
  ]);

  // Now create the admin record
  await queryInterface.bulkInsert('admins', [
    {
      id: uuidv4(),
      name: 'Super Admin',
      matric_number: 'UG/00/0001',
      email: 'admin@ndu.edu.ng',
      password: hashedPasswod, // Will be set on first login
      role_id: roleId,
      executive_id: executiveId,
      position_id: positionId,
      faculty_id: facultyId,
      department_id: departmentId,
      scope: SCOPE.CENTRAL,
      must_set_password: false,
      last_login_at: null,
      created_at: date,
      updated_at: null,
      deleted_at: null,
    },
  ]);
}

export async function down({
  context: queryInterface,
}: MigrationContext): Promise<void> {
  // Delete admin first (due to foreign key constraint)
  await queryInterface.bulkDelete('admins', {
    matric_number: 'UG/00/0001',
  });

  // Then delete the associated executive
  await queryInterface.bulkDelete('sug_executives', {
    matric_number: 'UG/00/0001',
  });
}
