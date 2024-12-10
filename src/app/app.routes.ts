import { Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NotesComponent } from './components/notes/notes.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { ProfileComponent } from './components/profile/profile.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: 'notes', component: NotesComponent },
      { path: 'categories', component: CategoriesComponent },
      { path: 'profile', component: ProfileComponent },
      { path: '', redirectTo: 'notes', pathMatch: 'full' }, // Default to notes section
    ],
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }, // Wildcard route to redirect to login
];
