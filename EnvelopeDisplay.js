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