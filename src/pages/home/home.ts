import {Component} from '@angular/core';
import {Platform} from 'ionic-angular';
import {MQTTService} from '../../core/mqtt.service'
import {LoggerService} from '../../core/logger.service';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    public isConnected: boolean = false;

    public sensor: any = {};
    public esp8266: any = {};

    public relay: any = {};

    constructor(public mqtt: MQTTService,
                public logger: LoggerService,
                public platform: Platform) {


        this.platform.pause.subscribe(() => {

            this.logger.log(`Receive event: pause`);
            this.mqtt.disconnect();
        });

        this.platform.resume.subscribe(() => {

            this.logger.log(`Receive event: resume`);
            this.mqtt.connect();
        });

        this.connect();
    }

    get relay1PowerOnModel() {

        return this.relay.powerOn ? this.relay.powerOn : false;
    }

    set relay1PowerOnModel(value) {

        this.relay.powerOn = value;
        
        this.mqtt.publish('/relay/1', value ? 'on' : 'off', {retain: true, qos: 2});
    }

    connect() {

        this.mqtt.connect(err => {
            if (err) return;

            this.logger.log(`connect: MQTT connected`);

            this.isConnected = true;

            this.mqtt.subscribe('/ESP8266/voltage', (topic: string, voltage: string) => {

                this.esp8266.voltage = voltage;
            });

            this.mqtt.subscribe('/DHT11/temperature', (topic: string, temperature: string) => {

                this.sensor.temperature = temperature;
            });

            this.mqtt.subscribe('/DHT11/humidity', (topic: string, humidity: string) => {

                this.sensor.humidity = humidity;
            });

            this.mqtt.subscribe('/relay/1', (topic: string, powerOn: string) => {

                if (this.relay.powerOn !== (powerOn === 'on')) {

                    this.relay.powerOn = powerOn === 'on';
                }
            });
        });
    }

    disconnect() {

        this.mqtt.disconnect(err => {
            if (err) return;

            this.logger.log(`disconnect: MQTT disconnect`);

            this.isConnected = false;
        });
    }

}
