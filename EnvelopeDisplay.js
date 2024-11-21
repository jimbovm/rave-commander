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

class EnvelopeDisplay {

	drawBreakpoints() {

		const ctx = this.getContext();
		const height = this.getCanvas().height;
		const width = this.getCanvas().width;
		const lineWidth = 1;

		ctx.save();
		
		ctx.strokeStyle = 'gray';
		ctx.lineWidth = lineWidth;

		// level breakpoint
		for (let l = 1; l <= 3; l++) {

			const level = this.getEnvelopeLevelValue(l);
			ctx.beginPath();
			ctx.moveTo(0, 127 - level);
			ctx.lineTo(width, 127 - level);
			ctx.closePath();
			ctx.stroke();
		}

		// time breakpoint
		let offset = 0;

		for (let l = 1; l <= 4; l++) {

		 	const time = this.getEnvelopeTimeValue(l);
			ctx.beginPath();
		 	ctx.moveTo(offset + time, 0);
		 	ctx.lineTo(offset + time, height);
			ctx.closePath();
			ctx.stroke();
			offset = offset + time;
		}

		ctx.restore();
	}

	drawEnvelope() {
		

		const ctx = this.getContext();
		const canvas = this.getCanvas();
		const width = canvas.width;
		const height = canvas.height;
		const lineWidth = 2;

		ctx.clearRect(0, 0, width, height);
		this.drawBreakpoints();

		ctx.lineWidth = lineWidth;
		ctx.strokeStyle = 'red';

		ctx.moveTo(0, height);
		ctx.beginPath();

		let endX = 0;
		let endY = 0;

		for (let l = 1; l <= 3; l++) {
		
			let level = this.getEnvelopeLevelValue(l);
			let time = this.getEnvelopeTimeValue(l);

			endX = endX + time;
			endY = height-level;
			ctx.lineTo(endX, endY);
		}

		let t4 = this.getEnvelopeTimeValue(4);

		ctx.bezierCurveTo(endX, endY, endX, height, endX + t4, height, endX + t4, height);

		ctx.lineTo(endX + t4, height + lineWidth);
		ctx.lineTo(0, height + lineWidth);
		ctx.lineTo(0, height);
		ctx.closePath();
		ctx.stroke();
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
}