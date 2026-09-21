// Procedural Canvas Sprite and Environmental Renderers for BB and Hrick

import { BBAnimation, HrickAnimation } from '../types';

export class SpriteRenderer {
  // Render BB (The Girl)
  public static renderBB(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    anim: BBAnimation,
    facingLeft: boolean,
    animTime: number,
    isWet: boolean = false
  ) {
    ctx.save();
    ctx.translate(x, y);
    if (facingLeft) {
      ctx.scale(-1, 1);
    }

    // Shadow
    ctx.fillStyle = 'rgba(40, 30, 45, 0.22)';
    ctx.beginPath();
    ctx.ellipse(0, 0, 16, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    const walkCycle = Math.sin(animTime * 10);
    const runCycle = Math.sin(animTime * 16);
    const breathe = Math.sin(animTime * 2.5) * 1.5;

    let bodyY = -34 + breathe;
    let legOffset = 0;
    let legAngle1 = 0;
    let legAngle2 = 0;

    if (anim === 'walk') {
      legAngle1 = walkCycle * 0.35;
      legAngle2 = -walkCycle * 0.35;
      bodyY += Math.abs(walkCycle) * 2;
    } else if (anim === 'run') {
      legAngle1 = runCycle * 0.6;
      legAngle2 = -runCycle * 0.6;
      bodyY += Math.abs(runCycle) * 3 - 2;
    } else if (anim === 'crouch' || anim === 'pet' || anim === 'bath') {
      bodyY = -22;
    } else if (anim === 'sit') {
      bodyY = -26;
    }

    // LEGS
    ctx.save();
    ctx.strokeStyle = '#4A3B32'; // Leggings / pants
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';

    if (anim === 'sit' || anim === 'crouch') {
      // Folded legs
      ctx.beginPath();
      ctx.moveTo(-4, -12);
      ctx.lineTo(8, -6);
      ctx.lineTo(12, 0);
      ctx.stroke();

      // Shoes
      ctx.fillStyle = '#A35C4A';
      ctx.beginPath();
      ctx.ellipse(12, 0, 5, 3, 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Leg 1 (back)
      ctx.beginPath();
      ctx.moveTo(-4, bodyY + 16);
      ctx.lineTo(-4 + Math.sin(legAngle1) * 12, 0);
      ctx.stroke();

      // Shoe 1
      ctx.fillStyle = '#A35C4A';
      ctx.beginPath();
      ctx.ellipse(-4 + Math.sin(legAngle1) * 12, 0, 4.5, 3, 0, 0, Math.PI * 2);
      ctx.fill();

      // Leg 2 (front)
      ctx.beginPath();
      ctx.moveTo(4, bodyY + 16);
      ctx.lineTo(4 + Math.sin(legAngle2) * 12, 0);
      ctx.stroke();

      // Shoe 2
      ctx.beginPath();
      ctx.ellipse(4 + Math.sin(legAngle2) * 12, 0, 4.5, 3, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // TORSO / SWEATER (Warm mustard / coral cozy knit)
    ctx.save();
    ctx.fillStyle = isWet ? '#8B5A4B' : '#E88B6E'; // sweater color
    ctx.strokeStyle = '#C96E54';
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.roundRect(-10, bodyY, 20, 18, 6);
    ctx.fill();
    ctx.stroke();

    // Little knitted collar
    ctx.fillStyle = '#FDF0D5';
    ctx.beginPath();
    ctx.arc(0, bodyY + 1, 4.5, 0, Math.PI);
    ctx.fill();
    ctx.restore();

    // ARMS & HANDS
    ctx.save();
    ctx.strokeStyle = '#E88B6E';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';

    if (anim === 'pet') {
      // Reaching down forward to pet
      const petWave = Math.sin(animTime * 8) * 3;
      ctx.beginPath();
      ctx.moveTo(4, bodyY + 4);
      ctx.lineTo(14, bodyY + 14 + petWave);
      ctx.lineTo(18, bodyY + 18 + petWave);
      ctx.stroke();

      // Gentle hand
      ctx.fillStyle = '#F5D0B5';
      ctx.beginPath();
      ctx.arc(18, bodyY + 18 + petWave, 2.5, 0, Math.PI * 2);
      ctx.fill();
    } else if (anim === 'carry') {
      // Both arms wrapped around Hrick
      ctx.beginPath();
      ctx.moveTo(-6, bodyY + 4);
      ctx.lineTo(0, bodyY + 12);
      ctx.lineTo(8, bodyY + 8);
      ctx.stroke();
    } else if (anim === 'walk') {
      // Natural arm swing
      ctx.beginPath();
      ctx.moveTo(0, bodyY + 4);
      ctx.lineTo(Math.sin(-walkCycle) * 7, bodyY + 14);
      ctx.stroke();
    } else if (anim === 'feed') {
      // Holding food dish forward
      ctx.beginPath();
      ctx.moveTo(2, bodyY + 4);
      ctx.lineTo(12, bodyY + 10);
      ctx.stroke();
      // Bowl in hand
      ctx.fillStyle = '#6BA292';
      ctx.beginPath();
      ctx.ellipse(14, bodyY + 10, 6, 3, 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Resting arms
      ctx.beginPath();
      ctx.moveTo(2, bodyY + 4);
      ctx.lineTo(4, bodyY + 13);
      ctx.stroke();
    }
    ctx.restore();

    // HEAD & FACE
    ctx.save();
    const headY = bodyY - 14;

    // Head base (Skin tone)
    ctx.fillStyle = '#F5D0B5';
    ctx.beginPath();
    ctx.arc(0, headY, 11, 0, Math.PI * 2);
    ctx.fill();

    // Hair - Cute chestnut bob with bun
    ctx.fillStyle = '#4A2E20';
    // Back hair / bun
    ctx.beginPath();
    ctx.arc(-8, headY - 6, 7, 0, Math.PI * 2); // Little bun
    ctx.fill();

    // Hair bun pin (Sage green)
    ctx.fillStyle = '#78A083';
    ctx.beginPath();
    ctx.arc(-9, headY - 8, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Front bangs and side hair
    ctx.fillStyle = '#4A2E20';
    ctx.beginPath();
    ctx.arc(0, headY - 3, 11.5, Math.PI * 0.9, Math.PI * 2.1);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(-11, headY - 2);
    ctx.quadraticCurveTo(-4, headY - 1, 5, headY - 5);
    ctx.quadraticCurveTo(8, headY + 3, 10, headY + 6);
    ctx.lineTo(11, headY - 5);
    ctx.fill();

    // Face Features
    // Cheeks
    ctx.fillStyle = 'rgba(235, 120, 110, 0.45)';
    ctx.beginPath();
    ctx.ellipse(4, headY + 3, 2.5, 1.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#2A1B14';
    if (anim === 'sleep' || anim === 'cuddle') {
      // Gentle closed happy curved eyes: ^^
      ctx.strokeStyle = '#2A1B14';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(3, headY, 2.2, Math.PI * 0.1, Math.PI * 0.9);
      ctx.stroke();
    } else if (anim === 'surprised') {
      ctx.beginPath();
      ctx.arc(3.5, headY - 1, 2.5, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Lively friendly indie eye with shine
      ctx.beginPath();
      ctx.arc(3.5, headY, 2.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(4.2, headY - 0.7, 0.8, 0, Math.PI * 2);
      ctx.fill();
    }

    // Mouth
    ctx.strokeStyle = '#9C4C38';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    if (anim === 'laugh' || anim === 'pet' || anim === 'feed') {
      // Warm open smile
      ctx.arc(4, headY + 4, 2, 0, Math.PI);
    } else {
      // Sweet subtle smile
      ctx.arc(3.5, headY + 4, 1.5, 0.2, Math.PI * 0.9);
    }
    ctx.stroke();

    // Water droplets if wet
    if (isWet) {
      ctx.fillStyle = '#64B5F6';
      ctx.beginPath();
      ctx.arc(-2, headY - 8, 1.5, 0, Math.PI * 2);
      ctx.arc(8, bodyY + 5, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
    ctx.restore();
  }

  // Render Hrick (The Autonomous AI Cat)
  public static renderHrick(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    anim: HrickAnimation,
    facingLeft: boolean,
    animTime: number,
    isWet: boolean = false,
    isFluffy: boolean = false
  ) {
    ctx.save();
    ctx.translate(x, y);
    if (facingLeft) {
      ctx.scale(-1, 1);
    }

    // Shadow
    ctx.fillStyle = 'rgba(40, 30, 45, 0.2)';
    ctx.beginPath();
    ctx.ellipse(0, 0, 11, 4.5, 0, 0, Math.PI * 2);
    ctx.fill();

    const walkCycle = Math.sin(animTime * 12);
    const runCycle = Math.sin(animTime * 20);
    const purrBob = Math.sin(animTime * 8) * 0.8;
    const breathe = Math.sin(animTime * 2.8) * 1.2;

    const baseColor = isFluffy ? '#FFF5EA' : (isWet ? '#C2A385' : '#FAF0E4'); // Soft warm cream
    const patchColor = isFluffy ? '#E89E62' : (isWet ? '#A86838' : '#DE8C4C'); // Warm caramel ginger patch
    const eyeColor = '#38B000'; // Emerald green
    const noseColor = '#F28482';

    if (anim === 'curled' || anim === 'sleep') {
      // Curled up sleeping donut!
      ctx.save();
      ctx.translate(0, -7 + breathe);

      // Body circle
      ctx.fillStyle = baseColor;
      ctx.beginPath();
      ctx.ellipse(0, 0, 12, 9, 0, 0, Math.PI * 2);
      ctx.fill();

      // Ginger patch on back
      ctx.fillStyle = patchColor;
      ctx.beginPath();
      ctx.arc(-3, -2, 6, 0, Math.PI);
      ctx.fill();

      // Curled Tail wrapped around
      ctx.strokeStyle = patchColor;
      ctx.lineWidth = 3.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(0, 2, 11, 0, Math.PI * 1.2);
      ctx.stroke();

      // Sleeping head tucked in
      ctx.fillStyle = baseColor;
      ctx.beginPath();
      ctx.arc(7, -1, 6.5, 0, Math.PI * 2);
      ctx.fill();

      // Ears
      ctx.fillStyle = patchColor;
      ctx.beginPath();
      ctx.moveTo(6, -6);
      ctx.lineTo(8, -11);
      ctx.lineTo(10, -5);
      ctx.fill();

      // Sleeping closed eyes: u u
      ctx.strokeStyle = '#5E4028';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(8.5, 0, 1.3, 0, Math.PI);
      ctx.stroke();

      // Tiny pink nose
      ctx.fillStyle = noseColor;
      ctx.beginPath();
      ctx.arc(10, 1, 1, 0, Math.PI * 2);
      ctx.fill();

      // Zzz indicator
      ctx.fillStyle = 'rgba(140, 120, 160, 0.7)';
      ctx.font = '10px Comfortaa, sans-serif';
      const zOffset = (animTime * 15) % 20;
      ctx.fillText('z', 12 + zOffset * 0.3, -8 - zOffset);

      ctx.restore();
      ctx.restore();
      return;
    }

    if (anim === 'in_box') {
      // Hrick peeking out of cardboard box!
      ctx.save();
      // Box body
      ctx.fillStyle = '#C89D6C';
      ctx.strokeStyle = '#9C7040';
      ctx.lineWidth = 1.5;
      ctx.fillRect(-14, -14, 28, 14);
      ctx.strokeRect(-14, -14, 28, 14);

      // Flaps
      ctx.fillStyle = '#B88B58';
      ctx.beginPath();
      ctx.moveTo(-14, -14);
      ctx.lineTo(-18, -20);
      ctx.lineTo(-8, -14);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(14, -14);
      ctx.lineTo(18, -20);
      ctx.lineTo(8, -14);
      ctx.fill();

      // Cat head peeking
      ctx.fillStyle = baseColor;
      ctx.beginPath();
      ctx.arc(0, -13, 8, Math.PI * 0.9, Math.PI * 2.1);
      ctx.fill();

      // Ears
      ctx.fillStyle = patchColor;
      ctx.beginPath();
      ctx.moveTo(-6, -17);
      ctx.lineTo(-4, -24);
      ctx.lineTo(0, -18);
      ctx.fill();

      ctx.fillStyle = baseColor;
      ctx.beginPath();
      ctx.moveTo(1, -18);
      ctx.lineTo(5, -24);
      ctx.lineTo(7, -17);
      ctx.fill();

      // Big curious eyes peering over box rim
      ctx.fillStyle = eyeColor;
      ctx.beginPath();
      ctx.arc(-3, -15, 2.5, 0, Math.PI * 2);
      ctx.arc(3, -15, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(-3, -15, 1.5, 0, Math.PI * 2);
      ctx.arc(3, -15, 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(-2.5, -15.5, 0.7, 0, Math.PI * 2);
      ctx.arc(3.5, -15.5, 0.7, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
      ctx.restore();
      return;
    }

    // STANDARD STANDING / WALKING / SITTING
    let bodyY = -12 + (anim === 'rub' || anim === 'purr' ? purrBob : breathe);
    let headY = bodyY - 6;
    let headX = 6;
    let bodyLength = 18;
    let tailAngle = Math.sin(animTime * 4) * 0.3;

    if (anim === 'walk') {
      bodyY += Math.abs(walkCycle) * 1.5;
      tailAngle = Math.sin(animTime * 10) * 0.4;
    } else if (anim === 'run' || anim === 'zoomies') {
      bodyY += Math.abs(runCycle) * 2 - 2;
      tailAngle = Math.sin(animTime * 18) * 0.6;
    } else if (anim === 'stretch') {
      bodyY = -6;
      headY = -4;
      headX = 10;
    } else if (anim === 'bath_scared') {
      tailAngle = Math.sin(animTime * 25) * 0.8;
    }

    // LEGS
    ctx.save();
    ctx.strokeStyle = baseColor;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';

    if (anim === 'sit' || anim === 'on_lap') {
      // Folded paws in front
      ctx.beginPath();
      ctx.moveTo(3, bodyY + 6);
      ctx.lineTo(5, 0);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(-4, bodyY + 6);
      ctx.lineTo(-4, 0);
      ctx.stroke();
    } else if (anim === 'walk') {
      ctx.beginPath();
      ctx.moveTo(6, bodyY + 5);
      ctx.lineTo(6 + walkCycle * 4, 0);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(-6, bodyY + 5);
      ctx.lineTo(-6 - walkCycle * 4, 0);
      ctx.stroke();
    } else if (anim === 'run' || anim === 'zoomies') {
      ctx.beginPath();
      ctx.moveTo(7, bodyY + 5);
      ctx.lineTo(7 + runCycle * 7, 0);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(-7, bodyY + 5);
      ctx.lineTo(-7 - runCycle * 7, 0);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.moveTo(5, bodyY + 5);
      ctx.lineTo(5, 0);
      ctx.moveTo(-5, bodyY + 5);
      ctx.lineTo(-5, 0);
      ctx.stroke();
    }
    ctx.restore();

    // BODY
    ctx.save();
    ctx.fillStyle = baseColor;
    const bodyW = isFluffy ? 13 : 10;
    const bodyH = isFluffy ? 10 : 8;

    ctx.beginPath();
    ctx.ellipse(0, bodyY, bodyW, bodyH, 0, 0, Math.PI * 2);
    ctx.fill();

    // Caramel patch on back
    ctx.fillStyle = patchColor;
    ctx.beginPath();
    ctx.ellipse(-2, bodyY - 2, bodyW * 0.5, bodyH * 0.6, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // TAIL
    ctx.save();
    ctx.strokeStyle = patchColor;
    ctx.lineWidth = isFluffy ? 4.5 : 3.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-8, bodyY);
    ctx.quadraticCurveTo(-14, bodyY - 12 + Math.sin(tailAngle) * 5, -10 + Math.cos(tailAngle) * 8, bodyY - 16);
    ctx.stroke();

    // Tail tip (White/Cream tip)
    ctx.strokeStyle = baseColor;
    ctx.lineWidth = isFluffy ? 4.5 : 3.5;
    ctx.beginPath();
    ctx.moveTo(-11 + Math.cos(tailAngle) * 7, bodyY - 15);
    ctx.lineTo(-10 + Math.cos(tailAngle) * 8, bodyY - 16);
    ctx.stroke();
    ctx.restore();

    // HEAD
    ctx.save();
    ctx.translate(headX, headY);

    if (anim === 'rub') {
      ctx.rotate(Math.sin(animTime * 6) * 0.2);
    } else if (anim === 'curious') {
      ctx.rotate(0.25); // Inquisitive head tilt!
    }

    // Head circle
    ctx.fillStyle = baseColor;
    ctx.beginPath();
    ctx.arc(0, 0, isFluffy ? 9 : 7.5, 0, Math.PI * 2);
    ctx.fill();

    // Patch on right ear
    ctx.fillStyle = patchColor;
    ctx.beginPath();
    ctx.arc(-1, -2, 5, Math.PI * 0.8, Math.PI * 1.8);
    ctx.fill();

    // EARS
    // Left Ear
    ctx.fillStyle = patchColor;
    ctx.beginPath();
    ctx.moveTo(-5, -4);
    ctx.lineTo(-6, -11);
    ctx.lineTo(-1, -6);
    ctx.fill();

    // Right Ear
    ctx.fillStyle = baseColor;
    ctx.beginPath();
    ctx.moveTo(1, -6);
    ctx.lineTo(5, -11);
    ctx.lineTo(6, -4);
    ctx.fill();

    // Inner ear pink
    ctx.fillStyle = '#FFC6C4';
    ctx.beginPath();
    ctx.moveTo(-4, -5);
    ctx.lineTo(-5, -9);
    ctx.lineTo(-2, -6);
    ctx.fill();

    // EYES
    ctx.fillStyle = eyeColor;
    const eyeSize = (anim === 'bath_scared' || anim === 'zoomies') ? 2.8 : 2.2;
    ctx.beginPath();
    ctx.arc(2, -1, eyeSize, 0, Math.PI * 2);
    ctx.fill();

    // Pupil
    ctx.fillStyle = '#1B2616';
    const pupilW = (anim === 'bath_scared' || anim === 'zoomies') ? 2.2 : 1.2;
    ctx.beginPath();
    ctx.ellipse(2, -1, pupilW, eyeSize * 0.9, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eye Shine
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(2.6, -1.8, 0.7, 0, Math.PI * 2);
    ctx.fill();

    // NOSE & MOUTH
    ctx.fillStyle = noseColor;
    ctx.beginPath();
    ctx.moveTo(5, 1);
    ctx.lineTo(6.2, 0.3);
    ctx.lineTo(6.2, 1.7);
    ctx.fill();

    // Whiskers
    ctx.strokeStyle = '#5E4028';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(6, 1);
    ctx.lineTo(11, -0.5);
    ctx.moveTo(6, 2);
    ctx.lineTo(11, 3);
    ctx.stroke();

    // Yawn animation tongue
    if (anim === 'yawn') {
      ctx.fillStyle = '#FF8FA3';
      ctx.beginPath();
      ctx.arc(5, 3.5, 2.5, 0, Math.PI);
      ctx.fill();
    }

    ctx.restore();
    ctx.restore();
  }

  // Render Speech Bubble
  public static renderSpeechBubble(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    text: string,
    isThought: boolean = false,
    speaker: 'hrick' | 'bb' | 'cafe_cat' = 'hrick',
    speakerName?: string
  ) {
    ctx.save();
    ctx.font = '600 13px Nunito, sans-serif';
    const paddingX = 12;
    const paddingY = 8;
    const metrics = ctx.measureText(text);
    const textW = Math.max(metrics.width, speakerName ? 70 : 40);
    const bubbleW = textW + paddingX * 2;
    const bubbleH = 32 + (speakerName ? 14 : 0);

    const bx = x - bubbleW / 2;
    const by = y - bubbleH - 12;

    // Shadow
    ctx.fillStyle = 'rgba(30, 20, 35, 0.15)';
    ctx.beginPath();
    ctx.roundRect(bx + 1, by + 2, bubbleW, bubbleH, 12);
    ctx.fill();

    // Bubble Background
    const bgCol = speaker === 'hrick' ? '#FFFBF5' : (speaker === 'bb' ? '#FFF5F0' : '#F4F7F6');
    const borderCol = speaker === 'hrick' ? '#E8C59A' : (speaker === 'bb' ? '#E2A999' : '#ADC5BE');

    ctx.fillStyle = bgCol;
    ctx.strokeStyle = borderCol;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(bx, by, bubbleW, bubbleH, 12);
    ctx.fill();
    ctx.stroke();

    // Pointer tail
    if (!isThought) {
      ctx.fillStyle = bgCol;
      ctx.strokeStyle = borderCol;
      ctx.beginPath();
      ctx.moveTo(x - 5, by + bubbleH);
      ctx.lineTo(x, by + bubbleH + 7);
      ctx.lineTo(x + 5, by + bubbleH);
      ctx.fill();
      ctx.stroke();
      // Hide inner seam
      ctx.fillStyle = bgCol;
      ctx.fillRect(x - 4, by + bubbleH - 2, 8, 3);
    } else {
      // Thought circles
      ctx.fillStyle = bgCol;
      ctx.strokeStyle = borderCol;
      ctx.beginPath();
      ctx.arc(x, by + bubbleH + 4, 3, 0, Math.PI * 2);
      ctx.arc(x, by + bubbleH + 9, 1.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    // Speaker Name Tag if present
    let textY = by + paddingY + 14;
    if (speakerName) {
      ctx.fillStyle = speaker === 'hrick' ? '#C27438' : (speaker === 'bb' ? '#B85842' : '#588878');
      ctx.font = '700 10px Comfortaa, sans-serif';
      ctx.fillText(speakerName.toUpperCase(), bx + paddingX, by + 13);
      textY += 12;
    }

    // Text
    ctx.fillStyle = '#3A2E2B';
    ctx.font = '600 13px Nunito, sans-serif';
    ctx.fillText(text, bx + paddingX, textY);

    ctx.restore();
  }

  // Render Toy Item on Ground or Flying
  public static renderToy(ctx: CanvasRenderingContext2D, toy: { type: string; x: number; y: number; isInPlay?: boolean }) {
    ctx.save();
    ctx.translate(toy.x, toy.y);

    if (toy.type === 'yarn') {
      ctx.fillStyle = '#E85D75';
      ctx.beginPath();
      ctx.arc(0, 0, 8, 0, Math.PI * 2);
      ctx.fill();
      // Little string trail
      ctx.strokeStyle = '#E85D75';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(4, 4);
      ctx.quadraticCurveTo(12, 10, 18, 6);
      ctx.stroke();
    } else if (toy.type === 'feather') {
      ctx.strokeStyle = '#5E503F';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-10, 6);
      ctx.lineTo(8, -6);
      ctx.stroke();
      // Colorful feathers
      ctx.fillStyle = '#F4A261';
      ctx.beginPath();
      ctx.ellipse(10, -8, 7, 3, -0.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#2A9D8F';
      ctx.beginPath();
      ctx.ellipse(8, -10, 6, 2.5, -0.3, 0, Math.PI * 2);
      ctx.fill();
    } else if (toy.type === 'mouse') {
      ctx.fillStyle = '#A3B18A';
      ctx.beginPath();
      ctx.ellipse(0, 0, 7, 4.5, 0, 0, Math.PI * 2);
      ctx.fill();
      // Pink ears
      ctx.fillStyle = '#FFCAD4';
      ctx.beginPath();
      ctx.arc(3, -3, 2, 0, Math.PI * 2);
      ctx.fill();
      // String tail
      ctx.strokeStyle = '#FFCAD4';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-7, 0);
      ctx.quadraticCurveTo(-12, -4, -15, 2);
      ctx.stroke();
    } else if (toy.type === 'ball') {
      ctx.fillStyle = '#4EA8DE';
      ctx.beginPath();
      ctx.arc(0, 0, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FFE494';
      ctx.beginPath();
      ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
      ctx.fill();
    } else if (toy.type === 'box') {
      ctx.fillStyle = '#C89D6C';
      ctx.strokeStyle = '#8D6335';
      ctx.lineWidth = 1.5;
      ctx.fillRect(-16, -16, 32, 16);
      ctx.strokeRect(-16, -16, 32, 16);
      // Flaps
      ctx.fillStyle = '#B88B58';
      ctx.beginPath();
      ctx.moveTo(-16, -16);
      ctx.lineTo(-22, -22);
      ctx.lineTo(-8, -16);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(16, -16);
      ctx.lineTo(22, -22);
      ctx.lineTo(8, -16);
      ctx.fill();
    }

    ctx.restore();
  }
}
