import { Button, Container, Grid, Text } from '@nextui-org/react'

export default function Toolbox() {
  return (
    <Container xs>
      <Text h2>Narzędzia</Text>
      <Grid.Container justify={'center'} alignItems={'center'}>
        <Grid xs={4} justify={'flex-end'}>
          <Text>Potrzebuję...</Text>
        </Grid>
        <Grid xs={8}>
          <Grid.Container gap={2} direction={'column'}>
            <Grid>
              <Button>Znaleźć inne grupy wykładowcy</Button>
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
