'use strict';

module.exports = function Aidi() {

  const functionParamsRegex = /^[^\(]*\(([^\)]*)\)\s*(=>)?\s*{/;

  let providers = {};
  let components = {};

  this.providers = providers;
  this.components = components;

  this.component = function(name, provider, dependencies) {
      if (arguments.length === 1) {
          return getComponentInstance(name);
      } else {
          registerComponentProvider(name, provider, dependencies);
          return this;
      }
  };

  this.service = function() {
      return this.component.apply(this, arguments);
  };

  this.inject = function(component, _dependencies) {
      let dependencies = identifyDependencies(component, _dependencies),
          resolvedDeps = resolveDependencies(dependencies);

      return applyDependencies(component, dependencies, resolvedDeps);
  };

  let resolveDependencies = function(dependencies, componentName) {
      return (dependencies || []).map((dep) => {
          let dependency = getComponentInstance(dep);
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
      let dependencies = identifyDependencies(provider, _dependencies, name);

      if (providers[name] === undefined) {
          provider.__name__ = name;
          provider.__inject__ = dependencies || [];

          providers[name] = provider;
      } else {
          throw new Error(`Provider ${name} is already registered`);
      }
  };

  let createComponentInstance = function(name) {
      let provider = providers[name];
      if (provider) {
          let resolvedDeps = resolveDependencies(provider.__inject__, name);
          return provider.apply(undefined, resolvedDeps);
      } else {
          throw new Error(`Provider ${name} not found`);
      }
  };

  let getComponentInstance = function(name) {
      if (components[name] === undefined) {
          components[name] = createComponentInstance(name);
      }
      return components[name];
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
};
