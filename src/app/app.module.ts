import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {HeaderComponent} from './components/header/header.component';
import {
  MatButtonModule, MatCardModule,
  MatCheckboxModule, MatDialogModule, MatDividerModule, MatExpansionModule, MatHorizontalStepper,
  MatIconModule,
  MatInputModule, MatProgressSpinnerModule,
  MatSelectModule, MatSliderModule, MatSlideToggleModule, MatSortModule, MatStepperModule,
  MatTableModule, MatTabsModule
} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TaskDialogComponent} from './components/task-dialog/task-dialog.component';
import {SpinnerComponent} from './components/spinner/spinner.component';
import {AppRoutingModule} from './app-routing.module';
import {HighlightPipe} from './utils/highlight.pipe';
import {AutoFocusDirective} from './utils/auto-focus.directive';
import {TasksComponent} from './pages/tasks/tasks.component';
import {NotifierModule, NotifierOptions} from 'angular-notifier';
import {registerLocaleData} from '@angular/common';
import localeRu from '@angular/common/locales/ru';
import {LOCALE_ID} from '@angular/core';
import { ConfirmComponent } from './components/confirm/confirm.component';
import { SearchComponent } from './components/search/search.component';
import {HttpClientModule} from '@angular/common/http';
import {ReactiveFormsModule} from '@angular/forms';
import {TaskDialogCircleComponent} from './components/task-dialog-circle/task-dialog-circle.component';
import {TaskDialogFormAddComponent} from './components/task-dialog-form-add/task-dialog-form-add.component';
import {ChatComponent} from './components/chat/chat.component';
import {ChatMsgComponent} from './components/chat/chat-msg/chat-msg.component';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import { FileuploadComponent } from './components/fileupload/fileupload.component';
import { CircleInListComponent } from './components/circle-in-list/circle-in-list.component';
import { TaskDialogFormEditComponent } from './components/task-dialog-form-edit/task-dialog-form-edit.component';

registerLocaleData(localeRu, 'ru');
/**
 * Custom angular notifier options
 */
const customNotifierOptions: NotifierOptions = {
  position: {
    horizontal: {
      position: 'right',
      distance: 12
    }
  }
};

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    TaskDialogComponent,
    SpinnerComponent,
    TasksComponent,
    HighlightPipe,
    AutoFocusDirective,
    ConfirmComponent,
    SearchComponent,
    TaskDialogCircleComponent,
    TaskDialogFormAddComponent,
    ChatComponent,
    ChatMsgComponent,
    FileuploadComponent,
    CircleInListComponent,
    TaskDialogFormEditComponent
  ],
  imports: [
    AppRoutingModule,
    NotifierModule.withConfig(customNotifierOptions),
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSelectModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatCardModule,
    MatExpansionModule,
    MatDividerModule,
    MatSliderModule,
    MatStepperModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    HttpClientModule,
    InfiniteScrollModule
  ],
  entryComponents: [
    TaskDialogComponent
  ],
  providers: [
    {provide: LOCALE_ID, useValue: 'ru'},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
