'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Aidi = (function () {
    function Aidi() {
        _classCallCheck(this, Aidi);

        this.providers = {};
        this.components = {};
    }

    _createClass(Aidi, [{
        key: 'component',
        value: function component(name, provider, dependencies) {
            if (arguments.length === 1) {
                return getComponentInstance.call(this, name);
            } else {
                registerComponentProvider.call(this, name, provider, dependencies);
                return this;
            }
        }
    }, {
        key: 'service',
        value: function service() {
            return this.component.apply(this, arguments);
        }
    }, {
        key: 'inject',
        value: function inject(component, _dependencies) {
            var dependencies = identifyDependencies.call(this, component, _dependencies),
                resolvedDeps = resolveDependencies.call(this, dependencies);

            return applyDependencies.call(this, component, dependencies, resolvedDeps);
        }
    }]);

    return Aidi;
})();

exports.default = Aidi;
;

exports.Aidi = Aidi;

// private

var functionParamsRegex = /^[^\(]*\(([^\)]*)\)\s*(=>)?\s*{/;

var resolveDependencies = function resolveDependencies(dependencies, componentName) {
    var _this = this;

    return (dependencies || []).map(function (dep) {
        var dependency = getComponentInstance.call(_this, dep);
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
    var dependencies = identifyDependencies.call(this, provider, _dependencies, name);

    if (this.providers[name] === undefined) {
        provider.__name__ = name;
        provider.__inject__ = dependencies || [];

        this.providers[name] = provider;
    } else {
        throw new Error('Provider ' + name + ' is already registered');
    }
};

var createComponentInstance = function createComponentInstance(name) {
    var provider = this.providers[name];
    if (provider) {
        var resolvedDeps = resolveDependencies.call(this, provider.__inject__, name);
        return provider.apply(undefined, resolvedDeps);
    } else {
        throw new Error('Provider ' + name + ' not found');
    }
};

var getComponentInstance = function getComponentInstance(name) {
    if (this.components[name] === undefined) {
        this.components[name] = createComponentInstance.call(this, name);
    }
    return this.components[name];
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