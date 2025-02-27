import { faCheckSquare, faSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ExpandMore } from "@mui/icons-material";
import { Button, CardContent, Chip, Collapse, Grid, Typography } from "@mui/material";
import { useCallback, useContext, useState } from 'react';
import StatInput from "../PageCharacter/StatInput";
import { DataContext } from "../DataContext";
import { uiInput as input } from "../Formula";
import KeyMap, { valueString } from '../KeyMap';
import { allElementsWithPhy, ElementKeyWithPhy } from "../Types/consts";
import CardLight from "./Card/CardLight";
import ColorText from "./ColoredText";
import ExpandButton from "./ExpandButton";
import { uncoloredEleIcons } from "./StatIcon";

export function EnemyExpandCard() {
  const { data } = useContext(DataContext)
  const [expanded, setexpanded] = useState(false)
  const toggle = useCallback(() => setexpanded(!expanded), [setexpanded, expanded])
  const eLvlNode = data.get(input.enemy.level)
  const eDefRed = data.get(input.enemy.defRed)
  const eDefIgn = data.get(input.enemy.defIgn)
  return <CardLight>
    <CardContent>
      <Grid container>
        <Grid item flexGrow={1} alignItems="center">
          <Grid container spacing={1}>
            <Grid item>
              <Chip size="small" color="success" label={<span>{KeyMap.get(eLvlNode.key)} <strong>{eLvlNode.value}</strong></span>} />
            </Grid>
            {allElementsWithPhy.map(element => <Grid item key={element}>
              <Typography key={element} ><EnemyResText element={element} /></Typography>
            </Grid>)}
            <Grid item>
              <Typography>DEF Reduction {valueString(eDefRed.value, eDefRed.unit)}</Typography>
            </Grid>
            <Grid item>
              <Typography>DEF Ignore {valueString(eDefIgn.value, eDefIgn.unit)}</Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <ExpandButton
            expand={expanded}
            onClick={toggle}
            aria-expanded={expanded}
            aria-label="show more"
            size="small"
            sx={{ p: 0 }}
          >
            <ExpandMore />
          </ExpandButton>
        </Grid>
      </Grid>
    </CardContent>
    <Collapse in={expanded} timeout="auto" unmountOnExit>
      <CardContent sx={{ pt: 0 }}>
        <EnemyEditor />
      </CardContent>
    </Collapse>
  </CardLight>
}

export function EnemyResText({ element }: { element: ElementKeyWithPhy }) {
  const { data } = useContext(DataContext)
  const node = data.get(input.enemy[`${element}_res_`])
  const immune = !isFinite(node.value)
  const content = immune ? <span >{uncoloredEleIcons[element]} IMMUNE</span> :
    <span >{uncoloredEleIcons[element]}RES <strong>{valueString(node.value, node.unit)}</strong></span>
  return <ColorText color={element}>{content}</ColorText>
}

export function EnemyEditor({ bsProps = { xs: 12, md: 6 } }: { bsProps?: object }) {
  const { data, character: { enemyOverride }, characterDispatch } = useContext(DataContext)
  const defaultVal = 10

  const eLvl = enemyOverride.enemyLevel ?? data.get(input.lvl).value
  const eDefRed = enemyOverride.enemyDefIgn_ ?? 0
  const eDefIgn = enemyOverride.enemyDefRed_ ?? 0
  return <Grid container spacing={1}>
    <Grid item {...bsProps}>
      <Button fullWidth sx={{ height: "100%" }} size="small" component="a" color="warning" href="https://genshin-impact.fandom.com/wiki/Resistance#Base_Enemy_Resistances" target="_blank" rel="noreferrer">
        To get the specific resistance values of enemies, please visit the wiki.
      </Button>
    </Grid>
    <Grid item {...bsProps}>
      <StatInput
        sx={{ bgcolor: t => t.palette.contentLight.main, width: "100%" }}
        name={<b>{KeyMap.get("enemyLevel")}</b>}
        value={eLvl}
        placeholder={KeyMap.getStr("enemyLevel")}
        defaultValue={data.get(input.lvl).value}
        onValueChange={value => characterDispatch({ type: "enemyOverride", statKey: "enemyLevel", value })}
        onReset={() => characterDispatch({ type: "enemyOverride", statKey: "enemyLevel", value: undefined })}
      />
    </Grid>
    {allElementsWithPhy.map(eleKey => {
      const statKey = `${eleKey}_enemyRes_`
      const val = enemyOverride[statKey]
      const elementImmunity = val === Number.MAX_VALUE
      return <Grid item key={eleKey} {...bsProps}>
        <StatInput
          sx={{ bgcolor: t => t.palette.contentLight.main, width: "100%" }}
          name={<ColorText color={eleKey}><b>{KeyMap.get(statKey)}</b></ColorText>}
          value={val ? (elementImmunity ? Infinity : val) : 10}
          placeholder={elementImmunity ? "Immune " : KeyMap.getStr(statKey)}
          defaultValue={defaultVal}
          onValueChange={value => characterDispatch({ type: "enemyOverride", statKey, value })}
          disabled={elementImmunity}
          percent
        >
          <Button color={eleKey} onClick={() => characterDispatch({ type: "enemyOverride", statKey, value: elementImmunity ? defaultVal : Number.MAX_VALUE })} >
            <FontAwesomeIcon icon={elementImmunity ? faCheckSquare : faSquare} className="fa-fw" /> Immunity
          </Button>
        </StatInput>
      </Grid>
    })}
    <Grid item {...bsProps}>
      <StatInput
        sx={{ bgcolor: t => t.palette.contentLight.main, width: "100%" }}
        name={<b>{KeyMap.get("enemyDefIgn_")}</b>}
        value={eDefRed}
        placeholder={KeyMap.getStr("enemyDefIgn_")}
        defaultValue={0}
        onValueChange={value => characterDispatch({ type: "enemyOverride", statKey: "enemyDefIgn_", value })}
        percent
      />
    </Grid>
    <Grid item {...bsProps}>
      <StatInput
        sx={{ bgcolor: t => t.palette.contentLight.main, width: "100%" }}
        name={<b>{KeyMap.get("enemyDefRed_")}</b>}
        value={eDefIgn}
        placeholder={KeyMap.getStr("enemyDefRed_")}
        defaultValue={0}
        onValueChange={value => characterDispatch({ type: "enemyOverride", statKey: "enemyDefRed_", value })}
        percent
      />
    </Grid>
    <Grid item xs={12}>
      <small>Note: Genshin Impact halves resistance shred values below 0%. For the sake of calculations enter the RAW value and GO will do the rest. (e.g. 10% - 20% = -10%)</small>
    </Grid>
  </Grid>
}
