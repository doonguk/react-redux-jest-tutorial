import React from 'react'
import names , *as namesActions from './names'

describe('names',()=> {
  describe('actions', () => {
    const actions = [
        namesActions.changeInput('input'),
        namesActions.insert('name')
    ]
    it('should create actions', () => {
      expect(actions).toMatchSnapshot()
    })
  })
  describe('reducer', () => {
    let state = names(undefined, {})
    it('should return initialState', () => {
      expect(state).toHaveProperty('input','')
      expect(state).toHaveProperty('names',[])
      expect(state).toEqual({
        input : '',
        names : []
      })
    })
    it('should change input', () => {
      state = names(state, namesActions.changeInput('input'))
      expect(state).toHaveProperty('input','input')
    })
    it('should insert', () => {
      state = names(state, namesActions.insert('name'))
      expect(state).toHaveProperty('names',['name'])
      state = names(state, namesActions.insert('hello'))
      expect(state.names).toEqual(['name','hello'])
    })
  })
})