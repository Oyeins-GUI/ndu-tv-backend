import { v4 as uuidv4 } from 'uuid';
import { QueryInterface } from 'sequelize';

interface MigrationContext {
  context: QueryInterface;
}

export async function up({
  context: queryInterface,
}: MigrationContext): Promise<void> {
  const date = new Date();

  await queryInterface.bulkInsert('sug_positions', [
    {
      id: uuidv4(),
      position: 'PRES',
      title: 'President',
      description:
        'The chief executive officer of the Student Union Government, responsible for overall leadership, representation of student interests, and coordination of all SUG activities.',
      created_at: date,
      updated_at: null,
      deleted_at: null,
    },
    {
      id: uuidv4(),
      position: 'VP',
      title: 'Vice President',
      description:
        'Second in command to the President, assists in executive functions, represents the President in their absence, and oversees specific assigned portfolios.',
      created_at: date,
      updated_at: null,
      deleted_at: null,
    },
    {
      id: uuidv4(),
      position: 'SEC_GEN',
      title: 'Secretary General',
      description:
        'Chief administrative officer responsible for maintaining official records, coordinating meetings, handling correspondence, and ensuring proper documentation of SUG activities.',
      created_at: date,
      updated_at: null,
      deleted_at: null,
    },
    {
      id: uuidv4(),
      position: 'TREAS',
      title: 'Treasurer',
      description:
        'Financial custodian responsible for managing SUG funds, overseeing budget implementation, financial reporting, and ensuring transparent financial management.',
      created_at: date,
      updated_at: null,
      deleted_at: null,
    },
    {
      id: uuidv4(),
      position: 'FIN_SEC',
      title: 'Financial Secretary',
      description:
        'Assistant to the Treasurer, responsible for maintaining financial records, processing payments, receipts documentation, and supporting budget planning activities.',
      created_at: date,
      updated_at: null,
      deleted_at: null,
    },
    {
      id: uuidv4(),
      position: 'ASST_SEC_GEN',
      title: 'Assistant Secretary General',
      description:
        "Supports the Secretary General in administrative duties, assists with meeting coordination, record keeping, and handles secretarial responsibilities in the Secretary General's absence.",
      created_at: date,
      updated_at: null,
      deleted_at: null,
    },
    {
      id: uuidv4(),
      position: 'PRO',
      title: 'Public Relations Officer',
      description:
        'Chief spokesperson for the SUG, manages public communications, media relations, publicity for events, and serves as the primary interface between SUG and external stakeholders.',
      created_at: date,
      updated_at: null,
      deleted_at: null,
    },
    {
      id: uuidv4(),
      position: 'DIR_WELFARE',
      title: 'Director of Welfare',
      description:
        'Responsible for student welfare matters, advocacy for student rights, addressing accommodation issues, health concerns, and ensuring overall student wellbeing on campus.',
      created_at: date,
      updated_at: null,
      deleted_at: null,
    },
    {
      id: uuidv4(),
      position: 'DIR_SPORTS',
      title: 'Director of Sports',
      description:
        'Oversees all sporting activities, coordinates inter-faculty competitions, manages sports facilities, organizes tournaments, and promotes sports development within the institution.',
      created_at: date,
      updated_at: null,
      deleted_at: null,
    },
    {
      id: uuidv4(),
      position: 'DIR_SOCIALS',
      title: 'Director of Socials',
      description:
        'Plans and coordinates social events, cultural activities, entertainment programs, manages social media presence, and enhances campus social life and student engagement.',
      created_at: date,
      updated_at: null,
      deleted_at: null,
    },
    {
      id: uuidv4(),
      position: 'PROVOST',
      title: 'Provost',
      description:
        'Senior academic representative responsible for academic affairs, liaison with faculty administration, student academic advocacy, and bridging the gap between students and academic management.',
      created_at: date,
      updated_at: null,
      deleted_at: null,
    },
    {
      id: uuidv4(),
      position: 'SUPER',
      title: 'Super Admin',
      description:
        'Technical administrative position with full system access rights, responsible for platform management, user administration, system maintenance, and development oversight for digital SUG operations.',
      created_at: date,
      updated_at: null,
      deleted_at: null,
    },
  ]);
}

export async function down({
  context: queryInterface,
}: MigrationContext): Promise<void> {
  await queryInterface.bulkDelete('sug_positions', {});
}
