/**
 * Stations — Composes all project stations from `data/projects.js`.
 * Each `kind` selects a different visual component. They all share the same
 * StationBase (nameplate + hover pedestal + interact hitbox).
 */

import { projects } from '../data/projects.js';
import StationBase from './stations/StationBase.jsx';

import MinecraftStation from './stations/MinecraftStation.jsx';
import CrystalStation from './stations/CrystalStation.jsx';
import FaceStation from './stations/FaceStation.jsx';
import TowerStation from './stations/TowerStation.jsx';
import PortalStation from './stations/PortalStation.jsx';
import AboutStation from './stations/AboutStation.jsx';

const KIND_COMPONENT = {
  minecraft: MinecraftStation,
  crystal:   CrystalStation,
  face:      FaceStation,
  tower:     TowerStation,
  portal:    PortalStation,
  about:     AboutStation,
};

export default function Stations() {
  return (
    <>
      {projects.map((p) => {
        const Visual = KIND_COMPONENT[p.kind];
        return (
          <StationBase key={p.id} project={p}>
            {Visual ? <Visual color={p.color} accent={p.accent} /> : null}
          </StationBase>
        );
      })}
    </>
  );
}
