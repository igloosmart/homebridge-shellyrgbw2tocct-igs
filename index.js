"use strict";

let Service, Characteristic;
const http = require('http');   // HTTP POST / GET method.
const { SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION } = require('constants');

module.exports = function (homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    homebridge.registerAccessory('homebridge-ShellyRGBW2toCCT', 'CCT-LED1', cctLED1Accessory);
    //homebridge.registerAccessory('homebridge-ShellyRGBW2toCCT', 'CCT-LED2', cctLED2Accessory);
};

function cctLED1Accessory(log, config, api) {
    this.log = log;
    this.config = config;
    this.homebridge = api;

    if (this.config.defaultVolume)
        this.defaultVolume = this.config.defaultVolume;
    else
        this.defaultVolume = 1;

    if (this.config.refreshInterval)
        this.refreshInterval = this.config.refreshInterval;
    else
        this.refreshInterval = 1000;

    this.bulb = new Service.Lightbulb(this.config.name);
    // Set up Event Handler for bulb on/off
    this.bulb.getCharacteristic(Characteristic.On)
        .on("get", this.getPower.bind(this))
        .on("set", this.setPower.bind(this));
    this.bulb.getCharacteristic(Characteristic.Brightness)
        .on("get", this.getVolume.bind(this))
        .on("set", this.setVolume.bind(this));

    // polling
    this.timer = setTimeout(this.poll.bind(this), this.refreshInterval);
};

cctLED1Accessory.prototype = {
    getServices: function() {
        if (!this.bulb) return [];
        const infoService =  
            new Service.AccessoryInformation();
        infoService
            .setCharacteristic(Characteristic.Manufacturer,
                'Shelly')
        return [infoService, this.bulb];
    },    
    getPower: function(callback) {
        this.log('getPower');

        // read white 2
        let req = http.get('http://192.168.1.191/white/2', res => {
            let recv_data = '';
            res.on('data', chunk => { recv_data += chunk});
            res.on('end', () => {
                // recv_data contains volume info.
                let vol = JSON.parse(recv_data).brightness; // vol = [0,100]
                this.log('white 3: ' + vol);
                this.vol = vol;

                callback(null, this.vol > 0);
            });
        });
        req.on('error', err => {
            this.log("Error in getPower: "+ err.message);
            callback(err);
        })
    },
    setPower: function(on, callback) {
        let new_vol;
        if(this.triggeredby=='slider') {
            this.log('setPower triggered by slider')
            new_vol = this.vol;
            delete this.triggeredby;
        } else {
            this.log('setPower ' + on)
            new_vol = on ? this.defaultVolume : 0;
        }

        let toSend = '{"brightness": ' + new_vol + '}';
        let options = {
            host: 'localhost',
            port: 5000,
            path: '/white/'+'2',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': toSend.length
            }
        }

        let req = http.request(options, res => {
            let recv_data = '';
            res.on('data', chunk => {recv_data += chunk})
        });

        req.on('error', err=>{
            this.log('Error in setPower:' + err.message);
            callback(err);
        });

        req.end(toSend)
        this.log('Request sent to set volume to ' + new_vol)
        this.vol = new_vol;

        this.updateUI();
                
        callback(null);
    },
    updateUI: function () {
        setTimeout( () => {
            this.bulb.getCharacteristic(Characteristic.Brightness).updateValue(this.vol);
            this.bulb.getCharacteristic(Characteristic.On).updateValue(this.vol>0);
        }, 100);
    },
    getVolume: function (callback) {
        this.log('getVolume')

        // callback with volume read in getPower
        callback(null,this.vol)
    },
    setVolume: function (vol, callback) {
        if(vol==100) {callback(null); return;}
        this.log('setVolume ' + vol);

        this.vol = vol;
        this.triggeredby = 'slider';

        callback(null);
    },
    poll: function() {
        if(this.timer) clearTimeout(this.timer);
        this.timer = null;

        // volume update from Sonos
        this.getPower( (err, poweron) => {  //this.vol updated.
            // update UI
            this.updateUI();
        });

        this.timer = setTimeout(this.poll.bind(this), this.refreshInterval)
    }
}