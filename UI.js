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

		this.getMIDIInput();
		this.getMIDIOutput();

		this.envelopeDisplay = new EnvelopeDisplay();
		this.envelopeDisplay.drawEnvelope();
	}

	getMIDIInput() {
		
		const midiInSelect = document.getElementById('midi_in');

		const midiInput = this.midiAccess.inputs.get(midiInSelect.value);

		console.log(`UI changed MIDI input to ${midiInput.name} (${midiInput.id})`);

		if (midiReceiver != null) {
			midiReceiver.setInput(midiInput);
		}
		
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

		synth.programChange(tone);
		return tone;
	}

	getParams(params) {

		const values = {};

		for (let param of params) {
			values[param] = parseInt(document.getElementById(param).value);
		}

		return values;
	}

	setPWMMode() {

		const checkbox = document.getElementById('pw_manual');
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

	getDCO() {

		let pwmRateDisabled = this.setPWMMode();

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

		synth.sendAllParams();
		return dco;
	}

	getLFO() {

		const lfoParams = [
			'LFO_RATE',
			'LFO_DELAY_TIME'
		];

		const lfo = this.getParams(lfoParams);

		console.log(lfo);
		Object.assign(synth.tone, lfo);

		synth.sendAllParams();
		return lfo;
	}

	getVCF() {

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

		synth.sendAllParams();
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

		// draw envelope with current values
		this.envelopeDisplay.drawEnvelope();

		console.log(env);

		Object.assign(synth.tone, env);

		synth.sendAllParams();
		return env;
	}

	getVCA() {

		let envParams = [
			'VCA_ENV_MODE',
			'VCA_LEVEL',
			'VCA_AFTER_DEPTH'
		];

		const vca = this.getParams(envParams);

		console.log(vca);

		Object.assign(synth.tone, vca);

		synth.sendAllParams();
		return vca;
	}

	getChorus() {

		const chorus = {};

		chorus['CHORUS'] = document.getElementById('CHORUS').checked ? 1 : 0;
		chorus['CHORUS_RATE'] = parseInt(document.getElementById('CHORUS_RATE').value);

		console.log(chorus);

		Object.assign(synth.tone, chorus);

		synth.sendAllParams();
		return chorus;
	}

	setAll() {
		const waveformParams = synth.waveforms;
		
		for (let [paramName, paramValue] of Object.entries(synth.tone)) {

			if (waveformParams.includes(paramName)) {

				// find the right radio button
				const waveformName = paramName.replace('DCO_WAVEFORM_', '').toLowerCase();
				let control = document.getElementById(`${waveformName}_${paramValue}`);

				console.log(`Setting waveform control ${waveformName}_${paramValue} to checked`);

				control.checked = true;
			}
			else if (paramName === 'CHORUS') {

				const control = document.getElementById(paramName);
				control.checked = (paramValue === 1);
			}
			else if (paramName === 'DCO_PWM_RATE') {

				const rateControl = document.getElementById(paramName);
				const manualControl = document.getElementById('pw_manual');
				const isPWMManual = (paramValue === 0);

				console.log(`${paramName} > 0 === ${!isPWMManual}, pw_manual should ${isPWMManual ? '' : 'NOT '}be checked`);

				rateControl.value = paramValue;
				rateControl.disabled = isPWMManual;
				manualControl.checked = isPWMManual;
			}
			else {
				const control = document.getElementById(paramName);
				control.value = paramValue;
			}
		}

		this.envelopeDisplay.drawEnvelope();
	}

	getAllControls() {

		return [
			document.getElementsByTagName('input'),
			document.getElementsByTagName('select')
		];
	}

	ableAll(enabled) {

		let allControls = this.getAllControls();

		for (let collection of allControls) {

			for (let i = 0; i < collection.length; i++) {

				const element = collection[i];
				console.log(`Setting ${element.id} ${enabled ? 'enabled' : 'disabled'}`);
				element.disabled = !enabled;
			}
		}
	}

	enableAll() {

		this.ableAll(true);

		// need to respect PWM behaviour as a special case
		if (document.getElementById('pw_manual').checked) {
			document.getElementById('DCO_PWM_RATE').disabled = true;
		}
	}

	disableAll() {

		this.ableAll(false);
	}

	constructor(midiAccess) {

		this.midiAccess = midiAccess;
		this.updateMIDIPorts();
	} 
}