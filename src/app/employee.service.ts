import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Employee } from './employee';
import { enviroment } from '../enviroments/enviroment';

@Injectable({
    providedIn: 'root'
})
export class EmployeeService{
    private apiServerUrl=enviroment.apiBaseUrl;

    constructor(private http: HttpClient){}

    public getEmployees(): Observable<Employee[]>{
        console.log('Making request to:', `${this.apiServerUrl}/employee/all`);
        return this.http.get<Employee[]>(`${this.apiServerUrl}/employee/all`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
    }

    public addEmployee(employee: Employee): Observable<Employee>{
        console.log('Adding employee to:', `${this.apiServerUrl}/employee/add`);
        const newEmployee = {
            name: employee.name,
            email: employee.email,
            jobTitle: employee.jobTitle,
            phone: employee.phone,
            imageUrl: employee.imageUrl
        };
        console.log('Employee data being sent:', newEmployee);

        return this.http.post<Employee>(`${this.apiServerUrl}/employee/add`, newEmployee, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
    }

    public updateEmployee(employee: Employee): Observable<Employee>{
        console.log('Updating employee at:', `${this.apiServerUrl}/employee/update`);
        return this.http.put<Employee>(`${this.apiServerUrl}/employee/update`, employee, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
    }

    public deleteEmployee(employeeId: number): Observable<void>{
        return this.http.delete<void>(`${this.apiServerUrl}/employee/delete/${employeeId}`)
    }
}
