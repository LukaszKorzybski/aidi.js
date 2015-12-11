# aidi.js
Angular Inspired Dependency Injection library

Requires ES5 runtime. The source is written in ES6 but it is transpiled to ES5
in the build step.

## Import

Compiled version of Aidi.js uses CommonJS module definition. Depending on your environment and toolkit
you will use different methods to load it.

In browser environment use WebPack, JSPM, SystemJS or any other bundler or module
loader that is compatible with CommonJS.

ES6 modules:

    import Aidi from 'aidi';

    let aidi = new Aidi();

CommonJS:

    var aidi = require('aidi').Aidi();

## Use    
### Register

    var serviceProviderA = function() {
        return {
            writeA: function() { console.log('A'); }
        };
    };

    var serviceProviderB = function() {
        return {
            writeB: function() { console.log('B'); }
        };
    };

    aidi.component('serviceA', serviceProviderA);
    aidi.component('serviceB', serviceProviderB);

Dependency inference

    var serviceProviderAB = function(serviceA, serviceB) {
        return {
            writeAB: function() { serviceA.writeA(); serviceB.writeB(); }
        };
    };

    aidi.component('serviceAB', serviceProviderAB);

Explicit dependency declaration

    var serviceProviderAB = function(serviceA, serviceB) {
        return {
            writeAB: function() { serviceA.writeA(); serviceB.writeB(); }
        };
    };

    serviceProviderAB.__inject__ = ['serviceA', 'serviceB'];

    aidi.component('serviceAB', serviceProviderAB);

Inline dependency declaration

    aidi.component('serviceAB', serviceProviderAB, ['serviceA', 'serviceB']);

### Retrieve

    var serviceAB = aidi.component('serviceAB');
    serviceAB.writeAB();

### Inject

Into function

    var abWriterProvider = function(serviceA, ServiceB) {
        return function() {
            serviceA.doA(); serviceB.doB();
        };
    };

    var abWriter = aidi.inject(abWriterProvider);
    abWriter();

*As with component() you can explicitly provide dependencies by setting \_\_inject\_\_
property on the provider function or by passing them to the inject() function*

Into object

    var writer = {        
        __inject__: ['serviceA', 'serviceB'],

        writeAB: function() { this.serviceA.writeA(); this.serviceB.writeB(); }        
    };

    aidi.inject(writer);
    writer.writeAB();

*As with component() you can skip the \_\_inject\_\_ property and instead pass the
dependencies to the inject() function*

## Develop

Run unit tests

    gulp test

Run unit tests with watch

    gulp test-dev

Build

    gulp build

Package

    gulp package

*The resulting file will be written to `dist/aidi.js`*
