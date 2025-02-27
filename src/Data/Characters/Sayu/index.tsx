import { CharacterData } from 'pipeline'
import ColorText from '../../../Components/ColoredText'
import { input } from '../../../Formula'
import { constant, greaterEq, infoMut, percent, prod, lookup, naught, sum, min, subscript } from '../../../Formula/utils'
import { absorbableEle, CharacterKey, ElementKey } from '../../../Types/consts'
import { range } from '../../../Util/Util'
import { cond, sgt, st, trans } from '../../SheetUtil'
import CharacterSheet, { ICharacterSheet, normalSrc, sectionTemplate, talentTemplate } from '../CharacterSheet'
import { customHealNode, dataObjForCharacterSheet, dmgNode, healNodeTalent } from '../dataUtil'
import { banner, burst, c1, c2, c3, c4, c5, c6, card, passive1, passive2, passive3, skill, thumb, thumbSide } from './assets'
import data_gen_src from './data_gen.json'
import skillParam_gen from './skillParam_gen.json'

const data_gen = data_gen_src as CharacterData
const auto = normalSrc(data_gen.weaponTypeKey)

const key: CharacterKey = "Sayu"
const elementKey: ElementKey = "anemo"
const [tr, trm] = trans("char", key)

let s = 0, b = 0
const datamine = {
  normal: {
    hitArr: [
      skillParam_gen.auto[0], // 1
      skillParam_gen.auto[1], // 2
      skillParam_gen.auto[2], // 3x2
      skillParam_gen.auto[4], // 4
    ]
  },
  charged: {
    spin: skillParam_gen.auto[5],
    final: skillParam_gen.auto[6],
    stamina: skillParam_gen.auto[7][0],
    duration: skillParam_gen.auto[8][0],
  },
  plunging: {
    dmg: skillParam_gen.auto[9],
    low: skillParam_gen.auto[10],
    high: skillParam_gen.auto[11],
  },
  skill: {
    wheelDmg: skillParam_gen.skill[s++],
    eleWheelDmg: skillParam_gen.skill[s++],
    kickPressDmg: skillParam_gen.skill[s++],
    kickHoldDmg: skillParam_gen.skill[s++],
    eleKickDmg: skillParam_gen.skill[s++],
    duration: skillParam_gen.skill[s++][0],
    cdMin: skillParam_gen.skill[s++][0],
    cdMax: skillParam_gen.skill[s++][0],
  },
  burst: {
    pressDmg: skillParam_gen.burst[b++],
    pressBaseHeal: skillParam_gen.burst[b++],
    pressAtkHeal: skillParam_gen.burst[b++],
    darumaDmg: skillParam_gen.burst[b++],
    darumaBaseHeal: skillParam_gen.burst[b++],
    darumaAtkHeal: skillParam_gen.burst[b++],
    darumaHits: 7,
    duration: skillParam_gen.burst[b++][0],
    cd: skillParam_gen.burst[b++][0],
    enerCost: skillParam_gen.burst[b++][0]
  },
  passive1: {
    baseHeal: skillParam_gen.passive1[0][0],
    emHeal: skillParam_gen.passive1[1][0],
    cd: skillParam_gen.passive1[2][0]
  },
  passive2: {
    nearHeal: skillParam_gen.passive2[0][0]
  },
  constellation2: {
    dmgInc: skillParam_gen.constellation2[0],
    maxStacks: skillParam_gen.constellation2[1],
  },
  constellation4: {
    ener: skillParam_gen.constellation4[0],
    cd: skillParam_gen.constellation4[1],
  },
  constellation6: {
    darumaDmgInc: skillParam_gen.constellation6[0],
    maxStacks: skillParam_gen.constellation6[1] / skillParam_gen.constellation6[0],
    darumaHealInc: skillParam_gen.constellation6[2]
  }
} as const

const [condSkillAbsorptionPath, condSkillAbsorption] = cond(key, "skillAbsorption")

const [condActiveSwirlPath, condActiveSwirl] = cond(key, "activeSwirl")

const [condC2SkillStackPath, condC2SkillStack] = cond(key, "c2SkillStack")
const c2_kickPressDmg_ = greaterEq(input.constellation, 2, percent(datamine.constellation2.dmgInc))
const c2_kickDmg_ = greaterEq(input.constellation, 2,
  lookup(condC2SkillStack,
    Object.fromEntries(range(1, datamine.constellation2.maxStacks).map(stack => [
      stack,
      prod(stack, percent(datamine.constellation2.dmgInc))
    ])),
    naught
  )
)

const c6_daruma_dmg_inc = greaterEq(input.constellation, 6,
  prod(
    min(input.total.eleMas, datamine.constellation6.maxStacks),
    datamine.constellation6.darumaDmgInc,
    input.total.atk
  )
)
const c6_daruma_heal_inc = greaterEq(input.constellation, 6,
  prod(min(input.total.eleMas, datamine.constellation6.maxStacks), datamine.constellation6.darumaHealInc)
)
// Using customHealNode so I can have healInc
const darumaHeal = customHealNode(sum(
  prod(
    subscript(input.total.burstIndex, datamine.burst.darumaAtkHeal, { key: "_" }),
    input.total.atk,
  ),
  subscript(input.total.burstIndex, datamine.burst.darumaBaseHeal),
  c6_daruma_heal_inc,
))

const dmgFormulas = {
  normal: Object.fromEntries(datamine.normal.hitArr.map((arr, i) =>
    [i, dmgNode("atk", arr, "normal")])),
  charged: {
    spin: dmgNode("atk", datamine.charged.spin, "charged"),
    final: dmgNode("atk", datamine.charged.final, "charged")
  },
  plunging: Object.fromEntries(Object.entries(datamine.plunging).map(([key, value]) =>
    [key, dmgNode("atk", value, "plunging")])),
  skill: {
    wheelDmg: dmgNode("atk", datamine.skill.wheelDmg, "skill"),
    kickPressDmg: dmgNode("atk", datamine.skill.kickPressDmg, "skill",
      { premod: { skill_dmg_: sum(c2_kickDmg_, c2_kickPressDmg_) } }),
    kickHoldDmg: dmgNode("atk", datamine.skill.kickHoldDmg, "skill",
      { premod: { skill_dmg_: c2_kickDmg_ } }),
    eleWheelDmg: lookup(condSkillAbsorption, Object.fromEntries(absorbableEle.map(eleKey => [
      eleKey,
      dmgNode("atk", datamine.skill.eleWheelDmg, "skill", { hit: { ele: constant(eleKey) } })
    ])), naught),
    eleKickDmg: lookup(condSkillAbsorption, Object.fromEntries(absorbableEle.map(eleKey => [
      eleKey,
      dmgNode("atk", datamine.skill.eleKickDmg, "skill",
        { hit: { ele: constant(eleKey) }, premod: { skill_dmg_: c2_kickDmg_ } })
    ])), naught)
  },
  burst: {
    pressDmg: dmgNode("atk", datamine.burst.pressDmg, "burst"),
    pressHeal: healNodeTalent("atk", datamine.burst.pressAtkHeal, datamine.burst.pressBaseHeal, "burst"),
    darumaDmg: dmgNode("atk", datamine.burst.darumaDmg, "burst",
      { premod: { burst_dmgInc: c6_daruma_dmg_inc } }),
    darumaHeal
  },
  passive1: {
    heal: greaterEq(input.asc, 1, sum(datamine.passive1.baseHeal, prod(datamine.passive1.emHeal, input.total.eleMas)))
  },
  passive2: {
    extraHeal: greaterEq(input.asc, 4, prod(darumaHeal, percent(datamine.passive2.nearHeal)))
  }
}

const burstC3 = greaterEq(input.constellation, 3, 3)
const skillC5 = greaterEq(input.constellation, 5, 3)

export const data = dataObjForCharacterSheet(key, "anemo", "inazuma", data_gen, dmgFormulas, {
  bonus: {
    skill: skillC5,
    burst: burstC3
  }
})

const sheet: ICharacterSheet = {
  name: tr("name"),
  cardImg: card,
  thumbImg: thumb,
  thumbImgSide: thumbSide,
  bannerImg: banner,
  rarity: data_gen.star,
  elementKey,
  weaponTypeKey: data_gen.weaponTypeKey,
  gender: "F",
  constellationName: tr("constellationName"),
  title: tr("title"),
  talent: {
    sheets: {
      auto: talentTemplate("auto", tr, auto, undefined, undefined, [{
        ...sectionTemplate("auto", tr, auto,
          datamine.normal.hitArr.map((_, i) => ({
            node: infoMut(dmgFormulas.normal[i], { key: `char_${key}_gen:auto.skillParams.${i}` }),
            textSuffix: i === 2 ? st("brHits", { count: 2 }) : ""
          }))
        ),
        text: tr("auto.fields.normal")
      }, {
        ...sectionTemplate("auto", tr, auto, [{
          node: infoMut(dmgFormulas.charged.spin, { key: `char_${key}_gen:auto.skillParams.4` }),
        }, {
          node: infoMut(dmgFormulas.charged.final, { key: `char_${key}_gen:auto.skillParams.5` }),
        }, {
          text: tr("auto.skillParams.6"),
          value: `${datamine.charged.stamina}/s`,
        }]
        ),
        text: tr("auto.fields.charged"),
      }, {
        ...sectionTemplate("auto", tr, auto, [{
          node: infoMut(dmgFormulas.plunging.dmg, { key: "sheet_gen:plunging.dmg" }),
        }, {
          node: infoMut(dmgFormulas.plunging.low, { key: "sheet_gen:plunging.low" }),
        }, {
          node: infoMut(dmgFormulas.plunging.high, { key: "sheet_gen:plunging.high" }),
        }]
        ),
        text: tr("auto.fields.plunging"),
      }]),
      skill: talentTemplate("skill", tr, skill, [{
        node: infoMut(dmgFormulas.skill.wheelDmg, { key: `char_${key}_gen:skill.skillParams.0` })
      }, {
        node: infoMut(dmgFormulas.skill.kickPressDmg, { key: `char_${key}_gen:skill.skillParams.1` })
      }, {
        node: infoMut(dmgFormulas.skill.kickHoldDmg, { key: `char_${key}_gen:skill.skillParams.2` })
      }, {
        text: tr("skill.skillParams.5"),
        value: datamine.skill.duration,
        unit: "s",
      }, {
        text: sgt("cd"),
        value: `${datamine.skill.cdMin}s ~ ${datamine.skill.cdMax}`,
        unit: "s",
      }], {
        value: condSkillAbsorption,
        path: condSkillAbsorptionPath,
        name: st("eleAbsor"),
        states: Object.fromEntries(absorbableEle.map(eleKey => [eleKey, {
          name: <ColorText color={eleKey}>{sgt(`element.${eleKey}`)}</ColorText>,
          fields: [{
            node: infoMut(dmgFormulas.skill.eleWheelDmg, { key: `char_${key}_gen:skill.skillParams.3` })
          }, {
            node: infoMut(dmgFormulas.skill.eleKickDmg, { key: `char_${key}_gen:skill.skillParams.4` })
          }]
        }]))
      }, [
        sectionTemplate("constellation2", tr, c2, [{
          node: infoMut(c2_kickPressDmg_, { key: `char_${key}:c2KickPressDmg_` })
        }], {
          value: condC2SkillStack,
          path: condC2SkillStackPath,
          name: trm("c2Cond"),
          states: Object.fromEntries(range(1, datamine.constellation2.maxStacks).map(stack => [stack, {
            name: st("seconds", { count: stack * 0.5 }),
            fields: [{
              node: infoMut(c2_kickDmg_, { key: `char_${key}:c2KickDmg_` })
            }]
          }]))
        }, data => data.get(input.constellation).value >= 2, false, true),
      ]),
      burst: talentTemplate("burst", tr, burst, [{
        node: infoMut(dmgFormulas.burst.pressDmg, { key: `char_${key}_gen:burst.skillParams.0` })
      }, {
        node: infoMut(dmgFormulas.burst.pressHeal, { key: `char_${key}_gen:burst.skillParams.1`, variant: "success" })
      }, {
        node: infoMut(dmgFormulas.burst.darumaDmg, { key: `char_${key}_gen:burst.skillParams.2` })
      }, {
        node: infoMut(dmgFormulas.burst.darumaHeal, { key: `char_${key}_gen:burst.skillParams.3`, variant: "success" })
      }, {
        text: trm("burstHits"),
        value: datamine.burst.darumaHits,
      }], undefined, [
        sectionTemplate("passive2", tr, passive2, [{
          node: infoMut(dmgFormulas.passive2.extraHeal, { key: `char_${key}:p2Heal`, variant: "success" })
        }, {
          text: trm("p2Aoe")
        }], undefined, data => data.get(input.asc).value >= 4, false, true),
        sectionTemplate("constellation1", tr, c1, [{
          text: trm("c1Text")
        }], undefined, data => data.get(input.constellation).value >= 1, false, true),
        sectionTemplate("constellation6", tr, c6, [{
          node: infoMut(c6_daruma_dmg_inc,
            { key: `char_${key}:c6DarumaDmgInc`, variant: "anemo" })
        }, {
          node: infoMut(c6_daruma_heal_inc,
            { key: `char_${key}:c6DarumaHealInc`, variant: "success" })
        }], undefined, data => data.get(input.constellation).value >= 6, false, true),
      ]),
      passive1: talentTemplate("passive1", tr, passive1, undefined, {
        canShow: greaterEq(input.asc, 1, 1),
        value: condActiveSwirl,
        path: condActiveSwirlPath,
        name: trm("p1Swirl"),
        states: {
          activeSwirl: {
            fields: [{
              node: infoMut(dmgFormulas.passive1.heal, { key: `sheet_gen:healing`, variant: "success" })
            }, {
              text: sgt("cd"),
              value: datamine.passive1.cd,
              unit: "s"
            }]
          }
        }
      }),
      passive2: talentTemplate("passive2", tr, passive2),
      passive3: talentTemplate("passive3", tr, passive3),
      constellation1: talentTemplate("constellation1", tr, c1),
      constellation2: talentTemplate("constellation2", tr, c2),
      constellation3: talentTemplate("constellation3", tr, c3, [{ node: burstC3 }]),
      constellation4: talentTemplate("constellation4", tr, c4, undefined, undefined, [
        sectionTemplate("constellation4", tr, c4, [{
          text: trm("c4Ener"),
          value: datamine.constellation4.ener,
          fixed: 1
        }, {
          text: sgt("cd"),
          value: datamine.constellation4.cd,
          unit: "s"
        }], undefined, data => data.get(input.constellation).value >= 4)
      ]),
      constellation5: talentTemplate("constellation5", tr, c5, [{ node: skillC5 }]),
      constellation6: talentTemplate("constellation6", tr, c6)
    }
  }
}
export default new CharacterSheet(sheet, data)
