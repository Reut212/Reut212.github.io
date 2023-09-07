import { ChangeDetectionStrategy, Component, OnInit, } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Book } from '../../models/book.model';
import { BooksService } from '../books.service';

@Component({
  selector: 'app-book-edit',
  templateUrl: './book-edit.component.html',
  styleUrls: ['./book-edit.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class BookEditComponent implements OnInit {
  private id: string;
  private editMode = false;
  public bookForm: FormGroup;
  public book: Book;
  public showSuccessAlert: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private bookService: BooksService,
    private router: Router,) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = params['id'];
        this.editMode = params['id'] != null;
        this.initForm();
      }
    )
  }

  onSubmit(): void {
    console.log('raw',this.bookForm.getRawValue());
    let uniqueId = 'manually_added_' + Date.now().toString();
    if(this.editMode){
      uniqueId = this.id;
    }
    const newBook = new Book(
      uniqueId,
      this.bookForm.value['name'],
      this.bookForm.value['authors'],
      this.bookForm.value['publisher'],
      this.bookForm.value['publishedDate'],
      this.bookForm.value['imagePath'],
      this.bookForm.value['description']
    );
    console.log('value',this.bookForm.value)
    // const newBook = new Book(
    //   uniqueId
    //   ...this.bookForm.value
    // );
    if (this.editMode) {
      this.bookService.updateBook(this.id, newBook);
    } else {
      this.bookService.addBook(newBook);
    }
    this.onCancel();
  }

  private initForm(): void {
    // console.log('raw',this.bookForm.getRawValue());
    let bookName = '';
    let imageLinks: string;
    let authors: string;
    let publisher: string;
    let catalogNumber: string = 'manually_added_' + Date.now().toString();
    let publishedDate: string;
    let bookDescription = '';

    if (this.editMode) {
      const book = this.bookService.getBook(this.id);
      this.book = book;
      bookName = book.title;
      imageLinks = book.imageLinks;
      authors = book.authors;
      publisher = book.publisher || '';
      catalogNumber = book.id || 'manually_added_' + Date.now().toString();
      publishedDate = book.publishedDate || '';
      bookDescription = book.description;
    }
    this.bookForm = new FormGroup({
      'name': new FormControl(bookName, Validators.required),
      'authors': new FormControl(authors, Validators.required),
      'publisher': new FormControl(publisher, Validators.required),
      'catalogNumber': new FormControl(catalogNumber, [
        Validators.required,
        Validators.minLength(12),
        this.catalogNumberValidator.bind(this)
      ]),
      'publishedDate': new FormControl(publishedDate, Validators.required),
      'imagePath': new FormControl(imageLinks, Validators.required),
      'description': new FormControl(bookDescription, Validators.required),
    });
  }

  get controls() {
    return (<FormArray>this.bookForm.get('bookDetailes')).controls;
  }

  catalogNumberValidator(control: FormControl): { [s: string]: boolean } | null {
    const catalogNumber = control.value;
    if (this.editMode || this.bookService.isCatalogNumberUnique(catalogNumber)) {
      return null;
    } else {
      return { catalogNumberExists: true };
    }
  }

  onCancel() : void {
    this.router.navigate(['../'], {relativeTo: this.route});
  }
}
