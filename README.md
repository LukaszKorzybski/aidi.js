# aidi.js
Angular Inspired Dependency Injection library

## Import
AMD loader

    define('myapp', ['aidi'], function() {
        ...
    });

Node.js

    var aidi = require('aidi');

Plain HTML5

    <script src="aidi.js"></script>

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

Into object

    var writer = {        
        __inject__: ['serviceA', 'serviceB'],

        writeAB: function() { this.serviceA.writeA(); this.serviceB.writeB(); }        
    };

    aidi.inject(writer);
    writer.writeAB();