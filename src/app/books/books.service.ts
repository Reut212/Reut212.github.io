import { EventEmitter, Injectable } from '@angular/core';
import { LibraryListService } from '../library-list/library-list.service';
import { BookDetailes } from '../models/bookDetailes.model';
import { Book } from '../models/book.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { RootObject } from '../models/item.interface';

@Injectable()
export class BooksService {

  private apiUrl = 'https://www.googleapis.com/books/v1/volumes';
  private apiKey = 'AIzaSyAMIIrYNFTTSPAyq6lXAugUGcpUXpZjy9Y'
  bookSaved = new EventEmitter<boolean>();
  bookSavedStream = this.bookSaved.asObservable();
  booksChanged = new EventEmitter<Book[]>();
  public books: Book[];
  private booksFromStorage: Book[] = JSON.parse(localStorage.getItem('booksList'));

  constructor(
    private libraryListService: LibraryListService,
    private http: HttpClient){}

  getBooksFromAPI(query: string): Observable<Book[]> {
    const url = `${this.apiUrl}?q=${query}&key=${this.apiKey}`;
    return this.http.get(url).pipe(map((response: RootObject) => {
      const items = response.items || [];
      const books = items.map(item => {
        const volumeInfo = item.volumeInfo;
        const authors = volumeInfo.authors ? volumeInfo.authors.join(', ') : 'N/A';
        return {
          id: item.id,
          title: volumeInfo.title || 'N/A',
          authors: authors,
          publisher: volumeInfo.publisher,
          publishedDate: volumeInfo.publishedDate,
          imageLinks: volumeInfo.imageLinks.thumbnail,
          description: volumeInfo.description,
        };
      }
      );
      this.books = books;
      return books;
    }));
  }

  getBook(id: string): Book {
      const chosenBook = this.booksFromStorage.find(book => book.id === id);
      return chosenBook;
  }

  getBooks(): Book[] {
    return this.booksFromStorage;
  }

  addAPIBooksToLocalStorage(books: Book[]): void {
    if (!this.booksFromStorage) {
      this.booksFromStorage = books;
      localStorage.setItem('booksList', JSON.stringify(this.booksFromStorage));
    }
  }

  addBook(newBook: Book): void {
    this.booksFromStorage.push(newBook);
    localStorage.setItem('booksList', JSON.stringify(this.booksFromStorage));
    this.books = this.booksFromStorage;
    this.booksChanged.emit(this.books.slice());
    this.bookSaved.emit(true);
  }

  updateBook(id: string, newBook: Book): void {
      const updatedBooks = this.booksFromStorage.map((book: Book) => {
        if (book.id === id) {
          return newBook;
        }
        return book;
      });

      localStorage.setItem('booksList', JSON.stringify(updatedBooks));

      const bookIndex = this.booksFromStorage.findIndex(book => book.id === id);
      if (bookIndex !== -1) {
        this.booksFromStorage[bookIndex] = newBook;
        this.books = this.booksFromStorage;
        this.booksChanged.emit(this.books.slice());
      }
      this.bookSaved.emit(true);
  }

  deleteBook(bookID: string): void{
    const bookIndex = this.books.findIndex(book => book.id === bookID);
    if (bookIndex !== -1) {
      this.books.splice(bookIndex, 1);
    }
    this.deleteBookFromLocalStorage(bookID);
    this.books = this.booksFromStorage;
    this.booksChanged.emit(this.books.slice());
  }

  deleteBookFromLocalStorage(bookId: string): void {
    const chosenBook = this.booksFromStorage.findIndex(book => book.id === bookId);
    if (chosenBook !== -1) {
      this.booksFromStorage.splice(chosenBook, 1);
      localStorage.setItem('booksList', JSON.stringify(this.booksFromStorage));
    }
  }

  addBookToLibraryList(bookDetail: BookDetailes): void {
    this.libraryListService.addBookDetail(bookDetail);
  }

  isCatalogNumberUnique(catalogNumber: string): boolean {
    return !this.books.some((book) => book.id === catalogNumber);
  }
}
