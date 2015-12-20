#!/usr/bin/env node
'use strict';

var request = require('request-promise'),
    extend = require('gextend');

/*
 * Default configuration options.
 */
var DEFAULTS = {
    autoinitialize: true,
    'onDelay': 5000,
    'onParams': [0, 0.58, 1],
    'onTransitionTime': 50,
    'offDelay': 4000,
    'offParams': [0, 0.3, 0],
    'offTransitionTime': 40
};

//TODO: Add timer! Do not use request timer because it leaks
function Client(options){
    options = extend({}, DEFAULTS, options);
    if(options.autoinitialize) this.init(options);
}

/**
 * Initialize instance. It will take the
 * `options` object and merge it. We can
 * override any properties we want and create
 * or override any methods we need.
 *
 * @param  {Object} options Config object
 * @return {this}
 */
Client.prototype.init = function(options){
    //Extend the instance with all option parameters. We play with fire :)
    extend(this, options);

    this.url = 'http://' + this.host + '/api/' + this.user + '/groups/0/action';

    return this;
};

/**
 * This will set the group to a known
 * state and then start the animation
 * cycle.
 * @return {this}
 */
Client.prototype.start = function(){
    this.off(true, 0);
    return this;
};

/**
 * Stop will set the group state's on
 * to false, without transition.
 *
 * @return {Promise}
 */
Client.prototype.stop = function(){
    var payload = {'on': false};

    return request({
        method: 'PUT',
        uri: this.url,
        body: payload,
        json: true
    });
};

Client.prototype.on = function(){
    var payload = doHSBtoHue(this.onParams, this.onTransitionTime, true);

    console.log('on', this.url, payload);

    request({
        method: 'PUT',
        uri: this.url,
        body: payload,
        json: true
    })
    .then(this.onDone.bind(this))
    .catch(this.onError.bind(this));
};

Client.prototype.onError = function(err){
    console.error(err);
    //TODO: Figure out the best way to manage
    //errors. Maybe we should not retry.
    this.on();
};

Client.prototype.onDone = function (res){
    console.log('onDone');
    var t = setTimeout(this.off.bind(this), this.onDelay);
};

/**
 * Turn the lights off.
 * If `onState` equal false, it will turn the
 * group lights off after transitioning the
 * other values.
 * If `time` is 0, there will be no transition.
 *
 * off()/off(false) => dim lights, {"on": true}
 *
 * off(true) => dim lights, turn them off. {"on": false}
 *
 * @param  {Boolean} onState State of group
 * @param  {Number} time    Transition time
 * @return {void}
 */
Client.prototype.off = function (onState, time){
    onState = !!!onState; /// !!! cast to boolean and negate.

    time = time === undefined ? this.offTransitionTime : time;

    var payload = doHSBtoHue(this.offParams, time, onState);

    console.log('off', this.url, payload);

    request({
        method: 'PUT',
        uri: this.url,
        body: payload,
        json: true
    })
    .then(this.offDone.bind(this))
    .catch(this.offError.bind(this));
};

Client.prototype.offError = function(err){
    console.error(err);
    this.off();
};

Client.prototype.offDone = function (res){
    console.log('offDone');
    var t = setTimeout(this.on.bind(this), this.offDelay);
};

function doHSBtoHue(hsbval, time, on){
    var h = Math.floor(hsbval[0] * 65535),
        s = Math.floor(hsbval[1] * 255),
        b = Math.floor(hsbval[2] * 255);

    return {
        'on': on,
        'sat': s,
        'bri': b,
        'hue': h,
        'transitiontime': time
    };
}

module.exports = Client;
