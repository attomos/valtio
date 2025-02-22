import { StrictMode } from 'react'
import { fireEvent, render } from '@testing-library/react'
import { useSnapshot } from 'valtio'
import { proxyWithHistory } from 'valtio/utils'

it('simple count', async () => {
  const state = proxyWithHistory(0)

  const Counter = () => {
    const snap = useSnapshot(state)
    return (
      <>
        <div>count: {snap.value}</div>
        <button onClick={() => ++state.value}>inc</button>
        <button onClick={snap.undo}>undo</button>
        <button onClick={snap.redo}>redo</button>
      </>
    )
  }

  const { getByText, findByText } = render(
    <StrictMode>
      <Counter />
    </StrictMode>
  )

  await findByText('count: 0')

  fireEvent.click(getByText('inc'))
  await findByText('count: 1')

  fireEvent.click(getByText('inc'))
  await findByText('count: 2')

  fireEvent.click(getByText('inc'))
  await findByText('count: 3')

  fireEvent.click(getByText('undo'))
  await findByText('count: 2')

  fireEvent.click(getByText('redo'))
  await findByText('count: 3')

  fireEvent.click(getByText('undo'))
  await findByText('count: 2')

  fireEvent.click(getByText('undo'))
  await findByText('count: 1')

  fireEvent.click(getByText('undo'))
  await findByText('count: 0')

  fireEvent.click(getByText('inc'))
  await findByText('count: 1')

  fireEvent.click(getByText('undo'))
  await findByText('count: 0')
})

it('count in object', async () => {
  const state = proxyWithHistory({ count: 0 })

  const Counter = () => {
    const snap = useSnapshot(state)
    return (
      <>
        <div>count: {snap.value.count}</div>
        <button onClick={() => ++state.value.count}>inc</button>
        <button onClick={snap.undo}>undo</button>
        <button onClick={snap.redo}>redo</button>
      </>
    )
  }

  const { getByText, findByText } = render(
    <StrictMode>
      <Counter />
    </StrictMode>
  )

  await findByText('count: 0')

  fireEvent.click(getByText('inc'))
  await findByText('count: 1')

  fireEvent.click(getByText('inc'))
  await findByText('count: 2')

  fireEvent.click(getByText('inc'))
  await findByText('count: 3')

  fireEvent.click(getByText('undo'))
  await findByText('count: 2')

  fireEvent.click(getByText('redo'))
  await findByText('count: 3')

  fireEvent.click(getByText('undo'))
  await findByText('count: 2')

  fireEvent.click(getByText('undo'))
  await findByText('count: 1')

  fireEvent.click(getByText('undo'))
  await findByText('count: 0')

  fireEvent.click(getByText('inc'))
  await findByText('count: 1')

  fireEvent.click(getByText('undo'))
  await findByText('count: 0')
})

it('count in nested object', async () => {
  const state = proxyWithHistory({ nested: { count: 0 } })

  const Counter = () => {
    const snap = useSnapshot(state)
    return (
      <>
        <div>count: {snap.value.nested.count}</div>
        <button onClick={() => ++state.value.nested.count}>inc</button>
        <button onClick={snap.undo}>undo</button>
        <button onClick={snap.redo}>redo</button>
      </>
    )
  }

  const { getByText, findByText } = render(
    <StrictMode>
      <Counter />
    </StrictMode>
  )

  await findByText('count: 0')

  fireEvent.click(getByText('inc'))
  await findByText('count: 1')

  fireEvent.click(getByText('inc'))
  await findByText('count: 2')

  fireEvent.click(getByText('inc'))
  await findByText('count: 3')

  fireEvent.click(getByText('undo'))
  await findByText('count: 2')

  fireEvent.click(getByText('redo'))
  await findByText('count: 3')

  fireEvent.click(getByText('undo'))
  await findByText('count: 2')

  fireEvent.click(getByText('undo'))
  await findByText('count: 1')

  fireEvent.click(getByText('undo'))
  await findByText('count: 0')

  fireEvent.click(getByText('inc'))
  await findByText('count: 1')

  fireEvent.click(getByText('undo'))
  await findByText('count: 0')
})

it('multiple redos at once (#323)', async () => {
  const state = proxyWithHistory({ nested: { count: 0 } })

  const Counter = () => {
    const snap = useSnapshot(state)
    return (
      <>
        <div>count: {snap.value.nested.count}</div>
        <button onClick={() => ++state.value.nested.count}>inc</button>
        <button
          onClick={() => {
            state.undo()
            state.undo()
          }}>
          undo twice
        </button>
        <button
          onClick={() => {
            state.redo()
            state.redo()
          }}>
          redo twice
        </button>
      </>
    )
  }

  const { getByText, findByText } = render(
    <StrictMode>
      <Counter />
    </StrictMode>
  )

  await findByText('count: 0')

  fireEvent.click(getByText('inc'))
  await findByText('count: 1')
  fireEvent.click(getByText('inc'))
  await findByText('count: 2')

  fireEvent.click(getByText('undo twice'))
  await findByText('count: 0')

  fireEvent.click(getByText('redo twice'))
  await findByText('count: 2')
})
