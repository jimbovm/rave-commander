# Rave Commander

Rave Commander is a remote MIDI controller for the Roland Alpha Juno series of synthesizers that runs in your Web browser!

It can be hosted on the Internet or used from your filesystem.

## System requirements

Obviously you need a Roland Alpha Juno. Either keyboard version (the JU-1 or JU-2) will work. I don't have access to an MKS-50, which is the Alpha Juno internals in 1U rackmount form, but as the original PG-300 programmer works with all three, Rave Commander should be compatible. (Let me know if you have issues.)

You need to make sure that the `MIDI EXCL` option is turned on in your Alpha Juno's MIDI settings; it's off by default. You also need to ensure that Rave Commander is sending on the same MIDI channel that the Juno is listening to, or that your Juno is set to `OMNI` mode, which makes it listen to all 16 MIDI channels. I recommend saving these settings to the memory, so you don't have to change them every time you turn the synth on. To do this, press MIDI, press and hold down Write, and press MIDI again.

You need a MIDI interface connected between your computer and the Alpha Juno. Despite their bad reputation, I've never had a problem with the cheapest USB MIDI interfaces on eBay, although you might be better off picking up a used name-brand USB MIDI interface (e.g. Edirol or M-Audio). Your mileage may vary.

**You need to use a browser which implements the [Web MIDI API](https://developer.mozilla.org/en-US/docs/Web/API/Web_MIDI_API).** At the time of writing, Firefox doesn't appear to implement it properly, which is a shame. However, Chrome, Opera and Edge do work correctly on the desktop, though I've only tested on Linux. Support from mobile browsers is currently even more lacking.

If you're hosting Rave Commander on the Internet, you must be serving over HTTPS. The Web MIDI API only works in a "secure context", meaning either locally via `file:///` or over SSL/TLS. Some browsers also consider `file:///` to be insecure and the security settings may require tweaking.

## Usage

When loading up `index.html` in the Rave Commander directory you'll be presented with a page full of controls corresponding to each of the 36 configurable tone parameters on the Alpha Juno.

At the top of the screen you'll see drop-down boxes for selecting a MIDI in and out device. Set these according to your setup. Below these, there's another box to select any of the 127 tone programs from the Alpha Juno's memory. When you change tone, all the controls will snap to that program's settings, much like a software synth plugin, with no unwanted jumping. 

## Planned features

* Loading and saving from the browser.
* A prettier user interface.
* A randomizer.
* One-click hoovers! VWWWAAOOOOO! 😝

## Licence

Licensed under the MIT licence ([SPDX-License-Identifier: MIT](https://spdx.org/licenses/MIT.html)). See the LICENCE file for terms.

