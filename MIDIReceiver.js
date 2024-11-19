'use strict';

class MIDIReceiver {

	receiveMIDI(messageEvent) {

		// We are inside a MIDIInput object; this refers to that

		let data = messageEvent.data;

		console.log(`Received MIDI message ${data} on ${this.name} (${data.length} bytes)`)
		
		switch (data[0]) {
			case 0xF0:
				synth.receiveSysEx(data);
				break;
			case 0b1100_0000 | 0b1111_0000:
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

	setChannel(channel) {
		console.log(`Setting receiver channel to ${channel}`);
		this.channel = channel;
	}

	constructor(midiAccess, input, channel) {

		this.midiAccess = midiAccess;
		this.input = input;
		this.channel = channel;

		this.input.onmidimessage = this.receiveMIDI;
	}
}