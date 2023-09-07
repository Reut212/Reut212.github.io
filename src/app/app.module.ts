import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { BooksComponent } from './books/books.component';
import { BookListComponent } from './books/book-list/book-list.component';
import { BookDetailComponent } from './books/book-detail/book-detail.component';
import { LibraryListComponent } from './library-list/library-list.component';
import { LibraryEditComponent } from './library-list/library-edit/library-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownDirective } from './shared/dropdown.directive';
import { LibraryListService } from './library-list/library-list.service';
import { AppRoutingModule } from './app-routing.module';
import { BookEditComponent } from './books/book-edit/book-edit.component';
import { BooksService } from './books/books.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    BooksComponent,
    BookListComponent,
    BookDetailComponent,
    LibraryListComponent,
    LibraryEditComponent,
    DropdownDirective,
    BookEditComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [LibraryListService, BooksService],
  bootstrap: [AppComponent]
})
export class AppModule { }
