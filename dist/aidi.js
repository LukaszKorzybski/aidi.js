'use strict';

module.exports = function Aidi() {

    var functionParamsRegex = /^[^\(]*\(([^\)]*)\)\s*(=>)?\s*{/;

    var providers = {};
    var components = {};

    this.providers = providers;
    this.components = components;

    this.component = function (name, provider, dependencies) {
        if (arguments.length === 1) {
            return getComponentInstance(name);
        } else {
            registerComponentProvider(name, provider, dependencies);
            return this;
        }
    };

    this.service = function () {
        return this.component.apply(this, arguments);
    };

    this.inject = function (component, _dependencies) {
        var dependencies = identifyDependencies(component, _dependencies),
            resolvedDeps = resolveDependencies(dependencies);

        return applyDependencies(component, dependencies, resolvedDeps);
    };

    var resolveDependencies = function resolveDependencies(dependencies, componentName) {
        return (dependencies || []).map(function (dep) {
            var dependency = getComponentInstance(dep);
            if (!dependency) {
                throw new Error('Cannot resolve dependency: ' + dep + ' for component: ' + componentName + ' ');
            }
            return dependency;
        });
    };

    var identifyDependencies = function identifyDependencies(component, _dependencies, componentName) {
        var dependencies = _dependencies || component.__inject__;

        if (typeof component === 'function' && !dependencies) {
            var paramsMatch = component.toString().match(functionParamsRegex);

            if (paramsMatch && paramsMatch.length > 1) {
                dependencies = paramsMatch[1].split(',').map(function (p) {
                    return p.trim();
                }).filter(function (p) {
                    return p !== "";
                });
            } else {
                throw new Error("Error when identifying dependencies. Parsing " + ('function\'s parameters list failed. component: ' + componentName));
            }
        }

        return dependencies || [];
    };

    var registerComponentProvider = function registerComponentProvider(name, provider, _dependencies) {
        var dependencies = identifyDependencies(provider, _dependencies, name);

        if (providers[name] === undefined) {
            provider.__name__ = name;
            provider.__inject__ = dependencies || [];

            providers[name] = provider;
        } else {
            throw new Error('Provider ' + name + ' is already registered');
        }
    };

    var createComponentInstance = function createComponentInstance(name) {
        var provider = providers[name];
        if (provider) {
            var resolvedDeps = resolveDependencies(provider.__inject__, name);
            return provider.apply(undefined, resolvedDeps);
        } else {
            throw new Error('Provider ' + name + ' not found');
        }
    };

    var getComponentInstance = function getComponentInstance(name) {
        if (components[name] === undefined) {
            components[name] = createComponentInstance(name);
        }
        return components[name];
    };

    var applyDependencies = function applyDependencies(component, dependencies, resolvedDeps) {
        if (typeof component === 'function') {
            return component.apply(undefined, resolvedDeps);
        } else {
            resolvedDeps.forEach(function (dep, i) {
                component[dependencies[i]] = dep;
            });
            return component;
        }
    };
};