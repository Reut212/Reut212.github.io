import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BookDetailes } from 'src/app/models/bookDetailes.model';
import { LibraryListService } from '../library-list.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-library-edit',
  templateUrl: './library-edit.component.html',
  styleUrls: ['./library-edit.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class LibraryEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', {static: false}) libraryListForm: NgForm;
  subscription: Subscription;
  public editMode: Boolean = false;
  private editedItemIndex: number;
  private editedItem: BookDetailes;

  constructor(
    private libraryListService: LibraryListService,
    private cdref: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.subscription = this.libraryListService.startedEditing.subscribe(
      (index: number) => {
        this.editedItemIndex = index;
        this.editMode = true;
        this.editedItem = this.libraryListService.getBookDetail(index);
        this.libraryListForm.form.patchValue({
          name: this.editedItem.name,
          authors: this.editedItem.authors
        })
        this.cdref.markForCheck();
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe;
  }

  onDelete(form: NgForm): void {
    this.onClear();
    this.libraryListService.deleteBookDetail(this.editedItemIndex);
  }

  onClear(): void {
    this.libraryListForm.reset();
    this.editMode = false;
  }
}
