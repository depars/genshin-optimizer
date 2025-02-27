import { CharacterData } from 'pipeline'
import { input, target } from '../../../Formula'
import { infoMut, lookup, equal, percent, prod, subscript, greaterEq } from '../../../Formula/utils'
import { CharacterKey, ElementKey } from '../../../Types/consts'
import { objectKeyMap, range } from '../../../Util/Util'
import { cond, st, trans } from '../../SheetUtil'
import CharacterSheet, { ICharacterSheet, normalSrc, sectionTemplate, talentTemplate } from '../CharacterSheet'
import { dataObjForCharacterSheet, dmgNode } from '../dataUtil'
import { banner, burst, c1, c2, c3, c4, c5, c6, card, passive1, passive2, passive3, skill, thumb, thumbSide } from './assets'
import data_gen_src from './data_gen.json'
import skillParam_gen from './skillParam_gen.json'

const data_gen = data_gen_src as CharacterData

const key: CharacterKey = "Shenhe"
const elementKey: ElementKey = "cryo"
const [tr, trm] = trans("char", key)

let s = 0, b = 0, p1 = 0, p2 = 0
const datamine = {
  normal: {
    hitArr: [
      skillParam_gen.auto[0], // 1
      skillParam_gen.auto[1], // 2
      skillParam_gen.auto[2], // 3
      skillParam_gen.auto[3], // 4x2
      skillParam_gen.auto[5], // 5
    ]
  },
  charged: {
    dmg: skillParam_gen.auto[6],
    stamina: skillParam_gen.auto[7][0],
  },
  plunging: {
    dmg: skillParam_gen.auto[8],
    low: skillParam_gen.auto[9],
    high: skillParam_gen.auto[10],
  },
  skill: {
    press: skillParam_gen.skill[s++],
    hold: skillParam_gen.skill[s++],
    dmgAtk_: skillParam_gen.skill[s++],
    duration: skillParam_gen.skill[s++][0],
    durationHold: skillParam_gen.skill[s++][0],
    trigger: skillParam_gen.skill[s++][0],
    triggerHold: skillParam_gen.skill[s++][0],
    cd: skillParam_gen.skill[s++][0],
    cdHold: skillParam_gen.skill[s++][0],
  },
  burst: {
    dmg: skillParam_gen.burst[b++],
    res_: skillParam_gen.burst[b++],
    dot: skillParam_gen.burst[b++],
    duration: skillParam_gen.burst[b++][0],
    cd: skillParam_gen.burst[b++][0],
    enerCost: skillParam_gen.burst[b++][0],
  },
  passive1: {
    cryo_dmg_: skillParam_gen.passive1[p1++][0],
  },
  passive2: {
    press_dmg_: skillParam_gen.passive2[p2++][0],
    durationPress: skillParam_gen.passive2[p2++][0],
    hold_dmg_: skillParam_gen.passive2[p2++][0],
    durationHold: skillParam_gen.passive2[p2++][0],
  },
  constellation2: {
    durationInc: skillParam_gen.constellation2[0],
  },
  constellation4: {
    dmg_: skillParam_gen.constellation4[0],
    maxStacks: skillParam_gen.constellation4[1],
  },
  constellation6: {
    auto_: skillParam_gen.constellation6[0],
    duration: skillParam_gen.constellation6[1],
  }
} as const

const [condQuillPath, condQuill] = cond(key, "quill")
const nodeSkill = equal("quill", condQuill,
  prod(input.total.atk, subscript(input.total.skillIndex, datamine.skill.dmgAtk_, { key: '_' })))


const [condBurstPath, condBurst] = cond(key, "burst")
const enemyRes_ = equal("burst", condBurst,
  subscript(input.total.burstIndex, datamine.burst.res_.map(x => -x), { key: '_' }))

const nodeBurstCryo_enemyRes_ = { ...enemyRes_ }
const nodeBurstPhysical_enemyRes_ = { ...enemyRes_ }

const [condAsc1Path, condAsc1] = cond(key, "asc1")
const nodeAsc1Disp = greaterEq(input.asc, 1,
  equal(condAsc1, "field",
    datamine.passive1.cryo_dmg_
  )
)
const nodeAsc1 = equal(input.activeCharKey, target.charKey, nodeAsc1Disp)

const [condAsc4Path, condAsc4] = cond(key, "asc4")
const nodeAsc4 = greaterEq(input.asc, 1,
  equal(condAsc4, "press",
    datamine.passive2.press_dmg_
  )
)
const nodeAsc4Press_skill_dmg_ = { ...nodeAsc4 }
const nodeAsc4Press_burst_dmg_ = { ...nodeAsc4 }
const nodeAsc4Hold = greaterEq(input.asc, 1,
  equal(condAsc4, "hold",
    datamine.passive2.hold_dmg_
  )
)
const nodeAsc4Hold_normal_dmg_ = { ...nodeAsc4Hold }
const nodeAsc4Hold_charged_dmg_ = { ...nodeAsc4Hold }
const nodeAsc4Hold_plunging_dmg_ = { ...nodeAsc4Hold }

const nodeC2Disp = greaterEq(input.constellation, 2,
  equal(condAsc1, "field",
    datamine.passive1.cryo_dmg_
  )
)
const nodeC2 = equal(input.activeCharKey, target.charKey, nodeC2Disp)

const [condC4Path, condC4] = cond(key, "c4")
const c4Inc = greaterEq(input.constellation, 4,
  lookup(condC4,
    objectKeyMap(range(1, datamine.constellation4.maxStacks), i => percent(i * datamine.constellation4.dmg_)),
    0),
  { key: "char_Shenhe:c4Bonus_" })
const dmgFormulas = {
  normal: Object.fromEntries(datamine.normal.hitArr.map((arr, i) =>
    [i, dmgNode("atk", arr, "normal")])),
  charged: {
    dmg: dmgNode("atk", datamine.charged.dmg, "charged"),
  },
  plunging: Object.fromEntries(Object.entries(datamine.plunging).map(([key, value]) =>
    [key, dmgNode("atk", value, "plunging")])),
  skill: {
    press: dmgNode("atk", datamine.skill.press, "skill", { hit: { dmgBonus: c4Inc } }),
    hold: dmgNode("atk", datamine.skill.hold, "skill", { hit: { dmgBonus: c4Inc } }),
    quillDmg: nodeSkill
  },
  burst: {
    dmg: dmgNode("atk", datamine.burst.dmg, "burst"),
    dot: dmgNode("atk", datamine.burst.dot, "burst"),
  },
}
const nodeC3 = greaterEq(input.constellation, 3, 3)
const nodeC5 = greaterEq(input.constellation, 5, 3)
export const data = dataObjForCharacterSheet(key, elementKey, "liyue", data_gen, dmgFormulas, {
  bonus: {
    skill: nodeC3,
    burst: nodeC5
  },
  teamBuff: {
    premod: {
      cryo_dmgInc: nodeSkill,
      cryo_enemyRes_: nodeBurstCryo_enemyRes_,
      physical_enemyRes_: nodeBurstPhysical_enemyRes_,
      cryo_dmg_: nodeAsc1,
      skill_dmg_: nodeAsc4Press_skill_dmg_,
      burst_dmg_: nodeAsc4Press_burst_dmg_,
      normal_dmg_: nodeAsc4Hold_normal_dmg_,
      charged_dmg_: nodeAsc4Hold_charged_dmg_,
      plunging_dmg_: nodeAsc4Hold_plunging_dmg_,
      cryo_critDMG_: nodeC2
    },
  },
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
      auto: talentTemplate("auto", tr, normalSrc(data_gen.weaponTypeKey), undefined, undefined, [{
        ...sectionTemplate("auto", tr, normalSrc(data_gen.weaponTypeKey),
          datamine.normal.hitArr.map((_, i) => ({
            node: infoMut(dmgFormulas.normal[i], { key: `char_${key}_gen:auto.skillParams.${i}` }),
            textSuffix: i === 3 ? st("brHits", { count: 2 }) : ""
          }))
        ),
        text: tr("auto.fields.normal")
      }, {
        ...sectionTemplate("auto", tr, normalSrc(data_gen.weaponTypeKey), [{
            node: infoMut(dmgFormulas.charged.dmg, { key: `char_${key}_gen:auto.skillParams.5` }),
          }, {
            text: tr("auto.skillParams.6"),
            value: datamine.charged.stamina,
          }]
        ),
        text: tr("auto.fields.charged"),
      }, {
        ...sectionTemplate("auto", tr, normalSrc(data_gen.weaponTypeKey), [{
            node: infoMut(dmgFormulas.plunging.dmg, { key: "sheet_gen:plunging.dmg" }),
          }, {
            node: infoMut(dmgFormulas.plunging.low, { key: "sheet_gen:plunging.low" }),
          }, {
            node: infoMut(dmgFormulas.plunging.high, { key: "sheet_gen:plunging.high" }),
          }]
        ),
        text: tr(`auto.fields.plunging`),
      }]),
      skill: talentTemplate("skill", tr, skill, [{
        node: infoMut(dmgFormulas.skill.press, { key: `char_${key}_gen:skill.skillParams.0` }),
      }, {
        text: trm("pressDuration"),
        value: datamine.skill.duration,
        unit: "s"
      }, {
        text: trm("pressQuota"),
        value: datamine.skill.trigger,
      }, {
        text: st("pressCD"),
        value: datamine.skill.cd,
        unit: "s"
      }, {
        node: infoMut(dmgFormulas.skill.hold, { key: `char_${key}_gen:skill.skillParams.1` }),
      }, {
        text: trm("holdDuration"),
        value: datamine.skill.durationHold,
        unit: "s"
      }, {
        text: trm("holdQuota"),
        value: datamine.skill.triggerHold,
      }, {
        text: st("holdCD"),
        value: datamine.skill.cdHold,
        unit: "s"
      }, {
        canShow: (data) => data.get(input.constellation).value >= 1,
        text: st("charges"),
        value: 2
      }], {
        teamBuff: true,
        value: condQuill,
        path: condQuillPath,
        name: trm("quill"),
        states: {
          quill: {
            fields: [{
              node: nodeSkill
            }]
          }
        }
      }, [
        sectionTemplate("passive2", tr, passive2, undefined, {
          canShow: greaterEq(input.asc, 4, 1),
          value: condAsc4,
          path: condAsc4Path,
          teamBuff: true,
          name: trm("asc4Cond"),
          states: {
            press: {
              name: "Press",
              fields: [{
                node: nodeAsc4Press_skill_dmg_
              }, {
                node: nodeAsc4Press_burst_dmg_
              }]
            },
            hold: {
              name: "Hold",
              fields: [{
                node: nodeAsc4Hold_normal_dmg_
              }, {
                node: nodeAsc4Hold_charged_dmg_
              }, {
                node: nodeAsc4Hold_plunging_dmg_
              }]
            }
          }
        }),
        sectionTemplate("constellation1", tr, c1, [{
          text: st("addlCharges"),
          value: 1
        }], undefined, data => data.get(input.constellation).value >= 1, false, true),
        sectionTemplate("constellation4", tr, c4, undefined, {
          canShow: greaterEq(input.constellation, 4, 1),
          value: condC4,
          path: condC4Path,
          name: trm("c4"),
          states: objectKeyMap(range(1, 50).map(i => i.toString()), i => ({
            name: i.toString(),
            fields: [{ node: c4Inc }]
          }))
        }), {
        ...sectionTemplate("constellation6", tr, c6, [{
          text: tr("constellation6.description")
        }], undefined, data => data.get(input.constellation).value >= 6, true, true),
        fieldsDescription: ""
      }]),
      burst: talentTemplate("burst", tr, burst, [{
        node: infoMut(dmgFormulas.burst.dmg, { key: `char_${key}_gen:burst.skillParams.0` }),
      }, {
        node: infoMut(dmgFormulas.burst.dot, { key: `char_${key}_gen:burst.skillParams.2` }),
      }, {
        text: tr("burst.skillParams.3"),
        value: (data) => data.get(input.constellation).value >= 2
          ? `${datamine.burst.duration} + ${datamine.constellation2.durationInc} = ${datamine.burst.duration + datamine.constellation2.durationInc}`
          : datamine.burst.duration,
        unit: "s"
      }, {
        text: tr("burst.skillParams.4"),
        value: datamine.burst.cd,
        unit: "s"
      }, {
        text: tr("burst.skillParams.5"),
        value: datamine.burst.enerCost,
      }], {
        teamBuff: true,
        value: condBurst,
        path: condBurstPath,
        name: tr("burst.name"),
        states: {
          burst: {
            fields: [{
              node: nodeBurstCryo_enemyRes_
            }, {
              node: nodeBurstPhysical_enemyRes_
            }]
          }
        }
      }, [
        sectionTemplate("passive1", tr, passive1, undefined, {
          canShow: greaterEq(input.asc, 1, 1),
          value: condAsc1,
          path: condAsc1Path,
          teamBuff: true,
          name: st("activeCharField"),
          states: {
            field: {
              fields: [{
                node: infoMut(nodeAsc1Disp, { key: "cryo_dmg_", variant: "cryo" }) // Jank
              }]
            }
          }
        }),
        sectionTemplate("constellation2", tr, c2, [{
          text: st("durationInc"),
          value: datamine.constellation2.durationInc,
          unit: "s"
        }, {
          node: infoMut(nodeC2Disp, { key: "cryo_critDMG_", variant: "cryo" })
        }], undefined, data => data.get(input.constellation).value >= 2, true, true),
      ]),
      passive1: talentTemplate("passive1", tr, passive1),
      passive2: talentTemplate("passive2", tr, passive2),
      passive3: talentTemplate("passive3", tr, passive3),
      constellation1: talentTemplate("constellation1", tr, c1),
      constellation2: talentTemplate("constellation2", tr, c2),
      constellation3: talentTemplate("constellation3", tr, c3, [{ node: nodeC3 }]),
      constellation4: talentTemplate("constellation4", tr, c4),
      constellation5: talentTemplate("constellation5", tr, c5, [{ node: nodeC5 }]),
      constellation6: talentTemplate("constellation6", tr, c6),
    }
  },
};
export default new CharacterSheet(sheet, data);
