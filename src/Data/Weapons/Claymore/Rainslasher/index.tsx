import { WeaponData } from 'pipeline'
import { input } from '../../../../Formula'
import { equal, subscript } from '../../../../Formula/utils'
import { WeaponKey } from '../../../../Types/consts'
import { cond, trans } from '../../../SheetUtil'
import { dataObjForWeaponSheet } from '../../util'
import WeaponSheet, { conditionaldesc, conditionalHeader, IWeaponSheet } from '../../WeaponSheet'
import iconAwaken from './AwakenIcon.png'
import data_gen_json from './data_gen.json'
import icon from './Icon.png'

const key: WeaponKey = "Rainslasher"
const data_gen = data_gen_json as WeaponData
const [tr, trm] = trans("weapon", key)

const dmgInc = [0.2, 0.24, 0.28, 0.32, 0.36]
const [condPassivePath, condPassive] = cond(key, "BaneOfStormAndTide")
const all_dmg_ = equal("on", condPassive, subscript(input.weapon.refineIndex, dmgInc))
const data = dataObjForWeaponSheet(key, data_gen, {
  premod: {
    all_dmg_
  },
})
const sheet: IWeaponSheet = {
  icon,
  iconAwaken,
  document: [{
    conditional: {
      value: condPassive,
      path: condPassivePath,
      name: trm("condName"),
      header: conditionalHeader(tr, icon, iconAwaken),
      description: conditionaldesc(tr),
      states: {
        on: {
          fields: [{
            node: all_dmg_,
          }]
        }
      }
    }
  }],
}
export default new WeaponSheet(key, sheet, data_gen, data)
