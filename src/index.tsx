import * as React from 'react';
import * as angular from 'angular';

export let NG_MODULE = null;

export interface AngularComponentProps {
  bind?: angular.Injectable<Function | ((...args: any[]) => any)>;
  bindings?: any;
  controller?: any;
  isolate?: boolean;
  locals?: any;
  module?: string;
  scope?: any;
  template: string;
}

export class AngularComponent extends React.Component<AngularComponentProps> {
  private $element: any;

  handleRef = ref => {
    this.$element = angular.element(ref);
  };

  shouldComponentUpdate() {
    return false;
  }

  async componentDidMount() {
    const $injector = angular.injector(['ng', this.props.module || NG_MODULE]);
    const $compile = $injector.get<any>('$compile');
    const $controller = $injector.get<any>('$controller');
    const $rootScope = $injector.get<any>('$rootScope');

    const $scope = $rootScope.$new(this.props.isolate);

    if (this.props.controller) {
      const controller = $controller(this.props.controller, {
        $element: this.$element,
        $scope: $scope,
        ...this.props.locals
      });

      if (this.props.bindings) {
        Object.assign(controller, this.props.bindings);
      }

      if (this.props.bind) {
        const bindings = $injector.invoke(
          this.props.bind,
          this,
          this.props.locals
        );

        Object.assign(controller, bindings);
      }

      $scope.$ctrl = controller;
    }

    this.$element.append(this.props.template);
    $compile(this.$element)($scope);

    this.$element.data('$scope', $scope);
    $rootScope.$evalAsync();
  }

  render() {
    return <div ref={this.handleRef} />;
  }
}
