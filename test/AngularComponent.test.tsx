import * as React from 'react';
import * as angular from 'angular';
import { mount, ReactWrapper } from 'enzyme';
import { AngularComponent } from '../src/index';

angular.module('testApp', []).factory('Test', () => ({ name: 'Arthur' }));
angular.module('defaultApp', []).factory('Test', () => ({ name: 'Zaphod' }));

let div: HTMLElement;
let wrapper: ReactWrapper<any, any>;

jest.useFakeTimers();

describe('AngularComponent', () => {
  beforeEach(() => {
    div = document.createElement('div');
    document.body.appendChild(div);
  });

  afterEach(() => {
    wrapper.detach();
    document.body.removeChild(div);
  });

  it('renders the template', () => {
    wrapper = mount(
      <AngularComponent template={`<div class="test" />`} module="testApp" />,
      { attachTo: div }
    );

    expect(document.querySelector('.test')).not.toBeNull();
  });

  it('instantiates the controller', () => {
    wrapper = mount(
      <AngularComponent
        controller={
          class {
            name: string;

            constructor(Test) {
              this.name = Test.name;
            }
          }
        }
        template={`<div class="test">{{$ctrl.name}}</div>`}
        module="testApp"
      />,
      { attachTo: div }
    );

    jest.runAllTimers();
    expect(document.querySelector('.test').innerHTML).toBe('Arthur');
  });

  it('binds bindings onto the controller', () => {
    wrapper = mount(
      <AngularComponent
        controller={class {}}
        bindings={{ name: 'Arthur' }}
        template={`<div class="test">{{$ctrl.name}}</div>`}
        module="testApp"
      />,
      { attachTo: div }
    );

    jest.runAllTimers();
    expect(document.querySelector('.test').innerHTML).toBe('Arthur');
  });

  it('injects the bind function and assigns the result to the controller', async () => {
    wrapper = mount(
      <AngularComponent
        controller={class {}}
        bind={Test => ({ name: Test.name })}
        template={`<div class="test">{{$ctrl.name}}</div>`}
        module="testApp"
      />,
      { attachTo: div }
    );

    jest.runAllTimers();
    expect(document.querySelector('.test').innerHTML).toBe('Arthur');
  });

  it('passes locals to the controller', () => {
    wrapper = mount(
      <AngularComponent
        controller={
          class {
            name: string;

            constructor(User) {
              this.name = User.name;
            }
          }
        }
        template={`<div class="test">{{$ctrl.name}}</div>`}
        module="testApp"
        locals={{ User: { name: 'Arthur' } }}
      />,
      { attachTo: div }
    );

    jest.runAllTimers();
    expect(document.querySelector('.test').innerHTML).toBe('Arthur');
  });

  it('passes locals to the bind function', async () => {
    wrapper = mount(
      <AngularComponent
        controller={class {}}
        bind={User => ({ name: User.name })}
        template={`<div class="test">{{$ctrl.name}}</div>`}
        module="testApp"
        locals={{ User: { name: 'Arthur' } }}
      />,
      { attachTo: div }
    );

    jest.runAllTimers();
    expect(document.querySelector('.test').innerHTML).toBe('Arthur');
  });

  it('allows the app to be globally set', async () => {
    require('../src/index').NG_MODULE = 'defaultApp';

    wrapper = mount(
      <AngularComponent
        controller={class {}}
        bind={Test => ({ name: Test.name })}
        template={`<div class="test">{{$ctrl.name}}</div>`}
      />,
      { attachTo: div }
    );

    jest.runAllTimers();
    expect(document.querySelector('.test').innerHTML).toBe('Zaphod');
  });
});
