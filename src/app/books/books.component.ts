import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BooksService } from './books.service';
import { LibraryListService } from '../library-list/library-list.service';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BooksComponent implements OnInit {
  public isShowSuccessMsg: boolean = false;
  public isAddedToFavList: boolean = false;

  constructor(
    private booksService: BooksService,
    private libraryList: LibraryListService,
    private cdref: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.booksService.bookSavedStream.subscribe(isBookChangedSuccesfully => {
      this.isShowSuccessMsg = isBookChangedSuccesfully;
      setTimeout(() => {
        this.isShowSuccessMsg = false;
        this.cdref.markForCheck();
      }, 5000);
    })
    this.libraryList.bookAddedToFavStream.subscribe(isBookAddedToFavList => {
      this.isAddedToFavList = isBookAddedToFavList;
      setTimeout(() => {
        this.isAddedToFavList = false,
        this.cdref.markForCheck();
      }, 5000);
    })
  }
}
