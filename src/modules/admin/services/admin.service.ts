// import { Inject } from '@nestjs/common';
// import { CustomLogger } from '../../../lib/logger/logger.service';
// import { IAdminRepository } from '../interfaces/admin-repository.interface';
// import { AddAdminInput, IAdminService } from '../interfaces/admin.interface';
// import { AdminDto } from '../dtos/admin.dto';
// import {
//   CreateDepartmentInput,
//   IDepartmentRepository,
//   UpdateDepartmentInput,
// } from '../interfaces/department-repository.interface';
// import {
//   CreateFacultyInput,
//   IFacultyRepository,
//   UpdateFacultyInput,
// } from '../interfaces/faculty-repository.interface';
// import {
//   CreateSugExecutiveInput,
//   ISugExecutiveRepository,
//   UpdateSugExecutiveInput,
// } from '../interfaces/sug-executive-repository.interface';
// import { NotFoundException } from '../../../shared/exceptions';
// import { RESPONSE_MESSAGES } from '../../../shared/responses/response-messages';
// import { IRoleRepository } from '../interfaces/role-repository.interface';
// import { IAcademicSessionRepository } from '../interfaces/academic-session-repository.interface';
// import { ISugPositionRepository } from '../interfaces/position-repository.interface';
// import { DepartmentDto, FacultyDto, SugExecutiveDto } from '../dtos/common.dto';
// import { IEmailService } from '../../../lib/email/email.interface';
// import { JwtService } from '@nestjs/jwt';
// import { JWT_CONSTANTS } from '../../../auth/constants';
// import { env } from '../../../config';
// import {
//   TEMPLATE_NAMES,
//   TEMPLATE_SUBJECTS,
// } from '../../../lib/email/templates';
// import { IRedisCacheService } from '../../../lib/redis/redis.interface';
// import { getTokenKey } from '../../../auth/auth.utils';
// import { generateRandomToken } from '../../../lib/utils';

// export class AdminService implements IAdminService {
//   constructor(
//     private readonly logger: CustomLogger,
//     @Inject('IAdminRepository')
//     private readonly adminRepository: IAdminRepository,

//     @Inject('IDepartmentRepository')
//     private readonly departmentRepository: IDepartmentRepository,

//     @Inject('IFacultyRepository')
//     private readonly facultyRepository: IFacultyRepository,

//     @Inject('ISugExecutiveRepository')
//     private readonly sugExecutiveRepository: ISugExecutiveRepository,

//     @Inject('IRoleRepository')
//     private readonly roleRepository: IRoleRepository,

//     @Inject('IAcademicSessionRepository')
//     private readonly academicSessionRepository: IAcademicSessionRepository,

//     @Inject('ISugPositionRepository')
//     private readonly sugPositionRepository: ISugPositionRepository,

//     @Inject('IEmailService')
//     private readonly emailService: IEmailService,

//     @Inject('IRedisCacheService')
//     private readonly redisCacheService: IRedisCacheService,

//     private readonly jwtService: JwtService,
//   ) {
//     this.logger.setContext(AdminService.name);
//   }

//   public async addExecutive(data: CreateSugExecutiveInput): Promise<any> {
//     try {
//       const [department, session, faculty, position] = await Promise.all([
//         this.departmentRepository.findByPk(data.department_id),
//         this.academicSessionRepository.findByPk(data.session_id),
//         this.facultyRepository.findByPk(data.faculty_id),
//         this.sugPositionRepository.findByPk(data.position_id),
//       ]);

//       if (!faculty || !department || !session || !position) {
//         throw new NotFoundException({
//           reason: !faculty
//             ? RESPONSE_MESSAGES.Faculty.Failure.NotFound
//             : !department
//               ? RESPONSE_MESSAGES.Department.Failure.NotFound
//               : !session
//                 ? RESPONSE_MESSAGES.AcademicSession.Failure.NotFound
//                 : RESPONSE_MESSAGES.SugPosition.Failure.NotFound,
//         });
//       }

//       const executive = await this.sugExecutiveRepository.create(data);

//       return new SugExecutiveDto(executive);
//     } catch (error) {
//       this.logger.logServiceError(this.addExecutive.name, error, { data });
//       throw error;
//     }
//   }

//   public async addAdmin(data: AddAdminInput): Promise<AdminDto> {
//     try {
//       const [executive, role] = await Promise.all([
//         this.sugExecutiveRepository.findByPk(data.executive_id, {
//           relations: ['department', 'faculty'],
//         }),
//         this.roleRepository.findByPk(data.role_id),
//       ]);

//       if (!executive) {
//         throw new NotFoundException({
//           reason: RESPONSE_MESSAGES.SugExecutive.Failure.NotFound,
//           details: {
//             executive_id: data.executive_id,
//           },
//         });
//       }

//       if (!role) {
//         throw new NotFoundException({
//           reason: RESPONSE_MESSAGES.Role.Failure.NotFound,
//           details: {
//             executive_id: role,
//           },
//         });
//       }

//       const admin = await this.adminRepository.create({
//         ...executive,
//         must_set_password: true,
//         executive_id: executive.id,
//         role_id: role.id,
//       });

//       const payload = {
//         id: admin.id,
//       };

//       const token = await this.jwtService.signAsync(payload, {
//         secret: JWT_CONSTANTS.accessSecret,
//         expiresIn: JWT_CONSTANTS.accessExpiry,
//       });

//       const randomToken = generateRandomToken();

//       const tokenKey = getTokenKey('activate-account', randomToken);

//       const ttl = 60 * 60 * 24 * 7; //7 days for token expiry

//       await this.redisCacheService.setString(tokenKey, token, ttl);

//       await this.emailService.sendMail({
//         template: TEMPLATE_NAMES.activateAccount,
//         to: admin.email,
//         subject: TEMPLATE_SUBJECTS.activateAccount,
//         context: {
//           name: admin.name,
//           role: role.role,
//           department: executive.department,
//           faculty: executive.faculty,
//           action_url: `${env.FRONTEND_URL}/verify/?token=${randomToken}`,
//           year: new Date().getFullYear(),
//         },
//       });

//       return new AdminDto(admin);
//     } catch (error) {
//       this.logger.logServiceError(this.addAdmin.name, error, { data });
//       throw error;
//     }
//   }

//   public async updateExecutive(
//     executive_id: string,
//     data: UpdateSugExecutiveInput,
//   ): Promise<SugExecutiveDto> {
//     try {
//       const executive =
//         await this.sugExecutiveRepository.findByPk(executive_id);

//       if (!executive)
//         throw new NotFoundException({
//           reason: RESPONSE_MESSAGES.SugExecutive.Failure.NotFound,
//           details: {
//             id: executive_id,
//           },
//         });
//       const updatedExecutive = await this.sugExecutiveRepository.updateByModel(
//         executive,
//         data,
//       );

//       return new SugExecutiveDto(updatedExecutive);
//     } catch (error) {
//       this.logger.logServiceError(this.updateExecutive.name, error, { data });
//       throw error;
//     }
//   }

//   public async addDepartment(
//     data: CreateDepartmentInput,
//   ): Promise<DepartmentDto> {
//     try {
//       const faculty = await this.facultyRepository.findByPk(data.faculty_id);

//       if (!faculty)
//         throw new NotFoundException({
//           reason: RESPONSE_MESSAGES.Faculty.Failure.NotFound,
//           details: {
//             faculty_id: data.faculty_id,
//           },
//         });

//       const deparment = await this.departmentRepository.create(data);

//       return new DepartmentDto(deparment);
//     } catch (error) {
//       this.logger.logServiceError(this.addDepartment.name, error, { data });
//       throw error;
//     }
//   }

//   public async updateDepartment(
//     id: string,
//     data: UpdateDepartmentInput,
//   ): Promise<DepartmentDto> {
//     try {
//       const deparment = await this.departmentRepository.findByPk(id);

//       if (!deparment)
//         throw new NotFoundException({
//           reason: RESPONSE_MESSAGES.Department.Failure.NotFound,
//           details: {
//             deparment_id: id,
//           },
//         });
//       const updated = await this.departmentRepository.updateByModel(
//         deparment,
//         data,
//       );

//       return new DepartmentDto(updated);
//     } catch (error) {
//       this.logger.logServiceError(this.updateDepartment.name, error, { data });
//       throw error;
//     }
//   }

//   public async getDepartments(faculty_id?: string): Promise<DepartmentDto[]> {
//     try {
//       if (faculty_id) {
//         const faculty = await this.facultyRepository.findByPk(faculty_id);
//         if (!faculty)
//           throw new NotFoundException({
//             reason: RESPONSE_MESSAGES.Faculty.Failure.NotFound,
//             details: {
//               faculty_id: faculty_id,
//             },
//           });
//         const deparments = await this.departmentRepository.findManyBy({
//           faculty_id,
//         });
//         return DepartmentDto.fromEntities(deparments);
//       }

//       const deparments = await this.departmentRepository.findManyBy({});
//       return DepartmentDto.fromEntities(deparments);
//     } catch (error) {
//       this.logger.logServiceError(this.getDepartments.name, error);
//       throw error;
//     }
//   }

//   public async deleteDepartment(id: string): Promise<void> {
//     try {
//       const deparment = await this.departmentRepository.findByPk(id);

//       if (!deparment)
//         throw new NotFoundException({
//           reason: RESPONSE_MESSAGES.Department.Failure.NotFound,
//           details: {
//             deparment_id: id,
//           },
//         });

//       await this.departmentRepository.delete(deparment);
//     } catch (error) {
//       this.logger.logServiceError(this.deleteDepartment.name, error, { id });
//       throw error;
//     }
//   }

//   public async addFaculty(data: CreateFacultyInput): Promise<FacultyDto> {
//     try {
//       const faculty = await this.facultyRepository.create(data);

//       return new FacultyDto(faculty);
//     } catch (error) {
//       this.logger.logServiceError(this.addFaculty.name, error, { data });
//       throw error;
//     }
//   }

//   public async updateFaculty(
//     id: string,
//     data: UpdateFacultyInput,
//   ): Promise<FacultyDto> {
//     try {
//       const faculty = await this.facultyRepository.findByPk(id);

//       if (!faculty)
//         throw new NotFoundException({
//           reason: RESPONSE_MESSAGES.Faculty.Failure.NotFound,
//           details: {
//             faculty_id: id,
//           },
//         });

//       const updated = await this.facultyRepository.updateByModel(faculty, data);

//       return new FacultyDto(updated);
//     } catch (error) {
//       this.logger.logServiceError(this.updateFaculty.name, error, { data });
//       throw error;
//     }
//   }

//   public async getFaculty(id: string): Promise<FacultyDto> {
//     try {
//       const faculty = await this.facultyRepository.findByPk(id, {
//         relations: ['departments'],
//       });

//       if (!faculty)
//         throw new NotFoundException({
//           reason: RESPONSE_MESSAGES.Faculty.Failure.NotFound,
//           details: {
//             faculty_id: id,
//           },
//         });

//       return new FacultyDto(faculty);
//     } catch (error) {
//       this.logger.logServiceError(this.getFaculty.name, error, { id });
//       throw error;
//     }
//   }

//   public async getFaculties(): Promise<FacultyDto[]> {
//     try {
//       const faculties = await this.facultyRepository.findManyBy(
//         {},
//         {
//           relations: ['departments'],
//         },
//       );

//       return FacultyDto.fromEntities(faculties);
//     } catch (error) {
//       this.logger.logServiceError(this.getFaculties.name, error);
//       throw error;
//     }
//   }

//   public async deleteFaculty(id: string): Promise<void> {
//     try {
//       const faculty = await this.facultyRepository.findByPk(id);

//       if (!faculty)
//         throw new NotFoundException({
//           reason: RESPONSE_MESSAGES.Faculty.Failure.NotFound,
//           details: {
//             faculty_id: id,
//           },
//         });

//       await this.facultyRepository.delete(faculty);
//     } catch (error) {
//       this.logger.logServiceError(this.deleteFaculty.name, error, { id });
//       throw error;
//     }
//   }
// }
