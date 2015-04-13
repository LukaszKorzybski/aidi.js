(function (factory) {
    if (typeof define === 'function' && define.amd) {        
        define([], factory);
    } else if (typeof exports === 'object') {        
        module.exports = factory();
    } else {
        window.aidi = factory();
  }
} (function () {
	'use strict';

	var Aidi = function Aidi() {		
		var providers = {},
			components = {},

			functionParamsRegex = /^[^\(]+\(([^\)]*)\)\s+{/;

		var resolveDependencies = function(dependencies, componentName) {
			return (dependencies || []).map(function(dep) {
				var dependency = getComponentInstance(dep);
				if (!dependency) {
					throw new Error("Cannot resolve dependency: " + dep + 
						(componentName ? ", for component: " + componentName : ""));
				}
				return dependency;
			});
		};

		var identifyDependencies = function(component, _dependencies, componentName) {
			var dependencies = _dependencies ? _dependencies : component.__inject__;

			if (typeof component === 'function' && !dependencies) {
				var paramsMatch = component.toString().match(functionParamsRegex);

				if (paramsMatch && paramsMatch.length === 2) {
					dependencies = paramsMatch[1].split(',')
						.map(function(p) { return p.trim(); })
						.filter(function(p) { return p !== ""; });
				} else {
					throw new Error("Error when identifying dependencies. Parsing function's parameters list failed." + 
						(componentName ? " component: " + componentName : ""));
				}
			}

			return dependencies || [];
		};

		var registerComponentProvider = function(name, provider, _dependencies) {
			var dependencies = identifyDependencies(provider, _dependencies, name);

			if (providers[name] === undefined) {
				provider.__name__ = name;
				provider.__inject__ = dependencies || [];

				providers[name] = provider;
			} else {
				throw new Error("Provider " + name + " is already registered");
			}
		};

		var createComponentInstance = function(name) {
			var provider = providers[name];
			if (provider) {
				var resolvedDeps = resolveDependencies(provider.__inject__, name);
				return provider.apply(undefined, resolvedDeps);
			} else {
				throw new Error('Provider ' + name + ' not found');
			}
		};

		var getComponentInstance = function(name) {
			if (components[name] === undefined) {
				components[name] = createComponentInstance(name);
			}
			return components[name];
		};

		var applyDependencies = function(component, dependencies, resolvedDeps) {
			if (typeof component === 'function') {
				return component.apply(undefined, resolvedDeps);
			} else {
				resolvedDeps.forEach(function(dep, i) {
					component[dependencies[i]] = dep;
				});
				return component;
			}
		};


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
			var dependencies = identifyDependencies(component, _dependencies),
				resolvedDeps = resolveDependencies(dependencies);

			return applyDependencies(component, dependencies, resolvedDeps);
		};

		return this;
	};
    
    return new Aidi();
}));