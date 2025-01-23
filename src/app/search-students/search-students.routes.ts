import { Route, Routes } from "@angular/router";
import { SearchStudentsComponent } from "./search-students.component";

export const routes: Routes=[
    {path:'',redirectTo:'search',pathMatch:'full'},
    {path:'',component:SearchStudentsComponent}
]