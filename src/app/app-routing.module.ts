import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {UserTableComponent} from './pages/user-table/user-table.component';
import {FilterComponent} from './pages/filter/filter.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/welcome' },
  { path: 'filters', component: FilterComponent},
  { path: 'welcome', loadChildren: () => import('./pages/welcome/welcome.module').then(m => m.WelcomeModule) },
  { path: 'monitor', loadChildren: () => import('./pages/user-table/user-table.module').then(m => m.UserTableModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
