import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AgriculturistComponent } from './agriculturist/agriculturist.component';
import { AgriculturistGuard } from './guards/agriculturist.guard';
import { GardenComponent } from './garden/garden.component';
import { WarehouseComponent } from './warehouse/warehouse.component';
import { StoreComponent } from './store/store.component';
import { EnterpriseComponent } from './enterprise/enterprise.component';
import { EnterpriseGuard } from './guards/enterprise.guard';
import { AdminGuard } from './guards/admin.guard';
import { ProductsComponent } from './products/products.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { ChangeComponent } from './change/change.component';
import { AdminComponent } from './admin/admin.component';
import { CommentComponent } from './comment/comment.component';


const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'password', component: ChangeComponent },
  { path: 'admin', component: AdminComponent, canActivate: [AdminGuard] },
  { path: 'enterprise', component: EnterpriseComponent, canActivate: [EnterpriseGuard] },
  { path: 'enterprise/store', component: ProductsComponent, canActivate: [EnterpriseGuard] },
  { path: 'enterprise/store/statistics', component: StatisticsComponent, canActivate: [EnterpriseGuard] },
  { path: 'agriculturist', component: AgriculturistComponent, canActivate: [AgriculturistGuard] },
  { path: 'agriculturist/store', component: StoreComponent, canActivate: [AgriculturistGuard] },
  { path: 'agriculturist/store/comment/:id', component: CommentComponent, canActivate: [AgriculturistGuard] },
  { path: 'agriculturist/garden/:id', component: GardenComponent, canActivate: [AgriculturistGuard]},
  { path: 'agriculturist/garden/:id/warehouse', component: WarehouseComponent, canActivate: [AgriculturistGuard]},

  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
