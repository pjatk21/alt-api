export function useDatalist(data: (string | number)[], id: string) {
  return (
    <datalist onInput={console.log} id={id}>
      {data.map((value, i) => (
        <option key={id + i.toString()} value={value} />
      ))}
    </datalist>
  )
}
