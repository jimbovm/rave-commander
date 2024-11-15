'use strict';

class UI {

	updateMIDIPorts() {

		console.log('Refreshing MIDI ports...')

		function updateSelector(ports, selector) {
			
			ports.forEach((port) => {

				let option = document.createElement('option');
				option.text = port.name;
				option.value = port.id;
				option.id = port.id;
				selector.add(option);

				console.log(`Adding ${selector.id} port ${port.name}`);
			});
		}

		const midiInSelect = document.getElementById('midi_in');
		const midiOutSelect = document.getElementById('midi_out');

		midiInSelect.innerHTML = "";
		midiOutSelect.innerHTML = "";

		updateSelector(this.midiAccess.inputs, midiInSelect);
		updateSelector(this.midiAccess.outputs, midiOutSelect);
	}

	static getMIDIInput() {
		
		const midiInSelect = document.getElementById('midi_in');

		const midiInput = midiAccess.inputs.get(midiInSelect.value);

		console.log(`UI changed MIDI input to ${midiInput.name} (${midiInput.id})`);
		return midiInput;
	}

	static getMIDIOutput() {
		
		const midiOutSelect = document.getElementById('midi_out');

		const midiOutput = midiAccess.outputs.get(midiOutSelect.value);

		console.log(`UI changed MIDI input to ${midiOutput.name} (${midiOutput.id})`);
		return midiOutput;
	}

	static getChannel() {

		const channel = parseInt(document.getElementById('channel').value);

		console.log(`UI changed channel to ${channel + 1} (${channel})`);
		return channel;
	}

	static getTone() {

		const tone = parseInt(document.getElementById('tone').value);

		console.log(`UI changed tone program to ${tone + 1} (${tone})`);
		return tone;
	}

	static getParams(params) {

		const values = {};

		for (let param of params) {
			values[param] = parseInt(document.getElementById(param).value);
		}

		return values;
	}

	static setPwmMode() {

		const checkbox = document.getElementById('pwm_manual');
		const pwm_rate = document.getElementById('DCO_PWM_RATE');

		if (checkbox.checked) {
			pwm_rate.disabled = true;
			pwm_rate.value = 0;
		}
		else {
			pwm_rate.disabled = false;
		}

		return pwm_rate.disabled;
	}

	static getDco() {

		let pwmRateDisabled = this.setPwmMode();

		const dcoParams = [
			'DCO_ENV_MODE',
			'DCO_RANGE',
			'DCO_SUB_LEVEL',
			'DCO_NOISE_LEVEL',
			'DCO_LFO_MOD_DEPTH',
			'DCO_ENV_MOD_DEPTH',
			'DCO_AFTER_DEPTH',
			'DCO_PW_PWM_DEPTH',
			'DCO_PWM_RATE',
			'BENDER_RANGE'
		];

		const dco = this.getParams(dcoParams);

		// constrain PWM rate to 1..127 if adjusted manually; 0 is manual PW depth
		if ((pwmRateDisabled === false) && (dco['DCO_PWM_RATE'] === 0)) {
			dco['DCO_PWM_RATE'] = 1;
		}

		const waveformParams = [
			'DCO_WAVEFORM_PULSE',
			'DCO_WAVEFORM_SAWTOOTH',
			'DCO_WAVEFORM_SUB'
		];

		for (let waveformParam of waveformParams) {
			dco[waveformParam] = parseInt(
				document.querySelector(`input[name=${waveformParam}]:checked`).value
			);
		}

		console.log(dco);
		return dco;
	}

	static getLfo() {

		const lfoParams = [
			'LFO_RATE',
			'LFO_DELAY_TIME'
		];

		const lfo = this.getParams(lfoParams);

		console.log(lfo);
		return lfo;
	}

	static getVcf() {

		const vcfParams = [
			'HPF_CUTOFF_FREQ',
			'VCF_CUTOFF_FREQ',
			'VCF_RESONANCE',
			'VCF_LFO_MOD_DEPTH',
			'VCF_ENV_MOD_DEPTH',
			'VCF_ENV_MODE',
			'VCF_KEY_FOLLOW',
			'VCF_AFTER_DEPTH'
		];

		const filter = this.getParams(vcfParams);

		console.log(filter);
		return filter;
	}

	static getEnvelope() {

		let envParams = [
			'ENV_T1',
			'ENV_L1',
			'ENV_T2',
			'ENV_L2',
			'ENV_T3',
			'ENV_L3',
			'ENV_T4',
			'ENV_KEY_FOLLOW'
		];

		const env = this.getParams(envParams);

		console.log(env);
		return env;
	}

	static getChorus() {

		const chorus = {};

		chorus['CHORUS'] = document.getElementById('CHORUS').checked;
		chorus['CHORUS_RATE'] = parseInt(document.getElementById('CHORUS_RATE').value);

		console.log(chorus);
		return chorus;
	}

	constructor(midiAccess) {

		this.midiAccess = midiAccess;

		this.updateMIDIPorts();

		this.midiAccess.onstatechange = () => {

			console.log('MIDIAccess state change');
			this.updateMIDIPorts();
		};
	} 
}