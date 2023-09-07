import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { BookDetailes } from '../models/bookDetailes.model';
import { LibraryListService } from './library-list.service';
import { Subscription } from 'rxjs-compat';

@Component({
  selector: 'app-library-list',
  templateUrl: './library-list.component.html',
  styleUrls: ['./library-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class LibraryListComponent implements OnInit, OnDestroy {
  public bookDetails: BookDetailes[];
  private subscription: Subscription;

  constructor(
    private libraryListService: LibraryListService,
    private cdref: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.bookDetails = this.libraryListService.getBookDetailes();
    this.subscription = this.libraryListService.bookAdded.subscribe(
      (bookDetails: BookDetailes[]) => {
        this.bookDetails = bookDetails;
        this.cdref.markForCheck();
      }
    )
  }

  ngOnDestroy(): void {
      this.subscription.unsubscribe();
  }

  onEditItem(index: number): void {
    this.libraryListService.startedEditing.next(index);
  }
}
