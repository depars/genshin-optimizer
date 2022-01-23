import type { WeaponData } from "pipeline";
import Artifact from "../Artifact/Artifact";
import { transformativeReactionLevelMultipliers, transformativeReactions } from "../StatConstants";
import { ICachedArtifact, MainStatKey, SubstatKey } from "../Types/artifact";
import { ICachedCharacter } from "../Types/character";
import { allElementsWithPhy, ArtifactSetKey, WeaponKey, WeaponTypeKey } from "../Types/consts";
import { ICachedWeapon } from "../Types/weapon";
import { crawlObject, layeredAssignment, objectFromKeyMap } from "../Util/Util";
import _weaponCurves from "../Weapon/expCurve_gen.json";
import { input } from "./index";
import { constant } from "./internal";
import { Data, DisplayArtifact, DisplayWeapon, Node, ReadNode } from "./type";
import { NodeDisplay, UIData, valueString } from "./uiData";
import { frac, infoMut, percent, prod, stringConst, subscript, sum, unit } from "./utils";

// TODO: Remove this conversion after changing the file format
const weaponCurves = Object.fromEntries(Object.entries(_weaponCurves).map(([key, value]) => [key, [0, ...Object.values(value)]]))

function dataObjForWeaponSheet(
  key: WeaponKey, type: WeaponTypeKey,
  gen: WeaponData,
  substat2: MainStatKey | SubstatKey | undefined,
  displayWeapon: DisplayWeapon = {},
  additional: Data = {}
): Data {
  const result: Data = {
    base: {},
    premod: {},
    weapon: {
      key: stringConst(key), type: stringConst(type),
    },
    display: {
      weapon: {
        [key]: displayWeapon
      }
    },
  }

  const { mainStat, subStat } = gen

  const mainStatNode = infoMut(sum(prod(mainStat.base, subscript(input.weapon.lvl, weaponCurves[mainStat.curve])), subscript(input.weapon.asc, gen.ascension.map(x => x.addStats[mainStat.type] ?? 0))), { key: mainStat.type })
  result.base![mainStat.type] = mainStatNode
  result.weapon!.main = mainStatNode

  if (subStat) {
    const substatNode = subStat && infoMut(prod(subStat.base, subscript(input.weapon.lvl, weaponCurves[subStat.curve])), { key: subStat.type })
    result.premod![subStat.type] = substatNode
    result.weapon!.sub = substatNode
  }
  if (substat2) {
    const substat2Node = subscript(input.weapon.refineIndex, gen.addProps.map(x => x[substat2] ?? NaN), { key: substat2 })
    result.weapon!.sub2 = substat2Node
    result.premod![substat2] = substat2 !== subStat?.type
      ? input.weapon.sub2 : sum(input.weapon.sub, input.weapon.sub2)
  }

  return mergeData([result, additional])
}
function dataObjForArtifactSheet(
  key: ArtifactSetKey,
  data: Data = {},
  displayArtifact: DisplayArtifact = {},
): Data {

  return mergeData([data, {
    display: {
      artifact: {
        [key]: displayArtifact
      }
    },
  }])
}
function dataObjForArtifact(art: ICachedArtifact, mainStatAssumptionLevel: number = 0): Data {
  const mainStatVal = Artifact.mainStatValue(art.mainStatKey, art.rarity, Math.max(Math.min(mainStatAssumptionLevel, art.rarity * 4), art.level))
  const stats: [ArtifactSetKey | MainStatKey | SubstatKey, number][] = []
  stats.push([art.mainStatKey, mainStatVal])
  art.substats.forEach(({ key, value }) => key && stats.push([key, value]))
  return {
    art: {
      ...Object.fromEntries(stats.map(([key, value]) =>
        key.endsWith("_") ? [key, percent(value / 100)] : [key, constant(value)])),
      [art.slotKey]: {
        id: stringConst(art.id), set: stringConst(art.setKey)
      },
    },
    artSet: {
      [art.setKey]: constant(1)
    }
  }
}
function dataObjForCharacter(char: ICachedCharacter): Data {
  const result: Data = {
    lvl: constant(char.level),
    constellation: constant(char.constellation),
    asc: constant(char.ascension),

    talent: {
      base: {
        auto: constant(char.talent.auto),
        skill: constant(char.talent.skill),
        burst: constant(char.talent.burst),
      }
    },

    // TODO: override enemy stats
    enemy: {
      res: {
        ...objectFromKeyMap(allElementsWithPhy, _ => {
          return percent(0.1)
        }),
      },
      level: constant(char.level),
    },
    hit: {
      hitMode: stringConst(char.hitMode)
    }
  }
  if (char.elementKey) {
    result.charEle = stringConst(char.elementKey)
    result.display = {
      reaction: reactions[char.elementKey]
    }
  }

  crawlObject(char.conditionalValues, [], (x: any) => typeof x === "string" || typeof x === "number", (x: number | string, key: string[]) =>
    layeredAssignment(result, key, typeof x === "string" ? stringConst(x) : constant(x)))
  return result
}
function dataObjForWeapon(weapon: ICachedWeapon): Data {
  return {
    weapon: {
      lvl: constant(weapon.level),
      asc: constant(weapon.ascension),
      refinement: constant(weapon.refinement),
    },
  }
}
function mergeData(data: Data[]): Data {
  function internal(data: any[], input: any, path: string[]): any {
    if (data.length === 1) return data[0]
    if (input.operation) {
      const accumulation = (input as ReadNode).accumulation ?? "unique"
      if (accumulation === "unique") {
        if (data.length !== 1) throw new Error("Multiple entries when merging `unique`")
        return data[0]
      }
      const result: Node = { operation: accumulation, operands: data, }
      return result
    } else {
      return Object.fromEntries([...new Set(data.flatMap(x => Object.keys(x) as string[]))]
        .map(key => [key, internal(data.map(x => x[key]).filter(x => x), input[key], [...path, key])]))
    }
  }

  return data.length ? internal(data, input, []) : {}
}

function computeUIData(data: Data[]): UIData {
  return new UIData(data, undefined)
}

const transMulti1 = subscript(input.lvl, transformativeReactionLevelMultipliers)
const transMulti2 = prod(16, frac(input.total.eleMas, 2000))
const trans = {
  ...objectFromKeyMap(["overloaded", "electrocharged", "superconduct", "shattered"] as const, reaction => {
    const { multi, variants: [ele] } = transformativeReactions[reaction]
    return infoMut(prod(
      infoMut(prod(multi, transMulti1), { asConst: true }),
      sum(unit, prod(transMulti2, input.total.dmgBonus[reaction])),
      input.enemy.resMulti[ele]),
      { key: `${reaction}_hit`, variant: reaction })
  }),
  swirl: objectFromKeyMap(transformativeReactions.swirl.variants, ele => infoMut(
    prod(
      infoMut(prod(transformativeReactions.swirl.multi, transMulti1), { asConst: true }),
      sum(unit, prod(transMulti2, input.total.dmgBonus.swirl)),
      input.enemy.resMulti[ele]),
    { key: `${ele}_swirl_hit`, variant: ele }))
}
export const reactions = {
  anemo: {
    electroSwirl: trans.swirl.electro,
    pyroSwirl: trans.swirl.pyro,
    cryoSwirl: trans.swirl.cryo,
    hydroSwirl: trans.swirl.hydro,
    shattered: trans.shattered,
  },
  geo: {
    // TODO: crystallize
    shattered: trans.shattered,
  },
  electro: {
    overloaded: trans.overloaded,
    electrocharged: trans.electrocharged,
    superconduct: trans.superconduct,
    shattered: trans.shattered,
  },
  hydro: {
    electrocharged: trans.electrocharged,
    shattered: trans.shattered,
  },
  pyro: {
    overloaded: trans.overloaded,
    shattered: trans.shattered,
  },
  cryo: {
    superconduct: trans.superconduct,
    shattered: trans.shattered,
  },
}

export type { NodeDisplay, UIData };
export {
  dataObjForArtifact, dataObjForCharacter, dataObjForWeapon,
  dataObjForWeaponSheet, dataObjForArtifactSheet,

  mergeData, computeUIData, valueString,
};
