import { ReactTreeList } from '@bartaxyz/react-tree-list'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { Daum } from '../types'

function CustomDrag() {
  const [daum, setDaum] = useState<Daum[]>([])

  useEffect(() => {
    axios.get('http://localhost:7010/data').then((res) => {
      setDaum(res.data)
    })
  }, [])

  const onTreeListChange = (daum: Daum[]) => {
    setDaum(daum)
  }

  const onTreeListSelected = (item: Daum) => {
    console.log('choosed item =', item.name)
  }

  const onDrop = (dragingNode: Daum, dragNode: Daum, drogType: string) => {
    console.log('dragingNode:', dragingNode)
    console.log('dragNode:', dragNode)
    console.log('drogType:', drogType)
  }
  const getDaum = (daum: Daum[]) => {
    const get: Daum[] = daum.map((item) => {
      return {
        ...item,
        id: item.blockId,
        label: item.name,
        parent: item.blockParent,
        children: item.children ? getDaum(item.children) : [],
      }
    })
    return get
  }

  return (
    <ReactTreeList
      data={getDaum(daum)}
      draggable={true}
      onDrop={onDrop}
      onChange={onTreeListChange}
      itemDefaults={{ open: false, arrow: '▸' }}
      selectedId="1"
      onSelected={onTreeListSelected}
      itemOptions={{
        focusedBackgroundColor: '#d60707',
      }}
    />
  )
}
export default CustomDrag
