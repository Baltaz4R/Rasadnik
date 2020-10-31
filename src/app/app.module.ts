import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EnterpriseComponent, EnterpriseHeader } from './enterprise/enterprise.component';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { RecaptchaModule } from 'ng-recaptcha';

import { LoginComponent } from './login/login.component';
import { HomePageComponent } from './home-page/home-page.component';
import { RegisterComponent } from './register/register.component';
import { AgriculturistComponent } from './agriculturist/agriculturist.component';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { GardenComponent } from './garden/garden.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { WarehouseComponent, WarehouseHeader } from './warehouse/warehouse.component';
import { StoreComponent, StoreHeader } from './store/store.component';
import { ProductsComponent, ProductsHeader } from './products/products.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { ChangeComponent } from './change/change.component';
import { AdminComponent } from './admin/admin.component';
import { ToastComponent } from './toast/toast.component';
import { CommentComponent } from './comment/comment.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomePageComponent,
    RegisterComponent,
    AgriculturistComponent,
    EnterpriseComponent,
    EnterpriseHeader,
    GardenComponent,
    WarehouseComponent,
    WarehouseHeader,
    StoreComponent,
    StoreHeader,
    ProductsComponent,
    ProductsHeader,
    StatisticsComponent,
    ChangeComponent,
    AdminComponent,
    ToastComponent,
    CommentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RecaptchaModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgbModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
