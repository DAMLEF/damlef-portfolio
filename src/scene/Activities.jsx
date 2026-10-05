/**
 * Activities — Composes all mini side-activities from `data/activities.js`.
 * Each `kind` selects a different visual component. They all share the same
 * ActivityBase (pedestal ring + hitbox + nameplate).
 */

import { activities } from '../data/activities.js';
import ActivityBase from './activities/ActivityBase.jsx';

import PokerActivity from './activities/PokerActivity.jsx';
import DiceActivity from './activities/DiceActivity.jsx';
import CarouselActivity from './activities/CarouselActivity.jsx';
import HologramActivity from './activities/HologramActivity.jsx';
import RocketActivity from './activities/RocketActivity.jsx';

const KIND_COMPONENT = {
  poker:    PokerActivity,
  dice:     DiceActivity,
  carousel: CarouselActivity,
  hologram: HologramActivity,
  rocket:   RocketActivity,
};

export default function Activities() {
  return (
    <>
      {activities.map((a) => {
        const Visual = KIND_COMPONENT[a.kind];
        return (
          <ActivityBase key={a.id} activity={a}>
            {Visual ? <Visual color={a.color} accent={a.accent} /> : null}
          </ActivityBase>
        );
      })}
    </>
  );
}
