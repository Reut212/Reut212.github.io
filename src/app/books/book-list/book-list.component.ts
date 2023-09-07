import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs-compat';
import { BooksService } from '../books.service';
import { Book } from '../../models/book.model';
@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class BookListComponent implements OnInit, OnDestroy {
  private booksChangedSub: Subscription;
  public searchQuery: string = '';
  public sortOption: string = 'authors';
  public sortedBooks: Book[] = [];

  constructor(
    private bookService: BooksService,
    private router: Router,
    private route: ActivatedRoute,
    private cdref: ChangeDetectorRef) { }

    ngOnInit(): void {
      this.booksChangedSub = this.bookService.booksChanged.subscribe(
        (updatedBooks: Book[]) => {
          this.bookService.books = updatedBooks;
          this.cdref.markForCheck();
          this.filterAndSortBooks();
        }
      );
      this.fetchAllBooks();
    }

  fetchAllBooks(): void {
    this.bookService.books = this.bookService.getBooks();
    if(!this.bookService.books){
    const defaultQuery = 'twilight';
    this.bookService.getBooksFromAPI(defaultQuery).subscribe((data) => {
      this.bookService.addAPIBooksToLocalStorage(data);
      this.filterAndSortBooks();
    })} else{
    this.filterAndSortBooks();}
  }

  filterAndSortBooks(): void {
    const filteredBooks = this.bookService.books.filter((book) => {
      const hasPublicationDate = book.publishedDate;
      const hasAuthor = book.authors && book.authors.length > 0;
      const hasCatalogNumber = book.id;
      return hasPublicationDate && hasAuthor && hasCatalogNumber;
    });
    this.sortedBooks = this.sortBooks(filteredBooks);
    this.bookService.books = this.sortedBooks;
  }

  sortBooks(books: Book[]): Book[] {
    return books.sort((a, b) => {
      if (this.sortOption === 'author') {
        const authorsA = a.authors;
        const authorsB = b.authors;
        return authorsA.localeCompare(authorsB)
      } else if (this.sortOption === 'publishedDate') {
        const dateA = new Date(a.publishedDate).getTime();
        const dateB = new Date(b.publishedDate).getTime();
        return dateA - dateB;
      } else if (this.sortOption === 'catalogNumber') {
        return a.id.localeCompare(b.id);
      }
      return 0;
    });
  }

  onSortOptionChange(): void {
    this.sortedBooks = this.sortBooks(this.sortedBooks);
  }

  ngOnDestroy(): void {
    this.booksChangedSub.unsubscribe();
  }

  onNewBook(): void {
    this.router.navigate(['new'], {relativeTo: this.route});
  }

  onBookClick(book: Book): void {
    this.router.navigate([book], {relativeTo: this.route});
  }

  searchBooks(): void {
    if (this.searchQuery.trim() !== '') {
      const filteredBooks = this.bookService.books.filter((book) => {

        const titleMatches = book.title && book.title.toLowerCase().includes(this.searchQuery.toLowerCase());
        const authorMatches = book.authors && book.authors.toLowerCase().includes(this.searchQuery.toLowerCase());

        return titleMatches || authorMatches;
      });
      this.sortedBooks = this.sortBooks(filteredBooks);
    }
  }
}
