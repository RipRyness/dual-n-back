import { Actions } from '@ngrx/effects';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import {DnbBoardLayout, GameState} from './dnb.view-model';
import { Howl } from 'howler';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs/Subject';
import { Game, Round, RoundResult } from './+state/dnb.interfaces';
import { sumBy } from 'lodash-es';
import * as storeSvc from './+state/dnb.store-service';
import * as actions from './+state/dnb.actions';
import * as models from './dnb.view-model';
import 'rxjs/add/operator/takeUntil';

@Component({
  selector: 'dnb-root',
  templateUrl: './dnb.component.html',
  styleUrls: ['./dnb.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DnbComponent implements OnInit {

  constructor(private store: Store<Game>, private updates$: Actions, private cd: ChangeDetectorRef) { }
  readonly destroyed$ = new Subject<boolean>();
  cells = Array<models.DnbBoardCell>();
  layout: DnbBoardLayout;
  lines = Array<models.DnbBoardLine>();
  sounds = Array<Howl>();
  positionIndex = -1;
  gameState: GameState;
  private _currentRound: Round;

  @HostListener('document:keyup.space', ['$event'])
  onSpaceBar() {
    if (!this.gameState) {
      this.store.dispatch(new actions.StartGame(storeSvc.newGame()));
    }
  }

  @HostListener('document:keyup.escape', ['$event'])
  onEscape() {
    this.store.dispatch(new actions.EndGame());
  }

  @HostListener('document:keyup.a', ['$event'])
  positionClaim() {
    this.store.dispatch(new actions.ClaimMaid({
      index: this._currentRound.positionIndex,
      type: 'position'
    }));
  }

  @HostListener('document:keyup.l', ['$event'])
  soundClaim() {
    this.store.dispatch(new actions.ClaimMaid({
      index: this._currentRound.soundIndex,
      type: 'sound'
    }));
  }

  onRoundFired(round: Round) {
    this._currentRound = round;
    this.sounds[round.soundIndex].play();
    this.positionIndex = round.positionIndex;
    setTimeout(() => {
      this.cd.markForCheck();
      this.positionIndex = -1;
    }, 1000);
    this.cd.markForCheck();
  }

  onGameStarted(game: Game) {
    this.gameState = {
      round: 0,
      totalRounds: game.totalRounds,
      possibleScore: 0,
      totalScore: 0
    };
  }

  processResults(results: RoundResult[]) {
    if (!this.gameState) {
      return;
    }
    this.gameState = {
      ...this.gameState,
      round: results.length,
      totalScore: sumBy(results, r => r.score),
      possibleScore: sumBy(results, r => r.possibleScore),
    };
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
      .do(action => this.onRoundFired(action.payload))
      .subscribe();

    this.updates$
      .ofType<actions.StartGame>(actions.START_GAME)
      .takeUntil(this.destroyed$)
      .do(action => this.onGameStarted(action.payload))
      .subscribe();

    this.store.select(storeSvc.getRoundResults)
      .takeUntil(this.destroyed$)
      .do(results => this.processResults(results))
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
