import { Actions } from '@ngrx/effects';
import { Game, Round } from './+state/dnb.interfaces';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Directive, HostListener, OnInit } from '@angular/core';
import { DnbBoardLayout } from './dnb.view-model';
import { Howl } from 'howler';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import * as actions from './+state/dnb.actions';
import * as models from './dnb.view-model';

@Component({
  selector: 'dnb-root',
  templateUrl: './dnb.component.html',
  styleUrls: ['./dnb.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DnbComponent implements OnInit {

  constructor(private store: Store<Game>, private updates$: Actions, private cd: ChangeDetectorRef) { }
  destroyed$ = new Subject<boolean>();
  cells = Array<models.DnbBoardCell>();
  layout: DnbBoardLayout;
  lines = Array<models.DnbBoardLine>();
  sounds = Array<Howl>();
  positionIndex = -1;

  @HostListener('document:keyup.space', ['$event'])
  onSpaceBar() {
    this.store.dispatch(new actions.StartGame());
  }

  @HostListener('document:keyup.escape', ['$event'])
  onEscape() {
    this.store.dispatch(new actions.EndGame());
  }

  _handleRound(round: Round) {
    this.sounds[round.soundIndex].play();
    this.positionIndex = round.positionIndex;
    setTimeout(() => {
      this.cd.markForCheck();
      this.positionIndex = -1;
    }, 1000);
    this.cd.markForCheck();
  }

  ngOnInit() {
    this.layout = {
      width: 600,
      height: 600,
      x: 600,
      y: 600,
      bgColor: '#fff',
      borderCss: '#c4c9f3 solid thin',
      lineCss: '#c4c9f3 solid thin',
      padding: 50
    };
    this.buildLineModels();
    this.buildCellModels();
    this.buildSounds();

    this.updates$
      .ofType<actions.FireRound>(actions.FIRE_ROUND)
      .takeUntil(this.destroyed$)
      .do(action => this._handleRound(action.payload))
      .subscribe();
  }

  private buildSounds() {
    const soundsPath = '../assets/sounds/',
      letters = ['c', 'h', 'k', 'l', 'q', 'r', 's', 't'],
      extensions = ['mp3', 'wav', 'ogg'];
    letters.forEach(l => {
      const src = [];
      extensions.forEach(x => {
        src.push(`${soundsPath}${l}.${x}`);
      });
      this.sounds.push(new Howl({ src: src }));
    });
  }

  private buildLineModels() {
    const line: models.DnbBoardLine = {
      color: '#5a85b4',
      width: 1,
      x1: 0,
      y1: 0,
      x2: 0,
      y2: 0
    };

    // vertical lines
    this.lines.push(
      Object.assign({}, line, {
        x1: this.layout.width / 3 + this.layout.padding / 3,
        y1: this.layout.padding,
        x2: this.layout.width / 3 + this.layout.padding / 3,
        y2: this.layout.padding + (this.layout.height - this.layout.padding * 2)
      })
    );
    this.lines.push(
      Object.assign({}, line, {
        x1: this.layout.width / 3 * 2 - this.layout.padding / 3,
        y1: this.layout.padding,
        x2: this.layout.width / 3 * 2 - this.layout.padding / 3,
        y2: this.layout.padding + (this.layout.height - this.layout.padding * 2)
      })
    );

    // horizontal lines
    this.lines.push(
      Object.assign({}, line, {
        y1: this.layout.height / 3 + this.layout.padding / 3,
        x1: this.layout.padding,
        y2: this.layout.height / 3 + this.layout.padding / 3,
        x2: this.layout.padding + (this.layout.width - this.layout.padding * 2)
      })
    );
    this.lines.push(
      Object.assign({}, line, {
        y1: this.layout.height / 3 * 2 - this.layout.padding / 3,
        x1: this.layout.padding,
        y2: this.layout.height / 3 * 2 - this.layout.padding / 3,
        x2: this.layout.padding + (this.layout.width - this.layout.padding * 2)
      })
    );
  }

  private buildCellModels() {
    const cellPadding = Math.max(this.layout.padding / 5, 5),
      pWidth = this.layout.width - this.layout.padding * 2,
      pHeight = this.layout.height - this.layout.padding * 2,
      cWidth = pWidth / 3 - cellPadding * 2,
      cHeight = pHeight / 3 - cellPadding * 2;

    let y = this.layout.padding + cellPadding;
    for (let row = 0; row < 3; row++) {
      if (row > 0) {
        y += cHeight + cellPadding * 2;
      }
      let x = this.layout.padding + cellPadding;
      for (let col = 0; col < 3; col++) {
        if (col > 0) {
          x += cWidth + cellPadding * 2;
        }

        this.cells.push({
          bgColor: '#b47952',
          width: cWidth,
          height: cHeight,
          x: x,
          y: y,
          hide: true
        });
      }
    }
  }
}
