import { Routes } from '@angular/router';
import { NotesComponent } from '../notes/notes.component';
import { CategoriesComponent } from '../categories/categories.component';
import { ProfileComponent } from '../profile/profile.component';

export const dashboardRoutes: Routes = [
  { path: 'notes', component: NotesComponent },
  { path: 'categories', component: CategoriesComponent },
  { path: 'profile', component: ProfileComponent },
];
