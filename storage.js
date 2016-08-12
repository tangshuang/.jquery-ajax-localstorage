"use strict";

function store(storage) {
    function factory(name,value,expires) {
        name = 'direct-am-' + name;
        // get
        if(value === undefined) {
            value = storage.getItem(name);
            value = JSON.parse(value);

            if(!value) return null;

            if(value.expires) {
                var currentTime = new Date().getTime() / 1000;
                if(currentTime - value.time > value.expires) {
                    return null;
                }
            }

            return value.data;
        }

        // delete
        if(value === null) {
            return storage.removeItem(name);
        }

        // set
        value = {
            time : new Date().getTime() / 1000,
            expires : expires || false,
            data : value
        };
        value = JSON.stringify(value);
        storage.setItem(name,value);
    }

    return factory;
}

module.exports = {
    session : store(window.sessionStorage),
    local : store(window.localStorage)
};