import {Injectable} from '@angular/core';
import {LoggerService} from './logger.service';

declare let MqttClient: any;

@Injectable()
export class MQTTService {

    public _client: any;

    public _connected: boolean = false;

    public _prefix: string = 'application';
    public _callbacks: any = [];

    constructor(public logger: LoggerService) {

    }

    /**
     * Connect to MQTT broker
     *
     * @param callback
     */
    connect(callback?: Function): void {

        if (typeof callback !== 'function') {
            callback = (err) => {
                if (err) this.logger.log(`MQTTService::connect: ${err}`);
            };
        }

        this._client = new MqttClient({
            host: '192.168.1.11',
            port: 9001,
            username: 'mosquitto',
            password: 'mosquitto-password',
            will: {
                topic: `${this._prefix}/status`,
                payload: `offline`,
                qos: 2,
                retain: false
            }
        });

        this._client.on('connect', () => {

            this.logger.log('mqtt connected');

            this._connected = true;

            this._client.subscribe(`/#`);

            callback();
        });

        this._client.on('message', (topic, message) => {

            message = message.toString();

            this.logger.log(`${topic} ${message}`);

            try {
                message = JSON.parse(message);
            } catch (err) {
                // Do nothing
            }

            // notify subscribers
            this._callbacks.forEach(callbackEntry => {

                if (callbackEntry.topic === topic) {

                    callbackEntry.callback(topic, message);
                }
            });
        });

        this._client.on('error', error => {
            this.logger.log(error);
        });

        this._client.on('disconnect', () => {

            this._connected = false;

            this._callbacks = [];

            this.logger.log('disconnect');
        });

        this._client.on('offline', () => {

            this._connected = false;

            this._callbacks = [];

            this.logger.log('offline');
        });

        this._client.connect();
    }

    disconnect(callback?: Function): void {

        if (typeof callback !== 'function') {
            callback = (err) => {
                if (err) this.logger.log(`MQTTService::disconnect: ${err}`);
            };
        }

        if (!this._connected) {
            return callback();
        }

        this._client.disconnect();

        this._callbacks = [];

        callback();
    }

    publish(topic: string, message: string, options?: any) {

        this.logger.log('publish: ' + topic + ', ' + message);
        this._client.publish(topic, message, options);
    }

    subscribe(topic, callback) {

        this._callbacks.push({
            topic: topic,
            callback: callback
        });
    }
}
