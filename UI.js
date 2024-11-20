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

		this.visualEnvelope = new VisualEnvelope();
		this.visualEnvelope.drawEnvelope();
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

		synth.sendAllParams();
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

		synth.sendAllParams();
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
		this.visualEnvelope.drawEnvelope();

		console.log(env);

		Object.assign(synth.tone, env);

		synth.sendAllParams();
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
				const manualControl = document.getElementById('pwm_manual');
				const isPWMManual = (paramValue === 0);

				console.log(`${paramName} > 0 === ${!isPWMManual}, pwm_manual should ${isPWMManual ? '' : 'NOT '}be checked`);

				rateControl.value = paramValue;
				rateControl.disabled = isPWMManual;
				manualControl.checked = isPWMManual;
			}
			else {
				const control = document.getElementById(paramName);
				control.value = paramValue;
			}
		}

		this.visualEnvelope.drawEnvelope();
	}

	constructor(midiAccess) {

		this.midiAccess = midiAccess;

		this.updateMIDIPorts();
	} 
}