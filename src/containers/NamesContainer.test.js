import React from 'react'
import { mount } from 'enzyme'
import NamesContainer from '../containers/NamesContainer'
import configureStore from '../store/configureStore'

describe('NamesContainer', () => {
  let component = null

  let store = configureStore()
  const context = { store }
  it('renders properly', () => {
    component = mount(<NamesContainer/>, { context })
  })
  it('matchs snapshot', () => {
    expect(component).toMatchSnapshot()
  })
  it('dispatch CHANGE_INPUT action', () => {
    const mockedEvent = {
      target : {
        value : 'hello world'
      }
    }
    component.find('input').simulate('change', mockedEvent)
    expect(store.getState().names.input).toBe('hello world')
  })
  console.log(store.getState())
  it('dispatch INSERT actions', () => {
    component.find('form').simulate('submit')
    expect(store.getState().names.names).toEqual(['hello world'])
  })
})