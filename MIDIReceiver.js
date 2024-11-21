/* SPDX-License-Identifier: MIT

Copyright Ⓒ 2024 James Brierley.

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice (including the next
paragraph) shall be included in all copies or substantial portions of the
Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE. */

'use strict';

class MIDIReceiver {

	receiveMIDI(messageEvent) {

		// We are inside a MIDIInput object; this refers to that

		let data = messageEvent.data;

		console.log(`Receiving MIDI message ${data} on ${this.name} (${data.length} bytes)`)
		
		const PROGRAM_CHANGE = 192;
		const SYSEX_START = 0xF0;

		switch (data[0]) {
			case SYSEX_START:
				synth.receiveSysEx(data);
				break;
			case PROGRAM_CHANGE & 0b1111_0000:
				synth.receiveProgramChange(data);
				break;
			default:
				console.log(`MIDI message ${data} unknown`);
		}
	}

	setInput(input) {
		console.log(`Setting receiver input to ${input.name}`);
		this.input.onmidimessage = null;
		this.input = input;
		this.input.onmidimessage = this.receiveMIDI;
	}

	constructor(midiAccess, input) {

		this.midiAccess = midiAccess;
		this.input = input;

		this.input.onmidimessage = this.receiveMIDI;
	}
}