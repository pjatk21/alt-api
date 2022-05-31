import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Grid, Spacer } from '@nextui-org/react'

type NavLikeBarProps = {
  children?: JSX.Element | JSX.Element[]
  backButtonOverrideAction?: () => void
}

export default function NavLikeBar(props: NavLikeBarProps) {
  return (
    <>
      <Spacer />
      <Grid.Container alignItems={'center'}>
        {/* <Grid>
          <Button
            auto
            light
            icon={<FontAwesomeIcon icon={faArrowLeft} />}
            onClick={props.backButtonOverrideAction ?? (() => window.history.back())}
          />
        </Grid> */}
        <Grid>{props.children ?? null}</Grid>
      </Grid.Container>
      <Spacer />
    </>
  )
}
