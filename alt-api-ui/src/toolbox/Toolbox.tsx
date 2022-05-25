import { Button, Container, Grid, Text } from '@nextui-org/react'
import { Link } from 'react-router-dom'
import { useIsConfigured } from '../altapi'
import NavLikeBar from '../components/NavLikeBar'

export default function Toolbox() {
  const isConf = useIsConfigured()

  if (!isConf) {
    ;<Container xs>
      <Text h3>Zanim uzyskasz dostęp do narzędzi, musisz skonfigurować aplikację.</Text>
      <Button>Dokonasz tego tutaj</Button> {/* TODO: dodać link */}
    </Container>
  }

  return (
    <Container xs>
      <NavLikeBar>
        <Text h2>Narzędzia</Text>
      </NavLikeBar>
      <Grid.Container justify={'center'} alignItems={'center'}>
        <Grid xs={4} justify={'flex-end'}>
          <Text>Potrzebuję...</Text>
        </Grid>
        <Grid xs={8}>
          <Grid.Container gap={2} direction={'column'}>
            <Grid>
              <Link to={'/app/toolbox/group-finder'}>
                <Button>Znaleźć inne grupy wykładowcy</Button>
              </Link>
            </Grid>
            <Grid>
              <Button>Sprawdzić zajęcia wykładowcy</Button>
            </Grid>
          </Grid.Container>
        </Grid>
      </Grid.Container>
    </Container>
  )
}
