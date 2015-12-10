# aidi.js
Angular Inspired Dependency Injection library

## Import

Aidi.js uses CommonJS module definition. Depending on your environment you will
use different methods to load it.

Browsers:

Use WebPack or JSPM to load Aidi.js

Node.js

    var aidi = require('aidi')();

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

Run JSHint syntax checker

    grunt analyze

Run unit tests

    grunt test

Run unit tests in continuous mode

    grunt test-dev

Build

    grunt build

*The resulting minified file will be written to `dist/aidi.min.js`*
