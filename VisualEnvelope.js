class VisualEnvelope {

	drawEnvelope() {

		let ctx = this.getContext();
		let canvas = this.getCanvas();
		let width = canvas.width;
		let height = canvas.height;

		ctx.clearRect(0, 0, width, height);

		ctx.save();

		ctx.moveTo(0, height);
		ctx.beginPath();

		let endX = 0;

		for (let l = 0; l <= 2; l++) {
		
			let level = this.getEnvelopeLevelValue(l+1);
			let time = this.getEnvelopeTimeValue(l+1);

			endX = 200 * l + time;
			ctx.lineTo(endX, height-level);
		}

		let t4 = this.getEnvelopeTimeValue(4);

		ctx.lineTo(endX + t4, height);
		ctx.lineTo(0, height);
		ctx.closePath();
		ctx.fill();
		ctx.restore();
	}

	getEnvelopeElement(type, number) {
		return parseInt(document.getElementById(`ENV_${type}${number}`).value);
	}

	getEnvelopeLevelValue(levelNumber) {

		return this.getEnvelopeElement('L', levelNumber);
	}

	getEnvelopeTimeValue(timeNumber) {
		return this.getEnvelopeElement('T', timeNumber);
	}

	getCanvas() {

		return document.getElementById('visual_envelope');
	}

	getContext() {

		return this.getCanvas().getContext('2d');
	}

	constructor(ui) {

		this.ui = ui;
	}
}