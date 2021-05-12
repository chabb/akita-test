import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FilterComponent } from './pages/filter/filter.component';
import { ProgressFilterComponent } from './pages/progress-filter/progress-filter.component';
// make dependency explicit for madge
import {WelcomeModule} from './pages/welcome/welcome.module';
import {UserTableModule} from './pages/user-table/user-table.module';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/welcome' },
  { path: 'filters', component: FilterComponent },
  { path: 'progress-filters', component: ProgressFilterComponent },
  { path: 'welcome', loadChildren: () => import('./pages/welcome/welcome.module').then(m => m.WelcomeModule as WelcomeModule) },
  { path: 'monitor', loadChildren: () => import('./pages/user-table/user-table.module').then(m => m.UserTableModule as UserTableModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
