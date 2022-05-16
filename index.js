"use strict";

let Service, Characteristic, api;

const _http_base = require("homebridge-http-base");
const http = _http_base.http;
const configParser = _http_base.configParser;
const PullTimer = _http_base.PullTimer;
const notifications = _http_base.notifications;
const MQTTClient = _http_base.MQTTClient;
const Cache = _http_base.Cache;
const utils = _http_base.utils;

const packageJSON = require("./package.json");


module.exports = function (homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;

    api = homebridge;

    homebridge.registerAccessory('homebridge-shellyrgbw2tocct-igs', 'CCT-LED1', cctLED1Accessory);
    //homebridge.registerAccessory('homebridge-shellyrgbw2tocct-igs', 'CCT-LED2', cctLED2Accessory);
};

function cctLED1Accessory(log, config) {
    this.log = log;
    this.name = config.name;
    this.debug = config.debug || false;

    const success = this.parseCharacteristics(config);
    if (!success) {
        this.log.warn("Aborting...");
        return;
    }

    const homebridgeService = new Service.Lightbulb(this.name);
    homebridgeService.getCharacteristic(Characteristic.On)
        .on("get", this.getPowerState.bind(this))
        .on("set", this.setPowerState.bind(this));
    homebridgeService.addCharacteristic(Characteristic.Brightness)
        .on("get", this.getBrightness.bind(this))
        .on("set", this.setBrightness.bind(this));
    homebridgeService.addCharacteristic(Characteristic.ColorTemperature)
        .on("get", this.getColorTemperature.bind(this))
        .on("set", this.setColorTemperature.bind(this))
        .setProps({
            minValue: this.colorTemperature.minValue,
            maxValue: this.colorTemperature.maxValue
        });
}

cctLED1Accessory.prototype = {
    getPowerState: function(callback){
        return;
    },
    getBrightness: function(callback){
        return;
    },
    getColorTemperature: function(callback){
        return;
    },
    setPowerState: function(on, callback){
        return;
    },
    setBrightness: function(brightness, callback){
        return;
    },
    setColorTemperature: function(colorTemperature, callback){
        return;
    },
    parseCharacteristics: function (config) {
        return;
    }
}