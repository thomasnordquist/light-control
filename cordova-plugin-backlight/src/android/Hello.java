package com.example.plugin;

import android.util.Log;

import org.apache.cordova.*;
import org.json.JSONArray;
import org.json.JSONException;

import java.io.BufferedOutputStream;
import java.io.FileOutputStream;
import java.io.IOException;

public class Hello extends CordovaPlugin {

    @Override
    public boolean execute(String action, JSONArray data, CallbackContext callbackContext) throws JSONException {

        if (action.equals("setBrightness")) {
            try {
                int brightness = data.getInt(0);
                if(isBrightnessWithinExpectedValues(brightness)) {
                    setBrightness(callbackContext, brightness);
                } else {
                    callbackContext.error("value out of bounds: " + brightness);
                    return false;
                }
                return true;
            } catch (JSONException e) {
                callbackContext.error("unexpected argument");
                return false;
            }
        } else {
            return false;
        }
    }

    private void setBrightness(CallbackContext callbackContext, int brightness) {
        try {
            Process p = Runtime.getRuntime().exec(new String[]{"su", "-c", "echo " + brightness + " > /sys/devices/platform/leds-mt65xx/leds/lcd-backlight/brightness"});
        } catch (IOException e) {
            Log.w("su", "ioexception:" + e.toString());
            callbackContext.error("Couldn't get permissions");
        }
        callbackContext.success();
    }

    private boolean isBrightnessWithinExpectedValues(int brightness) {
        return brightness >= 0 && brightness < 255;
    }
}
