import { Routes } from '@angular/router';

export const routes: Routes = [
    {path:'', redirectTo:'search',pathMatch:'full'},
    {path:'search',loadComponent:()=>import('./search-students/search-students.component').then(m=>m.SearchStudentsComponent)},
];