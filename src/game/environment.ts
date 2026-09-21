// Handcrafted 2D Cozy Environment Renderers

import { GameLocation, WeatherType, Particle } from '../types';
import { CAFE_CATS, TV_SHOWS } from './constants';

export class EnvironmentRenderer {
  public static renderScene(
    ctx: CanvasRenderingContext2D,
    location: GameLocation,
    weather: WeatherType,
    time: number,
    tvChannel: number = 0,
    waterLevel: number = 0
  ) {
    switch (location) {
      case 'street_rain':
        this.renderStreetRain(ctx, time);
        break;
      case 'living_room':
        this.renderLivingRoom(ctx, time, tvChannel);
        break;
      case 'kitchen':
        this.renderKitchen(ctx, time);
        break;
      case 'bathroom':
        this.renderBathroom(ctx, time, waterLevel);
        break;
      case 'bedroom':
        this.renderBedroom(ctx, time);
        break;
      case 'neighborhood':
        this.renderNeighborhood(ctx, time);
        break;
      case 'cat_cafe':
        this.renderCatCafe(ctx, time);
        break;
      case 'veranda_night':
        this.renderVerandaNight(ctx, time);
        break;
    }
  }

  // 1. Rainy Street (Chapter 1)
  private static renderStreetRain(ctx: CanvasRenderingContext2D, time: number) {
    // Gloomy blue-gray evening sky
    ctx.fillStyle = '#32374A';
    ctx.fillRect(0, 0, 1100, 520);

    // Distant dark town silhouette
    ctx.fillStyle = '#25293A';
    ctx.beginPath();
    ctx.moveTo(0, 320);
    ctx.lineTo(80, 260);
    ctx.lineTo(160, 290);
    ctx.lineTo(240, 240);
    ctx.lineTo(340, 280);
    ctx.lineTo(440, 220);
    ctx.lineTo(580, 270);
    ctx.lineTo(720, 230);
    ctx.lineTo(840, 280);
    ctx.lineTo(950, 240);
    ctx.lineTo(1100, 310);
    ctx.lineTo(1100, 520);
    ctx.lineTo(0, 520);
    ctx.fill();

    // Sidewalk curb & asphalt road
    ctx.fillStyle = '#3E424E';
    ctx.fillRect(0, 320, 1100, 200);

    // Wet pavement sheen
    ctx.fillStyle = '#2C303D';
    ctx.fillRect(0, 370, 1100, 150);

    // Puddle on ground with reflections
    ctx.fillStyle = 'rgba(70, 85, 120, 0.4)';
    ctx.beginPath();
    ctx.ellipse(320, 410, 85, 24, 0, 0, Math.PI * 2);
    ctx.ellipse(750, 430, 95, 26, 0, 0, Math.PI * 2);
    ctx.fill();

    // Rainy Bus Stop Shelter (where Hrick first waits!)
    ctx.save();
    const shelterX = 260;
    const shelterY = 240;

    // Roof poles
    ctx.strokeStyle = '#1D212E';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(shelterX - 55, shelterY + 120);
    ctx.lineTo(shelterX - 55, shelterY + 20);
    ctx.lineTo(shelterX + 65, shelterY + 10);
    ctx.lineTo(shelterX + 65, shelterY + 120);
    ctx.stroke();

    // Shelter Back Glass
    ctx.fillStyle = 'rgba(100, 120, 160, 0.25)';
    ctx.fillRect(shelterX - 52, shelterY + 20, 114, 98);

    // Wooden Bench
    ctx.fillStyle = '#7C5C43';
    ctx.fillRect(shelterX - 45, shelterY + 80, 100, 10);
    // Bench legs
    ctx.fillStyle = '#4A3525';
    ctx.fillRect(shelterX - 40, shelterY + 90, 6, 26);
    ctx.fillRect(shelterX + 45, shelterY + 90, 6, 26);

    // Shelter Corrugated Roof
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.moveTo(shelterX - 70, shelterY + 22);
    ctx.lineTo(shelterX + 80, shelterY + 8);
    ctx.lineTo(shelterX + 80, shelterY - 4);
    ctx.lineTo(shelterX - 70, shelterY + 10);
    ctx.fill();
    ctx.restore();

    // Warm street lamppost
    ctx.save();
    const lampX = 820;
    const lampY = 170;
    ctx.strokeStyle = '#1A1E29';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(lampX, 390);
    ctx.lineTo(lampX, lampY);
    ctx.quadraticCurveTo(lampX, lampY - 30, lampX - 25, lampY - 25);
    ctx.stroke();

    // Lamp light glow cone
    const lampGlow = ctx.createRadialGradient(lampX - 25, lampY - 15, 5, lampX - 25, lampY + 120, 140);
    lampGlow.addColorStop(0, 'rgba(255, 230, 160, 0.45)');
    lampGlow.addColorStop(0.5, 'rgba(255, 210, 120, 0.18)');
    lampGlow.addColorStop(1, 'rgba(255, 210, 120, 0)');
    ctx.fillStyle = lampGlow;
    ctx.beginPath();
    ctx.moveTo(lampX - 25, lampY - 15);
    ctx.lineTo(lampX - 110, 410);
    ctx.lineTo(lampX + 60, 410);
    ctx.fill();

    // Glass bulb
    ctx.fillStyle = '#FFE699';
    ctx.beginPath();
    ctx.arc(lampX - 25, lampY - 18, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // BB's Cozy House Door at the right end
    ctx.save();
    const doorX = 980;
    ctx.fillStyle = '#E5D6C5';
    ctx.fillRect(doorX - 40, 200, 120, 170); // House wall
    ctx.fillStyle = '#A85A48';
    ctx.fillRect(doorX - 10, 225, 65, 145); // Door
    ctx.fillStyle = '#F4A261';
    ctx.beginPath();
    ctx.arc(doorX + 45, 295, 4, 0, Math.PI * 2); // Brass knob
    ctx.fill();

    // Welcome mat
    ctx.fillStyle = '#C29871';
    ctx.fillRect(doorX - 5, 370, 55, 12);
    ctx.strokeStyle = '#8D6335';
    ctx.strokeRect(doorX - 5, 370, 55, 12);

    // Warm porch light above door
    const porchGlow = ctx.createRadialGradient(doorX + 22, 210, 2, doorX + 22, 210, 60);
    porchGlow.addColorStop(0, 'rgba(255, 235, 170, 0.7)');
    porchGlow.addColorStop(1, 'rgba(255, 235, 170, 0)');
    ctx.fillStyle = porchGlow;
    ctx.beginPath();
    ctx.arc(doorX + 22, 210, 60, 0, Math.PI * 2);
    ctx.fill();

    // Cozy Door Plaque & Interactive Sign
    const bounce = Math.sin(time * 3.5) * 2.5;
    ctx.fillStyle = '#4A3225';
    ctx.fillRect(doorX - 2, 216, 48, 12);
    ctx.fillStyle = '#FFF8F0';
    ctx.font = 'bold 7px Comfortaa, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('KITCHEN', doorX + 22, 225);

    // Warm inviting indicator floating above door
    ctx.fillStyle = 'rgba(244, 162, 97, 0.92)';
    ctx.beginPath();
    ctx.roundRect(doorX - 16, 178 + bounce, 76, 18, 9);
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = '#3D2514';
    ctx.font = 'bold 8px Comfortaa, sans-serif';
    ctx.fillText('DOOR [E]', doorX + 22, 190 + bounce);
    ctx.restore();
  }

  // 2. Living Room (Chapter 4, 5, 9, Freeplay)
  private static renderLivingRoom(ctx: CanvasRenderingContext2D, time: number, tvChannel: number = 0) {
    // Cozy warm wallpaper (Soft sage / dusty rose)
    ctx.fillStyle = '#E8E1D5';
    ctx.fillRect(0, 0, 1100, 270);

    // Subtle beadboard panels
    ctx.strokeStyle = '#D9CFBF';
    ctx.lineWidth = 1;
    for (let x = 0; x < 1100; x += 36) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 270);
      ctx.stroke();
    }

    // Warm wooden floorboards
    ctx.fillStyle = '#D6B898';
    ctx.fillRect(0, 270, 1100, 250);
    ctx.strokeStyle = '#C4A482';
    ctx.lineWidth = 1.5;
    for (let y = 270; y < 520; y += 32) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1100, y);
      ctx.stroke();
    }

    // Baseboard trim
    ctx.fillStyle = '#F5EEE6';
    ctx.fillRect(0, 262, 1100, 10);

    // Large living room window with curtains
    ctx.save();
    const winX = 140;
    ctx.fillStyle = '#BEE1E6'; // Sky through window
    ctx.fillRect(winX, 50, 130, 150);

    // Swaying tree leaves through window
    ctx.fillStyle = '#7CA982';
    const leafSway = Math.sin(time * 2) * 5;
    ctx.beginPath();
    ctx.arc(winX + 40 + leafSway, 90, 35, 0, Math.PI * 2);
    ctx.arc(winX + 90 - leafSway, 75, 40, 0, Math.PI * 2);
    ctx.fill();

    // Window frame
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 6;
    ctx.strokeRect(winX, 50, 130, 150);
    ctx.beginPath();
    ctx.moveTo(winX + 65, 50);
    ctx.lineTo(winX + 65, 200);
    ctx.moveTo(winX, 125);
    ctx.lineTo(winX + 130, 125);
    ctx.stroke();

    // Soft Curtains swaying
    const curtainWave = Math.sin(time * 2.5) * 4;
    ctx.fillStyle = '#E8B4B8';
    ctx.beginPath();
    ctx.moveTo(winX - 10, 45);
    ctx.quadraticCurveTo(winX + 15 + curtainWave, 120, winX + 5, 210);
    ctx.lineTo(winX - 15, 210);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(winX + 140, 45);
    ctx.quadraticCurveTo(winX + 115 - curtainWave, 120, winX + 125, 210);
    ctx.lineTo(winX + 145, 210);
    ctx.fill();
    ctx.restore();

    // Framed picture on wall (Cat paw print & cute coffee cup)
    ctx.save();
    ctx.fillStyle = '#8D5B4C';
    ctx.fillRect(360, 70, 70, 80);
    ctx.fillStyle = '#FFFBF2';
    ctx.fillRect(365, 75, 60, 70);
    ctx.fillStyle = '#E29578';
    ctx.beginPath();
    ctx.ellipse(395, 115, 12, 9, 0, 0, Math.PI * 2);
    ctx.arc(385, 100, 4, 0, Math.PI * 2);
    ctx.arc(395, 96, 4.5, 0, Math.PI * 2);
    ctx.arc(405, 100, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Cozy Bohemian Oval Rug
    ctx.save();
    ctx.fillStyle = '#E5D0BA';
    ctx.beginPath();
    ctx.ellipse(540, 390, 190, 75, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#D4B89B';
    ctx.lineWidth = 3;
    ctx.stroke();
    // Inner pattern
    ctx.fillStyle = '#839788';
    ctx.beginPath();
    ctx.ellipse(540, 390, 140, 50, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Comfortable Couch (Center stage!)
    ctx.save();
    const couchX = 540;
    const couchY = 320;
    // Couch base & back
    ctx.fillStyle = '#DDA15E'; // Warm caramel mustard
    ctx.strokeStyle = '#BC6C25';
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.roundRect(couchX - 110, couchY - 75, 220, 65, 16);
    ctx.fill();
    ctx.stroke();

    // Couch Seat Cushions
    ctx.beginPath();
    ctx.roundRect(couchX - 105, couchY - 25, 100, 40, 10);
    ctx.roundRect(couchX + 5, couchY - 25, 100, 40, 10);
    ctx.fill();
    ctx.stroke();

    // Armrests
    ctx.beginPath();
    ctx.roundRect(couchX - 125, couchY - 50, 30, 65, 14);
    ctx.roundRect(couchX + 95, couchY - 50, 30, 65, 14);
    ctx.fill();
    ctx.stroke();

    // Floral Throw Pillow
    ctx.fillStyle = '#606C38';
    ctx.beginPath();
    ctx.roundRect(couchX - 95, couchY - 45, 32, 32, 8);
    ctx.fill();
    ctx.fillStyle = '#FEFAE0';
    ctx.beginPath();
    ctx.arc(couchX - 79, couchY - 29, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Potted Monstera Plant
    ctx.save();
    const plantX = 720;
    ctx.fillStyle = '#B08968';
    ctx.beginPath();
    ctx.roundRect(plantX - 18, 300, 36, 40, 4);
    ctx.fill();
    ctx.fillStyle = '#2D6A4F';
    // Monstera leaves
    for (let i = 0; i < 5; i++) {
      const a = (i * 0.5) - 1.0;
      ctx.beginPath();
      ctx.ellipse(plantX + Math.sin(a) * 26, 280 - Math.cos(a) * 20, 18, 9, a, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // TV Set on Media Stand (Right side)
    ctx.save();
    const tvX = 900;
    const tvY = 320;
    // Wooden Stand
    ctx.fillStyle = '#7F5539';
    ctx.fillRect(tvX - 60, tvY, 120, 50);
    ctx.fillStyle = '#9C6644';
    ctx.fillRect(tvX - 55, tvY + 5, 50, 38);
    ctx.fillRect(tvX + 5, tvY + 5, 50, 38);

    // TV Chassis
    ctx.fillStyle = '#212529';
    ctx.fillRect(tvX - 55, tvY - 80, 110, 75);

    // Glowing Animated TV Screen!
    const show = TV_SHOWS[tvChannel % TV_SHOWS.length];
    if (show.id === 'birds') {
      // Sky blue background
      ctx.fillStyle = '#90E0EF';
      ctx.fillRect(tvX - 50, tvY - 75, 100, 65);
      // Tree branch
      ctx.strokeStyle = '#5E503F';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(tvX - 50, tvY - 35);
      ctx.lineTo(tvX + 10, tvY - 45);
      ctx.stroke();
      // Little animated chirping sparrow on screen!
      const birdBounce = Math.sin(time * 8) * 3;
      ctx.fillStyle = '#D4A373';
      ctx.beginPath();
      ctx.arc(tvX - 10, tvY - 52 + birdBounce, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FAEDCD';
      ctx.beginPath();
      ctx.arc(tvX - 7, tvY - 52 + birdBounce, 3, 0, Math.PI * 2);
      ctx.fill();
    } else if (show.id === 'cooking') {
      ctx.fillStyle = '#FFE5D9';
      ctx.fillRect(tvX - 50, tvY - 75, 100, 65);
      // Golden pie / pastry
      ctx.fillStyle = '#E76F51';
      ctx.beginPath();
      ctx.arc(tvX, tvY - 38, 16, Math.PI, 0);
      ctx.fill();
      // Steam
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.beginPath();
      ctx.arc(tvX, tvY - 50 + Math.sin(time * 5) * 3, 4, 0, Math.PI * 2);
      ctx.fill();
    } else if (show.id === 'fish') {
      ctx.fillStyle = '#0077B6';
      ctx.fillRect(tvX - 50, tvY - 75, 100, 65);
      // Bright swimming fish
      const fishX = tvX - 25 + Math.sin(time * 3) * 20;
      ctx.fillStyle = '#FF9E00';
      ctx.beginPath();
      ctx.ellipse(fishX, tvY - 45, 9, 5, 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Weather map
      ctx.fillStyle = '#83C5BE';
      ctx.fillRect(tvX - 50, tvY - 75, 100, 65);
      ctx.fillStyle = '#FFDDD2';
      ctx.beginPath();
      ctx.arc(tvX - 15, tvY - 45, 12, 0, Math.PI * 2);
      ctx.fill();
    }

    // TV Screen Soft Ambient Glow
    const tvGlow = ctx.createRadialGradient(tvX, tvY - 45, 10, tvX, tvY - 45, 100);
    tvGlow.addColorStop(0, 'rgba(180, 220, 255, 0.2)');
    tvGlow.addColorStop(1, 'rgba(180, 220, 255, 0)');
    ctx.fillStyle = tvGlow;
    ctx.beginPath();
    ctx.arc(tvX, tvY - 45, 100, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // 3. Kitchen (Chapter 2)
  private static renderKitchen(ctx: CanvasRenderingContext2D, time: number) {
    // Pastel yellow / cream tiles
    ctx.fillStyle = '#FFF8E7';
    ctx.fillRect(0, 0, 1100, 260);

    ctx.strokeStyle = '#F0E6D2';
    ctx.lineWidth = 1;
    for (let x = 0; x < 1100; x += 30) {
      for (let y = 0; y < 260; y += 30) {
        ctx.strokeRect(x, y, 30, 30);
      }
    }

    // Terracotta tiled kitchen floor
    ctx.fillStyle = '#C86D51';
    ctx.fillRect(0, 260, 1100, 260);
    ctx.strokeStyle = '#A85238';
    ctx.lineWidth = 2;
    for (let x = 0; x < 1100; x += 45) {
      ctx.beginPath();
      ctx.moveTo(x, 260);
      ctx.lineTo(x, 520);
      ctx.stroke();
    }

    // Kitchen Counter with Stove
    ctx.save();
    const counterX = 220;
    // Wooden Cabinets
    ctx.fillStyle = '#588157'; // Sage green cabinetry
    ctx.fillRect(counterX - 90, 200, 320, 140);
    // Countertop (White Marble)
    ctx.fillStyle = '#F8F9FA';
    ctx.fillRect(counterX - 95, 190, 330, 16);

    // Stove burners
    ctx.fillStyle = '#343A40';
    ctx.beginPath();
    ctx.ellipse(counterX - 40, 196, 16, 5, 0, 0, Math.PI * 2);
    ctx.ellipse(counterX + 40, 196, 16, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Boiling Tea Kettle with animated steam!
    ctx.fillStyle = '#E76F51';
    ctx.beginPath();
    ctx.arc(counterX - 40, 180, 12, 0, Math.PI * 2);
    ctx.fill();
    // Kettle spout
    ctx.strokeStyle = '#E76F51';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(counterX - 30, 178);
    ctx.lineTo(counterX - 22, 172);
    ctx.stroke();

    // Steam puffs
    ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
    for (let s = 0; s < 3; s++) {
      const sOffset = (time * 2 + s * 0.8) % 2.5;
      ctx.beginPath();
      ctx.arc(counterX - 20 - sOffset * 4, 165 - sOffset * 15, 3 + sOffset * 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // Retro Mint Refrigerator with Photos & Magnets
    ctx.save();
    const fridgeX = 640;
    ctx.fillStyle = '#84A98C';
    ctx.beginPath();
    ctx.roundRect(fridgeX - 50, 80, 100, 220, 12);
    ctx.fill();

    // Freezer seam
    ctx.strokeStyle = '#52796F';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(fridgeX - 50, 160);
    ctx.lineTo(fridgeX + 50, 160);
    ctx.stroke();

    // Chrome handles
    ctx.fillStyle = '#E9ECEF';
    ctx.fillRect(fridgeX - 42, 120, 8, 30);
    ctx.fillRect(fridgeX - 42, 180, 8, 45);

    // Cute sticky note / polaroid of Hrick!
    ctx.fillStyle = '#FFF176';
    ctx.fillRect(fridgeX - 10, 105, 30, 32);
    ctx.fillStyle = '#E76F51';
    ctx.beginPath();
    ctx.arc(fridgeX + 5, 105, 3, 0, Math.PI * 2); // Red magnet
    ctx.fill();
    ctx.fillStyle = '#52796F';
    ctx.font = '7px Comfortaa, sans-serif';
    ctx.fillText('Hrick ♥', fridgeX - 7, 126);
    ctx.restore();

    // Dining table with ceramic cat bowls
    ctx.save();
    const tableX = 880;
    ctx.fillStyle = '#9C6644';
    ctx.fillRect(tableX - 70, 270, 140, 20); // Table top
    ctx.fillRect(tableX - 60, 290, 12, 70); // Legs
    ctx.fillRect(tableX + 48, 290, 12, 70);

    // Hrick's ceramic food bowl on floor
    ctx.fillStyle = '#3A86FF';
    ctx.beginPath();
    ctx.ellipse(counterX + 110, 340, 18, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFF';
    ctx.font = 'bold 8px Comfortaa, sans-serif';
    ctx.fillText('HRICK', counterX + 96, 343);
    ctx.restore();
  }

  // 4. Bathroom (Chapter 3)
  private static renderBathroom(ctx: CanvasRenderingContext2D, time: number, waterLevel: number) {
    // Turquoise & White Mosaic Tiles
    ctx.fillStyle = '#E0FBFC';
    ctx.fillRect(0, 0, 1100, 270);
    ctx.strokeStyle = '#C2DFE3';
    ctx.lineWidth = 1;
    for (let x = 0; x < 1100; x += 24) {
      for (let y = 0; y < 270; y += 24) {
        ctx.strokeRect(x, y, 24, 24);
      }
    }

    // Checkerboard floor
    for (let x = 0; x < 1100; x += 40) {
      for (let y = 270; y < 520; y += 40) {
        ctx.fillStyle = ((x / 40 + y / 40) % 2 === 0) ? '#FFFFFF' : '#98C1D9';
        ctx.fillRect(x, y, 40, 40);
      }
    }

    // Vintage Clawfoot Bathtub (Center Stage!)
    ctx.save();
    const tubX = 540;
    const tubY = 320;

    // Golden Claw Feet
    ctx.fillStyle = '#EE9B00';
    ctx.beginPath();
    ctx.arc(tubX - 110, tubY + 45, 10, 0, Math.PI * 2);
    ctx.arc(tubX + 110, tubY + 45, 10, 0, Math.PI * 2);
    ctx.fill();

    // Tub Outer Porcelain Shell
    ctx.fillStyle = '#F8F9FA';
    ctx.strokeStyle = '#DEE2E6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(tubX - 130, tubY - 40, 260, 85, 35);
    ctx.fill();
    ctx.stroke();

    // Tub Rim
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.ellipse(tubX, tubY - 35, 125, 20, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Warm Soapy Water & Bubbles!
    ctx.fillStyle = '#A2D2FF';
    ctx.beginPath();
    ctx.ellipse(tubX, tubY - 32, 115, 16, 0, 0, Math.PI * 2);
    ctx.fill();

    // Foamy White Suds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    for (let b = -90; b <= 90; b += 22) {
      const bubbleWobble = Math.sin(time * 3 + b) * 2;
      ctx.beginPath();
      ctx.arc(tubX + b, tubY - 34 + bubbleWobble, 10, 0, Math.PI * 2);
      ctx.fill();
    }

    // Yellow Rubber Ducky in tub!
    const duckBob = Math.sin(time * 4) * 3;
    ctx.fillStyle = '#FFD166';
    ctx.beginPath();
    ctx.arc(tubX + 40, tubY - 38 + duckBob, 9, 0, Math.PI * 2);
    ctx.fill();
    // Ducky beak
    ctx.fillStyle = '#F77F00';
    ctx.beginPath();
    ctx.moveTo(tubX + 47, tubY - 38 + duckBob);
    ctx.lineTo(tubX + 54, tubY - 37 + duckBob);
    ctx.lineTo(tubX + 47, tubY - 34 + duckBob);
    ctx.fill();

    // Fluffy Towel Rack on Wall
    const rackX = 240;
    ctx.fillStyle = '#6C757D';
    ctx.fillRect(rackX - 40, 140, 80, 8);
    // Fluffy Sunny Yellow Towel hanging
    ctx.fillStyle = '#FFE66D';
    ctx.fillRect(rackX - 25, 148, 50, 75);
    ctx.strokeStyle = '#E8D25A';
    ctx.strokeRect(rackX - 25, 148, 50, 75);
    ctx.restore();
  }

  // 5. Bedroom (Chapter 8 - Sick Day)
  private static renderBedroom(ctx: CanvasRenderingContext2D, time: number) {
    // Soft calming lavender wallpaper
    ctx.fillStyle = '#E8DFE8';
    ctx.fillRect(0, 0, 1100, 270);

    // Warm wooden floor
    ctx.fillStyle = '#D4B89B';
    ctx.fillRect(0, 270, 1100, 250);

    // Large Bedroom Window with stars / soft evening light
    ctx.save();
    const winX = 680;
    ctx.fillStyle = '#4A5568';
    ctx.fillRect(winX, 50, 140, 150);

    // Crescent moon outside window
    ctx.fillStyle = '#FFEAA7';
    ctx.beginPath();
    ctx.arc(winX + 40, 90, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#4A5568';
    ctx.beginPath();
    ctx.arc(winX + 47, 88, 18, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 5;
    ctx.strokeRect(winX, 50, 140, 150);
    ctx.restore();

    // Cozy Wooden Bed with Fluffy Quilt
    ctx.save();
    const bedX = 360;
    const bedY = 320;
    // Wooden Headboard
    ctx.fillStyle = '#7F5539';
    ctx.beginPath();
    ctx.roundRect(bedX - 110, bedY - 110, 220, 70, 12);
    ctx.fill();

    // Bed Mattress & Base
    ctx.fillStyle = '#EAE2B7';
    ctx.fillRect(bedX - 100, bedY - 40, 200, 60);

    // Fluffy Sage Green Quilt / Blanket
    ctx.fillStyle = '#84A98C';
    ctx.beginPath();
    ctx.roundRect(bedX - 95, bedY - 20, 190, 70, 8);
    ctx.fill();

    // Soft Pillows
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.roundRect(bedX - 85, bedY - 55, 75, 30, 10);
    ctx.roundRect(bedX + 10, bedY - 55, 75, 30, 10);
    ctx.fill();

    // Special Hrick Cat Bed on Floor beside BB's bed!
    const catBedX = 640;
    const catBedY = 380;
    ctx.fillStyle = '#E9D8A6';
    ctx.beginPath();
    ctx.ellipse(catBedX, catBedY, 40, 20, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#EE9B00';
    ctx.beginPath();
    ctx.ellipse(catBedX, catBedY - 4, 34, 16, 0, 0, Math.PI * 2);
    ctx.fill();

    // Little medicine dropper and warm water cup on nightstand
    const standX = 200;
    ctx.fillStyle = '#9C6644';
    ctx.fillRect(standX - 30, 280, 60, 70);
    // Water glass
    ctx.fillStyle = 'rgba(160, 210, 235, 0.8)';
    ctx.fillRect(standX - 15, 260, 12, 20);
    // Medicine bottle
    ctx.fillStyle = '#D90429';
    ctx.fillRect(standX + 5, 264, 10, 16);
    ctx.restore();
  }

  // 6. Neighborhood (Chapter 6 - A Little Outing)
  private static renderNeighborhood(ctx: CanvasRenderingContext2D, time: number) {
    // Sunny gentle pastel sky
    ctx.fillStyle = '#CBE8F5';
    ctx.fillRect(0, 0, 1100, 310);

    // Fluffy clouds drifting
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    for (let c = 0; c < 4; c++) {
      const cloudX = ((c * 300 + time * 12) % 1200) - 100;
      ctx.beginPath();
      ctx.arc(cloudX, 80 + c * 25, 30, 0, Math.PI * 2);
      ctx.arc(cloudX + 25, 75 + c * 25, 38, 0, Math.PI * 2);
      ctx.arc(cloudX + 55, 80 + c * 25, 28, 0, Math.PI * 2);
      ctx.fill();
    }

    // Distant soft hills & colorful indie houses
    ctx.fillStyle = '#A3C9A8';
    ctx.beginPath();
    ctx.moveTo(0, 310);
    ctx.quadraticCurveTo(250, 230, 550, 270);
    ctx.quadraticCurveTo(850, 220, 1100, 280);
    ctx.lineTo(1100, 310);
    ctx.fill();

    // Neighborhood bakery with striped pink awning
    ctx.save();
    const bakeryX = 220;
    ctx.fillStyle = '#FDF0D5';
    ctx.fillRect(bakeryX - 70, 170, 140, 140);
    // Striped Awning
    for (let s = 0; s < 7; s++) {
      ctx.fillStyle = s % 2 === 0 ? '#E76F51' : '#FFFFFF';
      ctx.fillRect(bakeryX - 75 + s * 21, 160, 21, 24);
    }
    // Bakery Window with croissants
    ctx.fillStyle = '#83C5BE';
    ctx.fillRect(bakeryX - 55, 200, 110, 65);
    ctx.fillStyle = '#DE8C4C';
    ctx.beginPath();
    ctx.arc(bakeryX - 25, 240, 10, Math.PI, 0);
    ctx.arc(bakeryX + 25, 240, 10, Math.PI, 0);
    ctx.fill();
    ctx.restore();

    // Cobblestone walking path
    ctx.fillStyle = '#D6CEBE';
    ctx.fillRect(0, 310, 1100, 210);

    // Cobblestone outlines
    ctx.strokeStyle = '#B8AF9E';
    ctx.lineWidth = 1;
    for (let x = 0; x < 1100; x += 36) {
      for (let y = 310; y < 520; y += 22) {
        const offset = ((y / 22) % 2 === 0) ? 0 : 18;
        ctx.strokeRect(x + offset, y, 36, 22);
      }
    }

    // Lush green park tree with falling blossom leaves
    ctx.save();
    const treeX = 680;
    ctx.fillStyle = '#7F5539';
    ctx.fillRect(treeX - 16, 170, 32, 140); // Trunk
    // Leaf canopy
    const treeSway = Math.sin(time * 2) * 4;
    ctx.fillStyle = '#80B918';
    ctx.beginPath();
    ctx.arc(treeX + treeSway, 140, 65, 0, Math.PI * 2);
    ctx.arc(treeX - 45 + treeSway, 120, 50, 0, Math.PI * 2);
    ctx.arc(treeX + 45 + treeSway, 125, 55, 0, Math.PI * 2);
    ctx.fill();

    // Little Park Bench
    ctx.fillStyle = '#588157';
    ctx.fillRect(treeX + 50, 330, 80, 10);
    ctx.fillRect(treeX + 58, 340, 6, 24);
    ctx.fillRect(treeX + 116, 340, 6, 24);
    ctx.restore();

    // Flower planter boxes with vibrant lavender and marigolds
    ctx.save();
    const boxX = 920;
    ctx.fillStyle = '#9C6644';
    ctx.fillRect(boxX - 50, 315, 100, 18);
    // Flowers
    const flowerColors = ['#9D4EDD', '#FFB703', '#F72585', '#70E000'];
    for (let f = 0; f < 8; f++) {
      ctx.fillStyle = flowerColors[f % flowerColors.length];
      ctx.beginPath();
      ctx.arc(boxX - 40 + f * 12, 310 + Math.sin(f * 2) * 3, 5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // 7. The Cat Cafe (Chapter 7)
  private static renderCatCafe(ctx: CanvasRenderingContext2D, time: number) {
    // Warm cafe interior wall (Warm milk-tea cream)
    ctx.fillStyle = '#F3E9DC';
    ctx.fillRect(0, 0, 1100, 260);

    // Warm herringbone wood floor
    ctx.fillStyle = '#C89666';
    ctx.fillRect(0, 260, 1100, 260);

    // Wooden Cat Highway / Wall Climbing Shelves!
    ctx.fillStyle = '#8B5A2B';
    ctx.fillRect(120, 100, 110, 14);
    ctx.fillRect(280, 70, 120, 14);
    ctx.fillRect(450, 110, 100, 14);
    ctx.fillRect(720, 80, 130, 14);

    // Big Wooden Cat Tree with Sisal Scratching Post
    ctx.save();
    const treeX = 350;
    ctx.fillStyle = '#DDA15E';
    ctx.fillRect(treeX - 12, 120, 24, 180); // Trunk
    // Scratching rope texture
    ctx.strokeStyle = '#BC6C25';
    ctx.lineWidth = 2;
    for (let y = 160; y < 290; y += 8) {
      ctx.beginPath();
      ctx.moveTo(treeX - 12, y);
      ctx.lineTo(treeX + 12, y);
      ctx.stroke();
    }
    // Round perches
    ctx.fillStyle = '#FAF0CA';
    ctx.beginPath();
    ctx.ellipse(treeX - 35, 180, 36, 12, 0, 0, Math.PI * 2);
    ctx.ellipse(treeX + 35, 230, 40, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Cafe Counter with Coffee Machine
    ctx.save();
    const cafeBarX = 860;
    ctx.fillStyle = '#588157';
    ctx.fillRect(cafeBarX - 80, 180, 160, 140);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(cafeBarX - 85, 172, 170, 12); // Counter top

    // Chalkboard sign: "WHISKERS & BREWS - BE FRIENDLY TO CATS"
    ctx.fillStyle = '#2B2D42';
    ctx.fillRect(cafeBarX - 60, 80, 120, 75);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 9px Comfortaa, sans-serif';
    ctx.fillText('WHISKERS & BREWS', cafeBarX - 52, 102);
    ctx.fillStyle = '#FFD166';
    ctx.font = '8px Nunito, sans-serif';
    ctx.fillText('☕ Matcha Latte', cafeBarX - 48, 122);
    ctx.fillText('🐾 4 Lovely Cats!', cafeBarX - 48, 138);
    ctx.restore();

    // Render other resident cafe cats (Mochi, Pepper, Barnaby, Cleo)
    CAFE_CATS.forEach((cat) => {
      ctx.save();
      ctx.translate(cat.x, cat.y);

      // Shadow
      ctx.fillStyle = 'rgba(40, 30, 45, 0.18)';
      ctx.beginPath();
      ctx.ellipse(0, 0, 12, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Cat body
      ctx.fillStyle = cat.color;
      ctx.beginPath();
      ctx.ellipse(0, -9, 11, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Head
      ctx.beginPath();
      ctx.arc(8, -14, 7, 0, Math.PI * 2);
      ctx.fill();

      // Ears
      ctx.beginPath();
      ctx.moveTo(4, -18);
      ctx.lineTo(6, -24);
      ctx.lineTo(10, -18);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(11, -18);
      ctx.lineTo(13, -24);
      ctx.lineTo(15, -18);
      ctx.fill();

      // Tail
      ctx.strokeStyle = cat.color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-9, -9);
      ctx.quadraticCurveTo(-15, -18, -12, -22);
      ctx.stroke();

      // Name tag floating
      ctx.fillStyle = '#4A3525';
      ctx.font = 'bold 9px Comfortaa, sans-serif';
      ctx.fillText(cat.name, -10, -28);

      ctx.restore();
    });
  }

  // 8. Veranda at Night (Chapter 10 - All Nine Lives)
  private static renderVerandaNight(ctx: CanvasRenderingContext2D, time: number) {
    // Deep starry midnight indigo sky
    const skyGrad = ctx.createLinearGradient(0, 0, 0, 380);
    skyGrad.addColorStop(0, '#0B0C1A');
    skyGrad.addColorStop(0.7, '#181A32');
    skyGrad.addColorStop(1, '#272A4E');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, 1100, 380);

    // Glowing crescent moon
    ctx.save();
    const moonX = 850;
    const moonY = 90;
    const moonGlow = ctx.createRadialGradient(moonX, moonY, 10, moonX, moonY, 80);
    moonGlow.addColorStop(0, 'rgba(255, 245, 205, 0.45)');
    moonGlow.addColorStop(1, 'rgba(255, 245, 205, 0)');
    ctx.fillStyle = moonGlow;
    ctx.beginPath();
    ctx.arc(moonX, moonY, 80, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FFF2B2';
    ctx.beginPath();
    ctx.arc(moonX, moonY, 26, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#181A32';
    ctx.beginPath();
    ctx.arc(moonX + 10, moonY - 5, 23, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Gentle twinkling stars
    for (let i = 0; i < 60; i++) {
      const sx = ((i * 127) % 1080) + 10;
      const sy = ((i * 83) % 240) + 15;
      const twinkle = Math.abs(Math.sin(time * 2 + i));
      ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + twinkle * 0.7})`;
      ctx.beginPath();
      ctx.arc(sx, sy, (i % 3 === 0) ? 1.8 : 1.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Distant peaceful town lights on dark silhouette hills
    ctx.fillStyle = '#121424';
    ctx.beginPath();
    ctx.moveTo(0, 360);
    ctx.quadraticCurveTo(300, 290, 600, 330);
    ctx.quadraticCurveTo(880, 280, 1100, 340);
    ctx.lineTo(1100, 520);
    ctx.lineTo(0, 520);
    ctx.fill();

    // Little glowing window lights in distance
    ctx.fillStyle = '#FFEAA7';
    for (let w = 0; w < 14; w++) {
      const wx = 120 + w * 65;
      const wy = 320 + Math.sin(w) * 15;
      ctx.fillRect(wx, wy, 4, 3);
    }

    // Wooden Veranda Deck
    ctx.fillStyle = '#3E2723';
    ctx.fillRect(0, 360, 1100, 160);

    // Veranda railing
    ctx.strokeStyle = '#5D4037';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(0, 340);
    ctx.lineTo(1100, 340);
    ctx.stroke();

    for (let r = 0; r < 1100; r += 45) {
      ctx.beginPath();
      ctx.moveTo(r, 340);
      ctx.lineTo(r, 370);
      ctx.stroke();
    }

    // Cozy floor lantern casting warm amber light on BB and Hrick
    ctx.save();
    const lanternX = 420;
    const lanternY = 380;
    const lanternGlow = ctx.createRadialGradient(lanternX, lanternY, 5, lanternX, lanternY, 150);
    lanternGlow.addColorStop(0, 'rgba(255, 200, 100, 0.45)');
    lanternGlow.addColorStop(0.5, 'rgba(255, 180, 80, 0.15)');
    lanternGlow.addColorStop(1, 'rgba(255, 180, 80, 0)');
    ctx.fillStyle = lanternGlow;
    ctx.beginPath();
    ctx.arc(lanternX, lanternY, 150, 0, Math.PI * 2);
    ctx.fill();

    // Lantern body
    ctx.fillStyle = '#212529';
    ctx.fillRect(lanternX - 10, lanternY - 18, 20, 24);
    ctx.fillStyle = '#FFD166';
    ctx.fillRect(lanternX - 7, lanternY - 14, 14, 16);
    ctx.restore();
  }
}
