import {NgModule} from '@angular/core';
import {IonicApp, IonicModule} from 'ionic-angular';
import {MyApp} from './app.component';
import {HomePage} from '../pages/home/home';
import {TabsPage} from '../pages/tabs/tabs';
import {LoggerService} from '../core/logger.service';
import {MQTTService} from '../core/mqtt.service';
import {SettingsComponent} from '../pages/settings/settings.component';
import {LogsComponent} from '../pages/settings/logs.component';

@NgModule({
    declarations: [
        MyApp,
        HomePage,
        TabsPage,
        SettingsComponent,
        LogsComponent
    ],
    imports: [
        IonicModule.forRoot(MyApp)
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        HomePage,
        TabsPage,
        SettingsComponent,
        LogsComponent
    ],
    providers: [LoggerService, MQTTService]
})
export class AppModule {
}
