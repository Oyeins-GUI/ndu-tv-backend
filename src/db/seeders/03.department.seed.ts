import { v4 as uuidv4 } from 'uuid';
import { QueryInterface } from 'sequelize';
import { Faculty } from '../models/faculties.model';

interface MigrationContext {
  context: QueryInterface;
}

export async function up({
  context: queryInterface,
}: MigrationContext): Promise<void> {
  const date = new Date();

  // First, get the Engineering faculty ID
  const [engineeringFaculty] = await queryInterface.sequelize.query(
    `SELECT id FROM faculties WHERE faculty = 'Engineering' LIMIT 1`,
  );

  if (!engineeringFaculty || engineeringFaculty.length === 0) {
    throw new Error(
      'Engineering faculty not found. Please run the faculty seeder first.',
    );
  }

  const facultyId = (engineeringFaculty[0] as any).id;

  await queryInterface.bulkInsert('departments', [
    {
      id: uuidv4(),
      department: 'Agricultural and Environmental Engineering',
      faculty_id: facultyId,
      created_at: date,
      updated_at: null,
      deleted_at: null,
    },
    {
      id: uuidv4(),
      department: 'Chemical Engineering',
      faculty_id: facultyId,
      created_at: date,
      updated_at: null,
      deleted_at: null,
    },
    {
      id: uuidv4(),
      department: 'Electrical/Electronic Engineering',
      faculty_id: facultyId,
      created_at: date,
      updated_at: null,
      deleted_at: null,
    },
    {
      id: uuidv4(),
      department: 'Marine Engineering',
      faculty_id: facultyId,
      created_at: date,
      updated_at: null,
      deleted_at: null,
    },
    {
      id: uuidv4(),
      department: 'Civil Engineering',
      faculty_id: facultyId,
      created_at: date,
      updated_at: null,
      deleted_at: null,
    },
    {
      id: uuidv4(),
      department: 'Mechanical Engineering',
      faculty_id: facultyId,
      created_at: date,
      updated_at: null,
      deleted_at: null,
    },
    {
      id: uuidv4(),
      department: 'Petroleum Engineering',
      faculty_id: facultyId,
      created_at: date,
      updated_at: null,
      deleted_at: null,
    },
  ]);
}

export async function down({
  context: queryInterface,
}: MigrationContext): Promise<void> {
  // Get Engineering faculty ID for cleanup
  const [engineeringFaculty] = await queryInterface.sequelize.query(
    `SELECT id FROM faculties WHERE faculty = 'Engineering' LIMIT 1`,
  );
  if (engineeringFaculty && engineeringFaculty.length > 0) {
    const facultyId = (engineeringFaculty[0] as any).id;
    await queryInterface.bulkDelete('departments', {
      faculty_id: facultyId,
    });
  }
}
