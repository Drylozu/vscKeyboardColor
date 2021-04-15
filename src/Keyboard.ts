import { dataSettings, dataStart, dataEnd, keys } from './util';
const usb = require('node-hid');

type KeyboardModes = 'custom' | 'fixed' | 'breathingCycle';

export default class Keyboard {
    usb = new usb.HID(0x0c45, 0x652f);

    setMode(mode: KeyboardModes) {
        const settings = [...dataSettings];
        switch (mode) {
            case 'custom':
                settings[1] = 0x1b;
                settings[8] = 0x14;
                break;
            case 'fixed':
                settings[1] = 0x0d;
                settings[8] = 0x06;
                break;
            case 'breathingCycle':
                settings[1] = 0x0b;
                settings[8] = 0x04;
                break;
        }

        this.usb.write(dataStart);
        this.usb.write(settings);
        this.usb.write(dataEnd);
    }

    setColor(red: number, green: number, blue: number) {
        const firstSettings = [...dataSettings];
        const secondSettings = [...dataSettings];
        firstSettings[1] = 0x0b;
        firstSettings[5] = 0x04;

        secondSettings[2] = 0x02;
        secondSettings[4] = 0x03;
        secondSettings[5] = 0x05;
        secondSettings[8] = red;
        secondSettings[9] = green;
        secondSettings[10] = blue;

        this.usb.write(dataStart);
        this.usb.write(firstSettings);
        this.usb.write(secondSettings);
        this.usb.write(dataEnd);
    }

    setKeysColor(keyss: (keyof typeof keys)[], red: number, green: number, blue: number) {
        this.usb.write(dataStart);

        keyss.forEach((key) => {
            const settings = [...dataSettings];

            settings[2] = 0x02;
            settings[3] = 0x11;
            settings[4] = 0x03;

            settings[1] = keys[key][0];
            settings[5] = keys[key][1];
            settings[6] = keys[key][2];

            settings[8] = red;
            settings[9] = green;
            settings[10] = blue;

            this.usb.write(settings);
        });

        this.usb.write(dataEnd);
    }

    setAllKeysColor(red: number, green: number, blue: number) {
        this.usb.write(dataStart);

        (Object.keys(keys) as (keyof typeof keys)[]).forEach((key) => {
            const settings = [...dataSettings];

            settings[2] = 0x02;
            settings[3] = 0x11;
            settings[4] = 0x03;

            settings[1] = keys[key][0];
            settings[5] = keys[key][1];
            settings[6] = keys[key][2];

            settings[8] = red;
            settings[9] = green;
            settings[10] = blue;

            this.usb.write(settings);
        });

        this.usb.write(dataEnd);
    }
}