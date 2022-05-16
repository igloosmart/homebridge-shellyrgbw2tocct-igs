var Service, Characteristic;
var request = require("request");
var pollingtoevent = require("polling-to-event");

module.exports = function (homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;

    api = homebridge;

    homebridge.registerAccessory('homebridge-shellyrgbw2tocct-igs', 'CCT-LED1', cctLED1Accessory);
};

function cctLED1Accessory(log, config) {
    this.log = log;
    this.name = config["name"];
    this.httpAddress = config["http"];
    this.ledWhite = config["white"];
    this.ledYellow = config["yellow"];

    var informationService = new Service.AccessoryInformation();

    informationService
    .setCharacteristic(Characteristic.Manufacturer, "Shelly")
    .setCharacteristic(Characteristic.Model, "Shelly RGBW2")
    .setCharacteristic(Characteristic.SerialNumber, "CCT-igloosmart");

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