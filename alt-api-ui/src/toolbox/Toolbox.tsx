import { Button, Container, Grid, Spacer, Text } from '@nextui-org/react'
import { Link } from 'react-router-dom'
import { useIsConfigured } from '../altapi'
import NavLikeBar from '../components/NavLikeBar'

export default function Toolbox() {
  const isConf = useIsConfigured()

  if (!isConf) {
    <Container xs>
      <Text h3>Zanim uzyskasz dostęp do narzędzi, musisz skonfigurować aplikację.</Text>
      <Button>Dokonasz tego tutaj</Button> {/* TODO: dodać link */}
    </Container>
  }

  return (
    <Container xs>
      <NavLikeBar>
        <Text h2>Narzędzia</Text>
      </NavLikeBar>
      <Text color={'warning'} css={{ fontWeight: '$bold' }}>
        Uwaga, narzędzia poniżej są eksperymentalne, wyglądają brzydko, były robione na kolanie,
        pod presją czasu, ze zbyt małą ilością kofeiny, mogą zostać usunięte w przeszłości. Nie
        polegaj na nich.
      </Text>
      <Spacer />
      <Grid.Container justify={'center'} alignItems={'center'}>
        <Grid xs={4} justify={'flex-end'}>
          <Text>Potrzebuję...</Text>
        </Grid>
        <Grid md={8}>
          <Grid.Container gap={2} direction={'column'}>
            <Grid>
              <Link to={'/app/toolbox/tutor-finder'}>
                <Button>Znaleźć inne zajęcia wykładowcy</Button>
              </Link>
            </Grid>
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
