//https://github.com/pofulu/Spark-AR-PFTools

import { PFTween, Ease } from './PFTween';  //https://github.com/pofulu/sparkar-pftween
import { Particle } from './Particle';      //https://github.com/pofulu/sparkar-particle

const Scene = require('Scene');
const Patches = require('Patches');

const psDisappear = (particle) => new Particle.findFirst(particle).setFadeout().setScaleout()

const ps_explosion = psDisappear('ps_explosion');
const ps_trail = psDisappear('ps_trail');


var pulsed;

(async function() {
    const [fireworks, light] = await Promise.all([
        Scene.root.findFirst('fireworks'),
        Scene.root.findFirst('light')
    ]);
    const explosion = () => {
        ps_explosion.modifyValue(0, 1, Ease.easeOutSine).burst(2000);
        ps_trail.stop();
        light.intensity = new PFTween(3, 0, 500).scalar;
    }

    const ani_fireworks = new PFTween(-0.3, 0.5, 1000)
            .bind(v => fireworks.transform.y = v.scalar)
            .setEase(Ease.easeOutQuad)
            .onStart(() => ps_trail.start(100))
            .onComplete(explosion)
            .apply(false);

            const event = await Patches.outputs.getPulse('ToScriptPulse');
            pulsed = event.subscribe(() => ani_fireworks.replay())

})();
