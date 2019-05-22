import React from 'react'
import { mount } from 'enzyme'
import CounterContainer from './CounterContainer'
import configureMockStore from 'redux-mock-store'
import * as counterActions from '../store/modules/counter'

describe('CounterContainer', () => {
  let component = null
  const mockStore = configureMockStore()
  let store = mockStore({
    counter : {
      number : 0
    }
  })

  it('renders properly', () => {
    const context = { store }
    component = mount(<CounterContainer store={store}/>)
    // component = mount(<CounterContainer { context } />)
  })

  it('matches snapshot', () => {
    expect(component).toMatchSnapshot()
  })

  it('dispatch INCREASE action', () => {
    component.find('button').at(0).simulate('click')
    expect(store.getActions()[0]).toEqual(counterActions.increase())
  })
  it('dispatch DECREASE action', () => {
    component.find('button').at(1).simulate('click')
    expect(store.getActions()[1]).toEqual(counterActions.decrease())
  })
})