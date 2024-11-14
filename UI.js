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

	static getDco() {
		
		const saw = document.querySelector('input[name=saw_type]:checked');
		const pulse = document.querySelector('input[name=pulse_type]:checked');
		const sub = document.querySelector('input[name=sub_type]:checked');
		const dco_env_mode = document.getElementById('dco_env_mode');
		const dco_env_amt = document.getElementById('dco_env_amt');
		const dco_lfo_amt = document.getElementById('dco_lfo_amt');
		const dco_pw = document.getElementById('dco_pw');
		const dco_pwm_rate = document.getElementById('dco_pwm_rate');
		const dco_aft = document.getElementById('dco_aft');
		const dco_range = document.getElementById('range');
		const sub_level = document.getElementById('sub_level');
		const noise_level = document.getElementById('noise_level');

		const dco = {
			'DCO_ENV_MODE': parseInt(dco_env_mode.value),
			'DCO_WAVEFORM_PULSE': parseInt(pulse.value),
			'DCO_WAVEFORM_SAWTOOTH': parseInt(saw.value),
			'DCO_WAVEFORM_SUB': parseInt(sub.value),
			'DCO_RANGE': parseInt(dco_range.value),
			'DCO_SUB_LEVEL': parseInt(sub_level.value),
			'DCO_NOISE_LEVEL': parseInt(noise_level.value),
			'DCO_LFO_MOD_DEPTH': parseInt(dco_lfo_amt.value),
			'DCO_ENV_MOD_DEPTH': parseInt(dco_env_amt.value),
			'DCO_AFTER_DEPTH': parseInt(dco_aft.value),
			'DCO_PW_PWM_DEPTH': parseInt(dco_pw.value),
			'DCO_PWM_RATE': parseInt(dco_pwm_rate.value)
		};

		console.log(dco);
		return dco;
	}

	static getLfo() {
		const rate = document.getElementById('lfo_rate');
		const delay = document.getElementById('lfo_delay');

		const lfo = {
			'LFO_RATE': parseInt(rate.value),
			'LFO_DELAY_TIME': parseInt(delay.value)
		};

		console.log(lfo);
		return lfo;
	}

	static getVcf() {
		const hpf = document.getElementById('hpf');
		const cutoff = document.getElementById('cutoff');
		const res = document.getElementById('res');
		const lfo_amt =  document.getElementById('vcf_lfo_amt');
		const env_amt = document.getElementById('vcf_env_amt');
		const env_mode = document.getElementById('vcf_env_mode');
		const kybd = document.getElementById('vcf_kybd');
		const after = document.getElementById('vcf_after');

		const filter = {
			'HPF_CUTOFF_FREQ': parseInt(hpf.value),
			'VCF_CUTOFF_FREQ': parseInt(cutoff.value),
			'VCF_RESONANCE': parseInt(res.value),
			'VCF_LFO_MOD_DEPTH': parseInt(lfo_amt.value),
			'VCF_ENV_MOD_DEPTH': parseInt(env_amt.value),
			'VCF_ENV_MODE': parseInt(env_mode.value),
			'VCF_KEY_FOLLOW': parseInt(kybd.value),
			'VCF_AFTER': parseInt(after.value)
		};

		console.log(filter);
		return filter;
	}

	static getEnvelope() {

		const t1 = document.getElementById('t1');
		const l1 = document.getElementById('l1');
		const t2 = document.getElementById('t2');
		const l2 = document.getElementById('l2');
		const t3 = document.getElementById('t3');
		const l3 = document.getElementById('l3');
		const t4 = document.getElementById('t4');
		const kybd = document.getElementById('env_kybd');

		const env = {
			'ENV_T1': parseInt(t1.value),
			'ENV_L1': parseInt(l1.value),
			'ENV_T2': parseInt(t2.value),
			'ENV_L2': parseInt(l2.value),
			'ENV_T3': parseInt(t3.value),
			'ENV_L3': parseInt(l3.value),
			'ENV_T4': parseInt(t4.value),
			'ENV_KEY_FOLLOW': parseInt(kybd.value)
		};

		console.log(env);
		return env;
	}

	static getChorus() {

		const on = document.getElementById('chorus_on');
		const rate = document.getElementById('chorus_rate');

		const chorus = {
			'CHORUS': on.checked,
			'CHORUS_RATE': parseInt(rate.value)
		};

		console.log(chorus);
		return chorus;
	}
}