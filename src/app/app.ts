import { Component, OnInit, signal } from '@angular/core';
import { Employee } from './employee';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { EmployeeService } from './employee.service';
import { NgFor, NgIf, CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [NgFor, NgIf, CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  title = 'employeemanagementsystem';
  public employees: Employee[] = [];
  public editEmployee: Employee | undefined;
  public deleteEmployee: Employee | undefined;
  public isLoading = false;
  public errorMessage = '';

  constructor(private http: HttpClient, private employeeService: EmployeeService){}

  ngOnInit(){
    this.getEmployees();
  }

  public getEmployees():void{
    this.isLoading = true;
    this.errorMessage = '';
    this.employeeService.getEmployees().subscribe({
      next: (response: Employee[]) => {
        console.log('Success response:', response);
        this.employees = response;
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error details:', error);
        console.error('Error status:', error.status);
        console.error('Error message:', error.message);
        console.error('Error body:', error.error);
        this.errorMessage = `Error loading employees: ${error.status} - ${error.message}`;
        this.isLoading = false;
      }
    });
  }

  public onOpenModal(employee: Employee | null, mode: string):void{
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if(mode === 'add'){
      button.setAttribute('data-target', '#addEmployeeModal');
    }else if(mode === 'update'){
      this.editEmployee = employee || undefined;
      button.setAttribute('data-target', '#updateEmployeeModal');
    }else if(mode === 'delete'){
      this.deleteEmployee = employee || undefined;
      button.setAttribute('data-target', '#deleteEmployeeModal');
    }
    container?.appendChild(button);
    button.click();
  }

  public onAddEmloyee(addForm: NgForm): void {
    console.log('Adding employee form data:', addForm.value);
    console.log('Form valid:', addForm.valid);
    this.isLoading = true;
    this.errorMessage = '';
    this.employeeService.addEmployee(addForm.value).subscribe({
      next: (response: Employee) => {
        console.log('Employee added:', response);
        this.getEmployees();
        addForm.reset();
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error adding employee:', error);
        console.error('Error status:', error.status);
        console.error('Error body:', error.error);
        this.errorMessage = `Error adding employee: ${error.status} - ${error.message || 'Server Error'}`;
        this.isLoading = false;
      }
    });
  }

  public onUpdateEmloyee(employee: Employee): void {
    console.log('Updating employee:', employee);
    this.employeeService.updateEmployee(employee).subscribe({
      next: (response: Employee) => {
        console.log('Employee updated:', response);
        this.getEmployees();
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error updating employee:', error);
        console.error('Error status:', error.status);
        console.error('Error body:', error.error);
        alert(`Error updating employee: ${error.status} - ${error.message || 'Server Error'}`);
      }
    });
  }

  public onDeleteEmloyee(employeeId: number): void {
    console.log('Deleting employee with ID:', employeeId);
    this.employeeService.deleteEmployee(employeeId).subscribe({
      next: () => {
        console.log('Employee deleted successfully');
        this.getEmployees();
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error deleting employee:', error);
        alert(`Error deleting employee: ${error.message}`);
      }
    });
  }
}
