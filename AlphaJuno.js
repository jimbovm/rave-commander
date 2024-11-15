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
		message.push(0b1011_0000 | this.channel);
		message.push(0b0111_1011);
		message.push(0);
		this.output.send(message);
	}

	modulation(amount) {
		this.sendThreeByteMessage(
			0b1011_0000 | this.channel,
			0b0000_0001,
			amount
		);
	}

	programChange(program) {
		this.sendTwoByteMessage(
			0b1100_0000 | this.channel,
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
		message.push(this.channel);
		message.push(this.FORMAT_TYPE);
		message.push(this.LEVEL_NUM);
		message.push(this.GROUP_NUM);

		for (const byte of payload) {
			message.push(byte);
		}

		message.push(this.SYSEX_END);
		this.output.send(message);
	}

	/**
	 * Send all tone parameters to the Alpha Juno.
	 */
	sendAllParams() {

		let payload = Object.values(this.params);

		console.log(`Sending APR with payload ${payload} to ${this.output.name}`);
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

	/**
	 * Send a subset of the tone parameters to the Alpha Juno.
	 * 
	 * @param  {string[]} paramNames - The named parameters to send.
	 */
	sendSomeParams(paramNames) {

		console.log(`Sending parameters ${paramNames}`);

		let payload = [];

		for (const paramName of paramNames) {
			console.log(`${paramName} ${this.getParamNumber(paramName)} ${this.tone[paramName]}`);
			payload.push(this.getParamNumber(paramName));
			payload.push(this.tone[paramName]);
		}

		console.log(payload);

		console.log(`Sending IPR with payload ${payload} to ${this.output.name}`);
		this.sendSysEx(this.opcodes.IPR, payload);
	}
}