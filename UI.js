'use strict';

class UI {

	static getChannel() {

		const channel = parseInt(document.getElementById('channel').value);

		console.log(channel);
		return channel;
	}

	static getTone() {

		const tone = parseInt(document.getElementById('tone').value);

		console.log(tone);
		return tone;
	}

	static getParams(params) {

		const values = {};

		for (let param of params) {
			values[param] = parseInt(document.getElementById(param).value);
		}

		return values;
	}

	static getDco() {

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
}