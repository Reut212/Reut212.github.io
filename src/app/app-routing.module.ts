import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookDetailComponent } from './books/book-detail/book-detail.component';
import { BookEditComponent } from './books/book-edit/book-edit.component';
import { BookStartComponent } from './books/book-start/book-start.component';
import { BooksComponent } from './books/books.component';
import { LibraryListComponent } from './library-list/library-list.component';

const appRoutes: Routes = [
  { path: '', redirectTo: '/books', pathMatch: 'full' },
  { path: 'books', component: BooksComponent, children: [
    { path:'', component: BookStartComponent },
    { path:'new', component: BookEditComponent},
    { path:':id', component: BookDetailComponent },
    { path:':id/edit', component: BookEditComponent},
  ]},
  { path: 'library-list', component: LibraryListComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
