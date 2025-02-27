import { input } from '../../../Formula'
import { Data } from '../../../Formula/type'
import { customRead, equal, greaterEq, percent } from '../../../Formula/utils'
import { ArtifactSetKey } from '../../../Types/consts'
import { cond, sgt, trans } from '../../SheetUtil'
import { ArtifactSheet, conditionalHeader, IArtifactSheet } from '../ArtifactSheet'
import { dataObjForArtifactSheet } from '../dataUtil'
import icons from './icons'

const key: ArtifactSetKey = "NoblesseOblige"

const [tr, trm] = trans("artifact", key)

const set2 = greaterEq(input.artSet.NoblesseOblige, 2, percent(0.2))

const [condSet4Path, condSet4] = cond(key, "set4")
const set4TallyWrite = greaterEq(input.artSet.NoblesseOblige, 4, equal(condSet4, "on", 1))
const set4TallyRead = customRead(["tally", "NO4"])
const set4 = greaterEq(set4TallyRead, 1, percent(0.2))

export const data: Data = dataObjForArtifactSheet(key, {
  premod: {
    burst_dmg_: set2,
    atk_: set4,
  },
  teamBuff: {
    tally: {
      NO4: set4TallyWrite
    }
  }
})

const sheet: IArtifactSheet = {
  name: "Noblesse Oblige", rarity: [4, 5],
  icons,
  setEffects: {
    2: { document: [{ fields: [{ node: set2 }] }] },
    4: {
      document: [{
        conditional: {
          teamBuff: true,
          value: condSet4,
          path: condSet4Path,
          header: conditionalHeader(tr, icons.flower),
          description: tr(`setEffects.4`),
          name: trm("condName"),
          states: {
            on: {
              fields: [{
                node: set4
              }, {
                text: sgt("duration"),
                value: 12,
                unit: "s"
              }]
            }
          }
        }
      }]
    }
  }
}
export default new ArtifactSheet(key, sheet, data)
