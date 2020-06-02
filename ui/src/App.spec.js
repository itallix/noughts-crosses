import React from 'react';
import {shallow} from 'enzyme';
import {App} from './App';
import GameBoardContainer from './containers/game-board.container';
import GameListContainer from './containers/game-list.container';

describe("App tests", () => {

  it('it triggers loadGames and renders initial layout', () => {
    const onInit = jest.fn();
    const app = shallow(<App onInit={onInit}/>);

    expect(onInit).toHaveBeenCalledTimes(1);
    expect(app.find(GameListContainer).exists()).toBeTruthy();
    expect(app.find(GameBoardContainer).exists()).toBeFalsy();
  });

  it('it renders game board when gameId defined', () => {
    const app = shallow(<App gameId="test-uuid" onInit={jest.fn()}/>);

    expect(app.find(GameBoardContainer).exists()).toBeTruthy();
    expect(app.find(GameListContainer).exists()).toBeFalsy();
  });
});
