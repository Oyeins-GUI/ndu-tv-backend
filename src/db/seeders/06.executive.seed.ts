import { v4 as uuidv4 } from 'uuid';
import { QueryInterface } from 'sequelize';
import { SCOPE } from '../../shared/enums';

interface MigrationContext {
  context: QueryInterface;
}

export async function up({
  context: queryInterface,
}: MigrationContext): Promise<void> {
  const date = new Date();

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

  // Get current academic session (assuming there's at least one)
  const [sessionResults] = await queryInterface.sequelize.query(
    `SELECT id FROM academic_sessions ORDER BY created_at DESC LIMIT 1`,
  );

  if (!sessionResults || sessionResults.length === 0) {
    throw new Error(
      'No academic session found. Please create an academic session first.',
    );
  }

  const sessionId = (sessionResults[0] as any).id;

  // Get SUG positions (assuming they exist)
  const [positionResults] = await queryInterface.sequelize.query(
    `SELECT id, position FROM sug_positions LIMIT 5`,
  );

  if (!positionResults || positionResults.length === 0) {
    throw new Error(
      'No SUG positions found. Please run the SUG positions seeder first.',
    );
  }

  // Create sample executives with different scopes
  const executives = [
    {
      id: uuidv4(),
      name: 'John Doe',
      email: 'john.doe@ndu.edu.ng',
      phone_number: '08012345678',
      matric_number: 'UG/00/1111',
      image_url: 'https://example.com/images/john-doe.jpg',
      position_id: (positionResults[0] as any).id,
      session_id: sessionId,
      scope: SCOPE.CENTRAL,
      faculty_id: facultyId,
      department_id: departmentId,
      created_at: date,
      updated_at: null,
      deleted_at: null,
    },
    {
      id: uuidv4(),
      name: 'Jane Smith',
      email: 'jane.smith@ndu.edu.ng',
      phone_number: '08087654321',
      matric_number: 'UG/00/2222',
      image_url: 'https://example.com/images/jane-smith.jpg',
      position_id:
        positionResults.length > 1
          ? (positionResults[1] as any).id
          : (positionResults[0] as any).id,
      session_id: sessionId,
      scope: SCOPE.FACULTY,
      faculty_id: facultyId,
      department_id: departmentId,
      created_at: date,
      updated_at: null,
      deleted_at: null,
    },
    {
      id: uuidv4(),
      name: 'Mike Johnson',
      email: 'mike.johnson@ndu.edu.ng',
      phone_number: '08098765432',
      matric_number: 'UG/00/3333',
      image_url: 'https://example.com/images/mike-johnson.jpg',
      position_id:
        positionResults.length > 2
          ? (positionResults[2] as any).id
          : (positionResults[0] as any).id,
      session_id: sessionId,
      scope: SCOPE.DEPARTMENT,
      faculty_id: facultyId,
      department_id: departmentId,
      created_at: date,
      updated_at: null,
      deleted_at: null,
    },
    {
      id: uuidv4(),
      name: 'Sarah Williams',
      email: 'sarah.williams@ndu.edu.ng',
      phone_number: '08076543210',
      matric_number: 'UG/00/4444',
      image_url: 'https://example.com/images/sarah-williams.jpg',
      position_id:
        positionResults.length > 3
          ? (positionResults[3] as any).id
          : (positionResults[0] as any).id,
      session_id: sessionId,
      scope: SCOPE.CENTRAL,
      faculty_id: facultyId,
      department_id: departmentId,
      created_at: date,
      updated_at: null,
      deleted_at: null,
    },
    {
      id: uuidv4(),
      name: 'David Brown',
      email: 'david.brown@ndu.edu.ng',
      phone_number: '08065432109',
      matric_number: 'UG/00/5555',
      image_url: 'https://example.com/images/david-brown.jpg',
      position_id:
        positionResults.length > 4
          ? (positionResults[4] as any).id
          : (positionResults[0] as any).id,
      session_id: sessionId,
      scope: SCOPE.FACULTY,
      faculty_id: facultyId,
      department_id: departmentId,
      created_at: date,
      updated_at: null,
      deleted_at: null,
    },
  ];

  await queryInterface.bulkInsert('sug_executives', executives);
}

export async function down({
  context: queryInterface,
}: MigrationContext): Promise<void> {
  await queryInterface.bulkDelete('sug_executives', {});
}
