'use strict';

export default class Aidi {

  constructor() {
      this.providers = {};
      this.components = {};
  };

  component(name, provider, dependencies) {
      if (arguments.length === 1) {
          return this::getComponentInstance(name);
      } else {
          this::registerComponentProvider(name, provider, dependencies);
          return this;
      }
  };

  service() {
      return this.component.apply(this, arguments);
  };

  inject(component, _dependencies) {
      let dependencies = this::identifyDependencies(component, _dependencies),
          resolvedDeps = this::resolveDependencies(dependencies);

      return this::applyDependencies(component, dependencies, resolvedDeps);
  };
};

export { Aidi };


// private

const functionParamsRegex = /^[^\(]*\(([^\)]*)\)\s*(=>)?\s*{/;

let resolveDependencies = function(dependencies, componentName) {
    return (dependencies || []).map((dep) => {
        let dependency = this::getComponentInstance(dep);
        if (!dependency) {
            throw new Error(`Cannot resolve dependency: ${dep} for component: ${componentName} `);
        }
        return dependency;
    });
};

let identifyDependencies = function(component, _dependencies, componentName) {
    let dependencies = _dependencies || component.__inject__;

    if (typeof component === 'function' && !dependencies) {
        let paramsMatch = component.toString().match(functionParamsRegex);

        if (paramsMatch && paramsMatch.length > 1) {
            dependencies = paramsMatch[1].split(',')
                .map((p) => { return p.trim(); })
                .filter((p) => { return p !== ""; });
        } else {
            throw new Error("Error when identifying dependencies. Parsing " +
              `function's parameters list failed. component: ${componentName}`);
        }
    }

    return dependencies || [];
};

let registerComponentProvider = function(name, provider, _dependencies) {
    let dependencies = this::identifyDependencies(provider, _dependencies, name);

    if (this.providers[name] === undefined) {
        provider.__name__ = name;
        provider.__inject__ = dependencies || [];

        this.providers[name] = provider;
    } else {
        throw new Error(`Provider ${name} is already registered`);
    }
};

let createComponentInstance = function(name) {
    let provider = this.providers[name];
    if (provider) {
        let resolvedDeps = this::resolveDependencies(provider.__inject__, name);
        return provider.apply(undefined, resolvedDeps);
    } else {
        throw new Error(`Provider ${name} not found`);
    }
};

let getComponentInstance = function(name) {
    if (this.components[name] === undefined) {
        this.components[name] = this::createComponentInstance(name);
    }
    return this.components[name];
};

let applyDependencies = function(component, dependencies, resolvedDeps) {
    if (typeof component === 'function') {
        return component.apply(undefined, resolvedDeps);
    } else {
        resolvedDeps.forEach((dep, i) => {
            component[dependencies[i]] = dep;
        });
        return component;
    }
};
