# react-redux-jest-tutorial

CRA 로 만든 프로젝트에서 Enzyme 과 Jest 를 통한 유닛 테스팅 예제 프로젝트

> 프로젝트는 [velopert 님의 sample project](https://github.com/vlpt-playground/react-test-tutorial) 사용!

### 1. 액션 생성함수 테스팅

```js
//counter.test.js
import counter, *as counterActions from './counter'

describe('counter', () => {
  describe('actions', ()=> {
    it('should create actions', ()=>{
      const expectedActions = [
        {type : 'counter/INCREASE'},
        {type : 'counter/DECREASE'}
      ]
      const actions = [
          counterActions.increase(), 
          counterActions.decrease()
      ]
      expect(actions).toEqual(expectedActions)
    })
  })
})
```

`expectedActions` 를 만들고 import 해온 actions 생성함수를 이용하여 비교한다. `expect` 구문을 이용하여 비교한다. `toEqual` 구문은 좌측, 우측 객체의 내부의 값이 모두 일치하는지 판별한다.



### 2. 리듀서 테스팅

리듀서 테스팅은 초기 `state` 값이 잘 설정 되있는지, 액션이 디스패치 됐을때 `state` 변화가 올바른지 테스팅 해준다.

```js
...
describe('counter', () => {
  ...
  describe('reducer', () => {
    let state = counter(undefined, {]}) // initial state return
    it('should return initial state', () => {
      expect(state).toHaveProperty('number', 0)
    })
    it('should increase', () => {
      state = counter(state, counterActions.increase())
      expect(state).toHaveProperty('number',1)
    })
    it('should decrease', () => {
      state = counter(state, counterActions.decrease())
      expect(state).toHaveProperty('number',0)
    })
  })
})
	
```

`toHaveProperty('key','value')` 메소드를 이용하여 객체 내부의 값이 올바른지 테스팅 하였다.

```js
//names.test.js
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
```

`toHaveProperty()` 메소드는 객체의 내부값을 1개 참조할 때 사용하면 편하고 여러개를 참조해야 하는 경우에는 `toEqual()` 메소드를 사용하는게 더 좋다.

액션생성함수가 액션을 제대로 만드는지 테스팅 할 때 `names.test.js` 파일 에서는 `toMatchSnapShot()` 을 이용하였고 `counter.test.js` 에서는 `toEqual` 메소드를 사용하였는데 뭘 사용하든 상관없다 ㅎㅎ

_중간정리.. 뭘 테스트?_

1. 액션 생성함수가 제대로 액션을 만드는지
2. 리듀서에서 초기 state 값이 올바르고 액션을 발생 시켰을 때 state에 제대로 액션을 반영하는지



### 3.  Presentational 컴포넌트 테스팅

스냅샷 테스팅, props가 전달 됐을 때 정말 잘 전달되는지, 함수가 제대로 호출 되는지 테스팅 해준다

```js
import React from 'react'
import { shallow } from 'enzyme'

describe('Counter', () => {
  let component = null
  const mockIncrease = jest.fn()
  const mockDecrease = jest.fn()
  it('renders correctly', () => {
    component = shallow(<Counter value={500} onIncrease={mockIncrease} onDecrease={mockDecrease}/>)
  })
  it('matches snapshot', () => {
    expect(component).toMatchSnapshot()
  })  
	it('is 500', () => {
    expect(component.find('h2').at(0).text(), '500')
  })
	it('calls function', () => {
    const buttons = component.find('button')
    buttons.at(0).simulate('click')
    buttons.at(1).simulate('click')
		expect(mockIncrease.mock.calls.length).toBe(1)
    expect(mockDecrease.mock.calls.length).toBe(1)
  })
})
```

`expect` 키워드 안에 `(target, value)` 형식으로 지정해  줄 수 있다.

`simulate` 함수를 이용하여 DOM event 작업도 테스팅 가능하다.

Jest 에는 `fn` 이라는 도구를 이용하여 함수 호출을 확인 할 수 있다. `함수명.mock.calls.length` 값으로 호출 횟수를 확인 가능하다.

```js
import React from 'react'
import NameForm from './NameForm'
import { shallow } from 'enzyme'

describe('NameForm', () => {
  let component = null
  const mockChange = jest.fn()
  const mockSubmit = jest.fn()
  
  it('renders correctly', () => {
    component = shallow(
    	<NameForm
      onChange={mockChange}
      onSubmit={mockSubmit}
      value={'hello'}
      />
    )
  })
  it('matches snapshot', () => {
    expect(component).toMatchSnapshot()
  })
  it('show valid input value', () => {
    expect(component.find('input').props().value).toBe('hello')
  })
	it('calls change', () => {
    const mockedEvent = {
      target : {
        value : 'world'
      }
    }
    component.find('input').simulate('change',mockedEvent)
    expect(mockChange.mock.calls.length).toBe(1)
  })
it('calls submit', () => {
  component.find('form').simulate('submit')
  expect(mockSubmit.mock.calls.length).toBe(1)
})
})
```

`Change` 이벤트를 테스팅 할 때에는 `simulate('change', eventObject)` 와 같은 형식으로 `eventObject` 자리에 객체를 넣어준다.

`submit` 이벤트를 테스팅 할 때 `simulate('click')` 이벤트가 아닌 `simulate('submit')` 를 써야한다. ( 보통 `button` 태그에 클릭으로 submit 해서 실수. ) 





### 4. Container 컴포넌트 테스팅

Container 컴포넌트에서는 실제로 액션이 디스패치 되었을 때 스토어에 제대로 반영 되는지를 테스팅한다. 테스팅을 하기위해 (가짜) 스토어를 만들어야 한다.

```bash
$ yarn add redux-mock-store
```

```js
import React from 'react'
import { mount } from 'enzyme'
import CounterContainer from './CounterContainer'
import configureMockStore from 'redux-mock-store'
import *as counterActions from '../store/modules/counter'

describe('CounterContainer', () => {
  let component = null
  const mockStore = configureMockStore()
  let store = mockStore({
    counter : {
      number : 0
    }
  })
  it('renders properly', () => {
    component = mount(<CounterContainer store={store}/>)
  }) 
 it('matches snapshot', () => {
    expect(component).toMatchSnapshot()
  })
 it('dispatch INCREASE action', () => {
   component.find('button').at(0).simulate('click')
   // (가짜)스토어에 액션을 디스패치~~
   expect(store.getActions()[0]).toEqual(counterActions.increase())
 })
 it('dispatch DECREASE action', () => {
   component.find('button').at(1).simulate('click')
   expect(store.getActions()[1]).toEqual(counterActions.decrease())
 })
console.log(store.getActions())
//[ { type : 'counter/INCREASE'}, { type : 'counter/DECREASE'} ]
})
```

`store.getActions()` 메소드는 액션이 디스패치 됐을 때 디스패치된 액션들의 목록을 반환한다.

`toEqual()` 메소드는 좌,우 객체의 내부적인 값이 같은지 판별한다.

추가적으로 mockStore을 생성할 때 아래와 같은 방법도 가능하다.

```js
const context = { store }
component = mount(<CountContainer />, {context})
```

```js
//NameFormContainer.test.js
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
```

`NameFormContainer` 컴포넌트는 실제 store를 가져와서 테스팅 하였다.

*요약* 

1. 액션생성 함수들은 액션을 잘 만드는가?
2. 리듀서의 초기값이 정확하고 상태변화가 일어났을 경우 제대로 렌더링 되는가?
3. 컴포넌트는 제대로 렌더링 되는가?
4. 버튼을 클릭 했을 때 실제로 액션이 디스패치 되는가?
