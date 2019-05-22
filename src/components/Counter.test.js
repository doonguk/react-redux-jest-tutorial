import React from 'react'
import { shallow } from 'enzyme'
import Counter from './Counter'

describe('counter', () => {
  let component = null
  const mockIncrease = jest.fn()
  const mockDecrease = jest.fn()
  it('renders correctly', () => {
    component = shallow(<Counter value={600} onIncrease={mockIncrease} onDecrease={mockDecrease}/>)
  })
  it('matches snapshot', () => {
    expect(component).toMatchSnapshot()
  })
  it('is 600', () => {
    expect(component.find('h2').at(0).text(), '600')
  })
  it('calls function', () => {
    const buttons = component.find('button')
    buttons.at(0).simulate('click')
    buttons.at(1).simulate('click')
    expect(mockIncrease.mock.calls.length).toBe(1)
    expect(mockDecrease.mock.calls.length).toBe(1)
  })
})