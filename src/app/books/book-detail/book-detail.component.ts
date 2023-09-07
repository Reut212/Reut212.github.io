import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Book } from '../../models/book.model';
import { BooksService } from '../books.service';
import { BookDetailes } from 'src/app/models/bookDetailes.model';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class BookDetailComponent implements OnInit {
  private book: Book;
  public isLoading: boolean = true;
  private bookDetail: BookDetailes;

  constructor(
    private bookService: BooksService,
    private route: ActivatedRoute,
    private router: Router,
    private cdref: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.registerToBookAddStream();
    this.registerToRouteChangesStream();
  }

  registerToRouteChangesStream(): void {
    this.route.paramMap.subscribe(params => {
      const bookId = params.get('id');
        this.isLoading = false;
        var currentBook = this.bookService.books.find(book => book.id === bookId);
        if (!!currentBook) {
          this.book = currentBook;
          this.updateBookDetail(this.book);
          this.cdref.markForCheck();
        }
    });
  }

  registerToBookAddStream(): void {
    this.bookService.booksChanged.subscribe(
      (updatedBooks: Book[]) => {
        if (updatedBooks.length > 0) {
          this.isLoading = false;
          this.book = updatedBooks[0];
        }
      }
    );
  }

  updateBookDetail(book: Book): void {
    this.bookDetail = new BookDetailes(book.title, book.authors);
  }
  onAddToLibraryList(): void {
    this.bookService.addBookToLibraryList(this.bookDetail);
  }

  onEditBook(): void {
    this.router.navigate(['edit'], {relativeTo: this.route});
  }

  onDeleteBook(): void {
    this.bookService.deleteBook(this.book.id);
    this.router.navigate(['/books']);
  }
}
