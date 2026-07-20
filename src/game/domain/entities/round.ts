import { Choose } from './choose';
import { Player } from './player';

export class RoundResult {
  constructor(
    readonly winners: Player[],
    readonly losers: Player[],
  ) {}
}

export class Round {
  private choices: Choose[] = [];
  play(choose: Choose): void {
    this.choices.push(choose);
  }
  result(): RoundResult {
    const roundData: { [key: string]: Player[] } = {};
    const drawData = new Set<string>();

    this.choices.forEach((choice: Choose) => {
      if (!roundData[choice.getName()]) {
        roundData[choice.getName()] = [];
      }
      roundData[choice.getName()].push(choice.getPlayer());
      drawData.add(choice.getName());
    });
    if (drawData.size === 1 || drawData.size === 3) {
      return new RoundResult([], []);
    }
    const choices = Object.keys(roundData);
    const looseTable = {
      rock: 'scissors',
      scissors: 'paper',
      paper: 'rock',
    };
    if (looseTable[choices[0]] === choices[1]) {
      return new RoundResult(roundData[choices[0]], roundData[choices[1]]);
    } else {
      return new RoundResult(roundData[choices[1]], roundData[choices[0]]);
    }
  }
}
