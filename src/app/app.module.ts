import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms'; // Importação do Reactive Forms

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component'; // Seu componente Header

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent, // Adicione seus componentes aqui
    ],
    imports: [
        ReactiveFormsModule, // Importe o módulo para Reactive Forms
        BrowserModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
    // Componente inicial da aplicação
})
export class AppModule { }