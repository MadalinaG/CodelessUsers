import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HeroesComponent } from './heroes/heroes.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeroDetailsComponent } from './hero-details/hero-details.component';
import { UsersModule } from './users/users.module';


const routes: Routes = [ 
{ path: 'detail/:id', component: HeroDetailsComponent },
{ path: '', redirectTo: '/dashboard', pathMatch: 'full' }, 
{ path: 'dashboard', component: DashboardComponent },
{ path: 'heroes', component: HeroesComponent },
{ path: 'users', loadChildren: () => import('./users/users.module').then(m => m.UsersModule)},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
