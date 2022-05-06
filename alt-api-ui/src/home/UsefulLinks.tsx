import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import {
  faBook,
  faCircleDollarToSlot,
  faRobot,
  faWarning,
} from '@fortawesome/free-solid-svg-icons'
import { Button, Grid, Link, NormalColors, Tooltip } from '@nextui-org/react'
import React from 'react'
import { baseUrl } from '../util'

type UsefulLinkProps = {
  icon?: React.ReactNode
  builtinColor?: NormalColors
  customColor?: string
  tooltip?: string
  disabled?: boolean
  href: string
  text: string
}

function UsefulLink(props: UsefulLinkProps) {
  const { icon, builtinColor, customColor, href, text, tooltip, disabled } = props
  const customColorCss: Record<string, string> | undefined = customColor
    ? {
        color: customColor,
        borderColor: customColor,
      }
    : undefined

  const button = (
    <Button
      icon={icon}
      disabled={disabled}
      bordered
      auto
      color={builtinColor}
      css={customColorCss}
    >
      {text}
    </Button>
  )

  return (
    <Grid>
      <Link href={!disabled ? href : undefined}>
        {tooltip ? <Tooltip content={tooltip}>{button}</Tooltip> : button}
      </Link>
    </Grid>
  )
}

export function UsefulLinks() {
  return (
    <>
      <h3>Przydatne linki</h3>
      <Grid.Container
        gap={1}
        alignItems={'center'}
        justify={'flex-start'}
        direction={'row'}
        wrap={'wrap'}
      >
        <UsefulLink
          icon={<FontAwesomeIcon icon={faBook} />}
          builtinColor={'primary'}
          href={baseUrl + 'redoc'}
          text={'ReDoc'}
        />
        <UsefulLink
          icon={<FontAwesomeIcon icon={faGithub} />}
          builtinColor={'secondary'}
          href={'https://github.com/pjatk21/alt-api'}
          text={'Github'}
        />
        <UsefulLink
          icon={<FontAwesomeIcon icon={faWarning} />}
          builtinColor={'warning'}
          href={'https://github.com/pjatk21/alt-api/issues/new/choose'}
          text={'Zgłoś usterkę'}
        />
        {/* <UsefulLink
          icon={<FontAwesomeIcon icon={faApple} />}
          customColor={'#cfd4d4'}
          href={'https://github.com/pjatk21/Pie-Schedule'}
          disabled
          text={'iOS app (𝝰)'}
          tooltip={'Potrzebuję pieniędzy na licencję do dystrybucji'}
        /> */}
        <UsefulLink
          icon={<FontAwesomeIcon icon={faCircleDollarToSlot} />}
          customColor={'#e0a8dd'}
          href={'https://revolut.me/kpostekk'}
          text={'Donate me'}
          tooltip={"coffee && booze ain't cheap ☕️ 🥃"}
        />
        <UsefulLink
          icon={<FontAwesomeIcon icon={faRobot} />}
          // customColor={'#e0a8dd'}
          href={'/dev'}
          text={'Status'}
        />
      </Grid.Container>
    </>
  )
}
