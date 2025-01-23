import { Component, OnDestroy, AfterViewInit } from '@angular/core';
import { StudentService } from '../student.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { Subject, Subscription, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-search-students',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    MatInputModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatOptionModule,
    MatTableModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [StudentService],
  templateUrl: './search-students.component.html',
  styleUrls: ['./search-students.component.scss'],
})
export class SearchStudentsComponent implements AfterViewInit, OnDestroy {
  searchQuery: string = '';
  filteredStudents: any[] = [];
  selectedStudent: any = null;
  displayedColumns: string[] = ['name', 'class', 'rollNumber'];
  private searchSubject = new Subject<string>();
  private searchSubscription!: Subscription;

  constructor(private studentService: StudentService) {}

  ngAfterViewInit(): void {
    this.searchSubscription = this.searchSubject
      .pipe(
        debounceTime(300), // Wait 300ms for input stabilization
        distinctUntilChanged(), // Avoid repeated queries for the same text
        switchMap((query: string) => {
          if (query.length >= 3) {
            return this.studentService.searchStudents(query).pipe(
              catchError(() => {
                this.filteredStudents = [];
                return of([]);
              })
            );
          } else {
            this.filteredStudents = [];
            return of([]);
          }
        })
      )
      .subscribe((data: any) => {
        this.filteredStudents = data['students'];
      });
  }

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  // Emit the search query to the Subject
  onSearch(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const query = inputElement.value.trim();
    this.searchSubject.next(query);
  }

  // Handle student selection from dropdown
  onSelectStudent(event: any): void {
    const selectedStudent = event.option.value;
    this.selectedStudent = selectedStudent;
    this.filteredStudents = []; // Clear the dropdown
    this.searchQuery = `${selectedStudent.name} (Roll No: ${selectedStudent.rollNumber})`;
  }
}
