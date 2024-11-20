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