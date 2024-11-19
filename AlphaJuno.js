/* SPDX-License-Identifier: BSD-2-Clause

Copyright Ⓒ 2024 James Brierley.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

    1. Redistributions of source code must retain the above copyright notice,
    this list of conditions and the following disclaimer.

    2. Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

'use strict';

/**
 * Represents a Roland Alpha Juno synthesizer.
 */
class AlphaJuno {

	/** Begins a System Exclusive message. */
	SYSEX_START = 0b1111_0000;
	/** Manufacturer ID for Roland Corp. */
	ROLAND_ID = 0b0100_0001;
	/** JU-1/JU-2 format. */
	FORMAT_TYPE = 0b0010_0011;
	/** Don't really know what this is... */
	LEVEL_NUM = 0b0010_0000;
	/** ...or this */
	GROUP_NUM = 0b0000_0001;
	/** Terminates a System Exclusive message. */
	SYSEX_END = 0b1111_0111;

	constructor(input, output) {

		this.input = input;
		this.output = output;
	
		/**
		 * The current parameter set for an Alpha Juno tone.
		 */
		this.tone = {
			'DCO_ENV_MODE': undefined,
			'VCF_ENV_MODE': undefined,
			'VCA_ENV_MODE': undefined,
			'DCO_WAVEFORM_PULSE': undefined,
			'DCO_WAVEFORM_SAWTOOTH': undefined,
			'DCO_WAVEFORM_SUB': undefined,
			'DCO_RANGE': undefined,
			'DCO_SUB_LEVEL': undefined,
			'DCO_NOISE_LEVEL': undefined,
			'HPF_CUTOFF_FREQ': undefined,
			'CHORUS': undefined,
			'DCO_LFO_MOD_DEPTH': undefined,
			'DCO_ENV_MOD_DEPTH': undefined,
			'DCO_AFTER_DEPTH': undefined,
			'DCO_PW_PWM_DEPTH': undefined,
			'DCO_PWM_RATE': undefined,
			'VCF_CUTOFF_FREQ': undefined,
			'VCF_RESONANCE': undefined,
			'VCF_LFO_MOD_DEPTH': undefined,
			'VCF_ENV_MOD_DEPTH': undefined,
			'VCF_KEY_FOLLOW': undefined,
			'VCF_AFTER_DEPTH': undefined,
			'VCA_LEVEL': undefined,
			'VCA_AFTER_DEPTH': undefined,
			'LFO_RATE': undefined,
			'LFO_DELAY_TIME': undefined,
			'ENV_T1': undefined,
			'ENV_L1': undefined,
			'ENV_T2': undefined,
			'ENV_L2': undefined,
			'ENV_T3': undefined,
			'ENV_L3': undefined,
			'ENV_T4': undefined,
			'ENV_KEY_FOLLOW': undefined,
			'CHORUS_RATE': undefined,
			'BENDER_RANGE': undefined
		};

		this.opcodes = {
			'APR': 0b0011_0101, // all parameters
			'IPR': 0b0011_0110, // individual parameter
			'BLD': 0b0011_0111, // bulk dump
			'WSF': 0b0100_0000, // want to send a file
			'RQF': 0b0100_0001, // request a file
			'DAT': 0b0100_0010, // data
			'ACK': 0b0100_0011, // acknowledgement
			'EOF': 0b0100_0101, // end of file
			'ERR': 0b0100_1110, // communication error
			'RJC': 0b0100_1111 // rejection
		};

		this.characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 -';

		this.channel = 1;

		let waveforms = [
			'DCO_WAVEFORM_SAWTOOTH',
			'DCO_WAVEFORM_PULSE',
			'DCO_WAVEFORM_SUB'
		];

		for (let paramName of Object.keys(this.tone)) {

			if (waveforms.includes(paramName)) {
				const control = document.querySelector(`input[name=${paramName}]:checked`);
				this.tone[paramName] = parseInt(control.value);
			}
			else if (paramName === 'CHORUS') {
				const control = document.getElementById(paramName);
				this.tone[paramName] = control.checked ? 1 : 0;
			}
			else {
				const control = document.getElementById(paramName);
				this.tone[paramName] = parseInt(control.value);
			}

			console.log(`Tone parameter ${paramName} set to ${this.tone[paramName]}`);
		}
	}

	decodeToneName(bytes) {
		let decodedName = '';
		bytes.forEach(byte => {
			decodedName += this.characters[byte];
		});
		return decodedName;
	}

	encodeToneName(name) {
		let bytes = [];
		name.split().array.forEach(char => {
			bytes.push(this.characters.indexOf(char));
		});
		return bytes;
	}

	allNotesOff() {

		let message = [];
		// opcode and channel
		message.push(0b1011_0000 | this.channel - 1);
		message.push(0b0111_1011);
		message.push(0);
		this.output.send(message);
	}

	modulation(amount) {
		this.sendThreeByteMessage(
			0b1011_0000 | this.channel - 1,
			0b0000_0001,
			amount
		);
	}

	programChange(program) {
		this.sendTwoByteMessage(
			0b1100_0000 | this.channel - 1,
			program
		);
	}

	/**
	 * Transmit a two-byte MIDI message to the Alpha Juno.
	 * 
	 * @param {*} first 
	 * @param {*} second 
	 */
	sendTwoByteMessage(first, second) {
		let message = []
		message.push(first);
		message.push(second);

		console.log(`Sending 2-byte MIDI message ${message} to ${this.output.name}`)
		this.output.send(message);
	}

	/**
	 * Transmit a three-byte MIDI message to the Alpha Juno.
	 * 
	 * @param {*} first 
	 * @param {*} second 
	 * @param {*} third 
	 */
	sendThreeByteMessage(first, second, third) {
		let message = []
		message.push(first);
		message.push(second);
		message.push(third);
	
		console.log(`Sending 3-byte MIDI message ${message} to ${this.output.name}`);
		this.output.send(message);
	}

	/**
	 * Transmit a System Exclusive message to the Alpha Juno.
	 * 
	 * @param {number} opcode
	 * @param {number} payload 
	 */
	sendSysEx(opcode, payload) {

		let message = [];
		message.push(this.SYSEX_START);
		message.push(this.ROLAND_ID);
		message.push(opcode);
		message.push(this.channel - 1);
		message.push(this.FORMAT_TYPE);
		message.push(this.LEVEL_NUM);
		message.push(this.GROUP_NUM);

		for (const byte of payload) {
			message.push(byte);
		}

		message.push(this.SYSEX_END);

		console.log(`Sending SysEx message ${message} (${message.length} bytes) to ${this.output.name}`);
		this.output.send(message);
	}

	/**
	 * Send all tone parameters to the Alpha Juno.
	 */
	sendAllParams() {

		let payload = Object.values(this.tone);

		console.log(`Sending APR with payload ${payload} (${payload.length} bytes) to ${this.output.name}`);
		this.sendSysEx(this.opcodes.APR, payload);
	}

	/**
	 * Return the index number of a tone parameter.
	 * 
	 * @param {string} paramName - A parameter name.
	 * @returns The number of the named parameter. 
	 */
	getParamNumber(paramName) {
		return Object.keys(this.tone).indexOf(paramName);
	}

	receiveSysEx(message) {
		console.log(`Decoding SysEx message ${message} received on ${this.input.name}`);

		let criticalBytes = [
			message[0] === this.SYSEX_START,
			message[1] === this.ROLAND_ID,
			Object.values(this.opcodes).includes(message[2]),
			message[4] === this.FORMAT_TYPE,
			message[5] === this.LEVEL_NUM,
			message[6] === this.GROUP_NUM,
			message[message.length-1] === this.SYSEX_END
		];

		if (criticalBytes.some(byte => byte === false)) {
			console.error(`Received SysEx message ${message} is malformed`);
			return null;
		}

		let opcode = message[2];
		let payload = message.slice(6, -1);

		let log = op => console.log(`Decoded ${op} with payload ${payload}`);

		switch (opcode) {
			case this.opcodes.APR:
				log('APR', payload);
				break;
			case this.opcodes.IPR:
				log('IPR', payload);
				break;
			default:
				console.log('Decoded unknown SysEx operation');
		}
		
		
	}

	receiveProgramChange(message) {

		let tone = message[1];
		console.log(`Receiving program change message for tone ${tone + 1} (${tone}) on ${this.input.name}`);
	}
}