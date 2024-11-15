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

				console.log(`Adding ${selector.id.replace('midi_', 'MIDI ')} port ${port.name}`);
			});
		}

		const midiInSelect = document.getElementById('midi_in');
		const midiOutSelect = document.getElementById('midi_out');

		midiInSelect.innerHTML = "";
		midiOutSelect.innerHTML = "";

		updateSelector(this.midiAccess.inputs, midiInSelect);
		updateSelector(this.midiAccess.outputs, midiOutSelect);
	}

	getMIDIInput() {
		
		const midiInSelect = document.getElementById('midi_in');

		const midiInput = this.midiAccess.inputs.get(midiInSelect.value);

		console.log(`UI changed MIDI input to ${midiInput.name} (${midiInput.id})`);

		synth.input = midiInput;
		return midiInput;
	}

	getMIDIOutput() {
		
		const midiOutSelect = document.getElementById('midi_out');

		const midiOutput = this.midiAccess.outputs.get(midiOutSelect.value);

		console.log(`UI changed MIDI output to ${midiOutput.name} (${midiOutput.id})`);

		synth.output = midiOutput;
		return midiOutput;
	}

	getChannel() {

		const channel = parseInt(document.getElementById('channel').value);

		console.log(`UI changed channel to ${channel + 1} (${channel})`);
		return channel;
	}

	getTone() {

		const tone = parseInt(document.getElementById('tone').value);

		console.log(`UI changed tone program to ${tone + 1} (${tone})`);
		return tone;
	}

	getParams(params) {

		const values = {};

		for (let param of params) {
			values[param] = parseInt(document.getElementById(param).value);
		}

		return values;
	}

	setPwmMode() {

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

	getDco() {

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
		
		Object.assign(synth.tone, dco);

		synth.sendSomeParams(Object.keys(dco));
		return dco;
	}

	getLfo() {

		const lfoParams = [
			'LFO_RATE',
			'LFO_DELAY_TIME'
		];

		const lfo = this.getParams(lfoParams);

		console.log(lfo);
		Object.assign(synth.tone, lfo);

		synth.sendSomeParams(Object.keys(lfo));
		return lfo;
	}

	getVcf() {

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

		Object.assign(synth.tone, filter);

		synth.sendSomeParams(Object.keys(filter));
		return filter;
	}

	getEnvelope() {

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

		Object.assign(synth.tone, env);

		synth.sendSomeParams(Object.keys(env));
		return env;
	}

	getVca() {

		let envParams = [
			'VCA_ENV_MODE',
			'VCA_LEVEL',
			'VCA_AFTER_DEPTH'
		];

		const vca = this.getParams(envParams);

		console.log(vca);

		Object.assign(synth.tone, vca);

		synth.sendSomeParams(Object.keys(vca));
		return vca;
	}

	getChorus() {

		const chorus = {};

		chorus['CHORUS'] = document.getElementById('CHORUS').checked ? 1 : 0;
		chorus['CHORUS_RATE'] = parseInt(document.getElementById('CHORUS_RATE').value);

		console.log(chorus);

		Object.assign(synth.tone, chorus);

		synth.sendSomeParams(Object.keys(chorus));
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