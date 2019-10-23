import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {PermisstionsGuard} from './utils/permisstions.guard';
import {TasksComponent} from './pages/tasks/tasks.component';


const appRoutes: Routes = [
  {
    path: 'tasks',
    component: TasksComponent,
    // canActivate: [PermisstionsGuard],
  },
];


@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
