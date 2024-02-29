import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Employee } from './dto/employee.dto';
import { Department } from './dto/department.dto';
import { CachedValue } from 'src/classes/CachedValue.class';

@Injectable()
export class ServiceStaffService {
  private departmentsUrl =
    process.env.SERVICE_STAFF_URL + process.env.SERVICE_STAFF_DEPARTMENTS;
  private employeesUrl =
    process.env.SERVICE_STAFF_URL + process.env.SERVICE_STAFF_ALL_EMPLOYEES;
  private employeesByIdsUrl =
    process.env.SERVICE_STAFF_URL + process.env.SERVICE_STAFF_USER_INFO_BY_IDS;
  private employedEmployees =
    process.env.SERVICE_STAFF_URL +
    process.env.SERVICE_STAFF_EMPLOYED_EMPLOYEES;
  private microserviceId = process.env.MICROSERVICE_ID;
  private rolesUrl =
    process.env.SERVICE_STAFF_URL + process.env.SERVICE_STAFF_GET_ROLES;
  private depatyURl =
    process.env.SERVICE_STAFF_URL +
    process.env.SERVICE_STAFF_DEPUTY_BY_EMP_AND_SER;
  private microserviceName = process.env.MICROSERVICE_NAME;
  private addRoleURl = `${process.env.SERVICE_STAFF_URL}${process.env.SERVICE_STAFF_ADD_ROLE}`;
  private deleteRoleUrl = `${process.env.SERVICE_STAFF_URL}${process.env.SERVICE_STAFF_DELETE_ROLE}`;
  private getAllRolesUrl = `${process.env.SERVICE_STAFF_URL}${process.env.SERVICE_STAFF_GET_ROLES_BY_SERVICE}`;
  private allUsersRolesUrl = `${process.env.SERVICE_STAFF_URL}${process.env.SERVICE_STAFF_GET_ALL_USERS_ROLES}`;

  departments = new CachedValue<Department>(() => this.getDepartments());
  employees = new CachedValue<Employee>(() => this.getAllEmployees());
  employeedEmployees = new CachedValue<Employee>(() =>
    this.getEmployeedEmployees(),
  );

  getDepartmentsCached() {
    return this.departments.get();
  }

  getEmployeesCached() {
    return this.employees.get();
  }

  getEmployeedEmployeesCached() {
    return this.employeedEmployees.get();
  }

  async getDepartments() {
    return (await axios.post(this.departmentsUrl)).data.message as Department[];
  }

  async getAllEmployees() {
    return (await axios.post(this.employeesUrl)).data.message as Employee[];
  }

  async getEmployeedEmployees() {
    return (await axios.post(this.employedEmployees, new Date())).data
      .message as Employee[];
  }

  async getEmployeesById(ids: string[]) {
    return (await axios.post(this.employeesByIdsUrl, ids)).data
      .message as Employee[];
  }

  async getRoles(employeeId: string) {
    const roles = (
      await axios.post(this.rolesUrl, {
        employeeId: employeeId,
        microserviceId: this.microserviceId,
      })
    ).data.message as string[];
    return roles;
  }

  async getRolesWithDeputy(employeeId: string) {
    const roles = await this.getRoles(employeeId);
    const deaputyId = await this.getDeputyId(employeeId);
    if (deaputyId) roles.push(...(await this.getRoles(deaputyId)));
    return roles;
  }

  async getDeputyId(employeeId: string) {
    const res = (
      await axios.post(
        `${this.depatyURl}?employeeId=${employeeId}&serviceName=${this.microserviceName}`,
      )
    ).data.message as {
      id: string;
      dateBegin: string;
      dateEnd: string;
      employeeDestId: string;
      deputyDepartmentId: string;
      employeeSrcId: string;
      replacementEmpDepId: string;
      isOfficDep: boolean;
      microserviceId: string;
      microserviceName: string;
    }[];
    if (res.length > 0) {
      return res[0].employeeSrcId;
    }
    return null;
  }

  async addRoleForUser(userId: string, mnemocode: string) {
    const role = (await this.getAllRoles()).find(
      (role) => role.mnemocode === mnemocode,
    );
    const userRole = (await this.getAllUsersRoles()).find(
      (roleItem) =>
        roleItem.employeeId === userId && roleItem.roleId === role.id,
    );
    if (role && !userRole)
      return axios.post(this.addRoleURl, {
        employeeId: userId,
        roleId: role.id,
        microserviceId: this.microserviceId,
      });
    return 'ok';
  }

  async deleteRoleForUser(userId: string, mnemocode: string) {
    const roleItem = (await this.getAllRoles()).find(
      (role) => role.mnemocode === mnemocode,
    );
    const userRole = (await this.getAllUsersRoles()).find(
      (role) => role.employeeId === userId && role.roleId === roleItem.id,
    );
    if (userRole)
      return axios.post(this.deleteRoleUrl, JSON.stringify(`${userRole.id}`), {
        headers: { 'Content-Type': 'application/json-patch+json' },
      });
  }

  async getAllRoles() {
    return (
      await axios.post(
        this.getAllRolesUrl,
        JSON.stringify(`${this.microserviceId}`),
        { headers: { 'Content-Type': 'application/json-patch+json' } },
      )
    ).data.message as {
      appName: string;
      applicationId: string;
      description: string;
      id: string;
      mnemocode: string;
    }[];
  }

  async getAllUsersRoles() {
    return (
      (await axios.post(this.allUsersRolesUrl)).data.message as {
        id: string;
        employeeId: string;
        roleId: string;
        microserviceId: string;
        fioFull: string;
        descriptionRole: string;
        microserviceName: string;
      }[]
    ).filter((role) => role.microserviceId === this.microserviceId);
  }

  async getAdministartors() {
    const allUsersRoles = await this.getAllUsersRoles();
    const administartorRole = (await this.getAllRoles()).find(
      (role) => role.mnemocode === 'ADMINISTRATOR',
    );
    if (administartorRole) {
      return allUsersRoles
        .filter((userRole) => userRole.roleId === administartorRole.id)
        .map((userRole) =>
          this.getEmployeesCached().find(
            (emp) => emp.employeeId === userRole.employeeId,
          ),
        );
    }
    return [];
  }
}
