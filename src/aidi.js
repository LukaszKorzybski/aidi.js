var Aidi = function() {
	'use strict';

	var providers = {},
		services = {},		

		functionParamsRegex = /^[^\(]+\(([^\)]*)\)\s+{/;

	var resolveDependencies = function(dependencies, componentName) {
		return dependencies.map(function(dep) {
			var service = getServiceInstance(dep);
			if (!service) {
				throw new Error("Cannot resolve dependency: " + dep + 
					(componentName ? ", for component: " + componentName : ""));
			}
			return service;
		});
	};

	var identifyDependencies = function(component, _dependencies, componentName) {
		var dependencies = _dependencies ? _dependencies : component.__inject__;

		if (!dependencies) {
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

		return dependencies;
	}

	var registerServiceProvider = function(name, provider, _dependencies) {
		var dependencies = identifyDependencies(provider, _dependencies, name);

		if (providers[name] === undefined) {
			provider.__name__ = name;
			provider.__inject__ = dependencies || [];

			providers[name] = provider;
		} else {
			throw new Error("Provider " + name + " is already registered");
		}
	};

	var createServiceInstance = function(name) {
		var provider = providers[name];
		if (provider) {
			var resolvedDeps = resolveDependencies(provider.__inject__, name);
			return provider.apply(this, resolvedDeps);
		} else {
			throw new Error('Provider ' + name + ' not found');
		}
	};

	var getServiceInstance = function(name) {
		if (services[name] === undefined) {
			services[name] = createServiceInstance(name);
		}
		return services[name];
	};

	return {
		providers: providers,
		services: services,

		service: function(name, provider, dependencies) {
			if (arguments.length === 1) {				
				return getServiceInstance(name);
			} else {
				registerServiceProvider(name, provider, dependencies);
				return this;
			}						
		},
		inject: function(component, _dependencies) {
			var dependencies = identifyDependencies(component, _dependencies),
				resolvedDeps = resolveDependencies(dependencies);

			return component.apply(undefined, resolvedDeps);
		}		
	};
};

var aidi = Aidi();