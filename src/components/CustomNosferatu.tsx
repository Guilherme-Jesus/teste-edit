import SortableTree, {
  addNodeUnderParent,
  removeNodeAtPath,
  toggleExpandedForAll,
} from '@nosferatu500/react-sortable-tree'
import axios from 'axios'
import React, { useCallback, useEffect, useState } from 'react'
import { Daum } from '../types'
import '@nosferatu500/react-sortable-tree/style.css'
import { Button, InputGroup } from 'react-bootstrap'

function CustomNosferatu() {
  const [daum, setDaum] = useState<Daum[]>([])
  const [searchString, setSearchString] = useState<string>('')
  const [searchFocusIndex, setSearchFocusIndex] = useState<number>(0)
  const [updateDaum, setUpdateDaum] = useState<Daum[]>([])
  const [name, setName] = useState<string>('')
  useEffect(() => {
    axios.get('http://localhost:7010/data').then((res) => {
      setDaum(res.data)
    })
  }, [])

  const handleSearchStringChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchString(event.target.value)
    },
    [],
  )

  const getDaum = (daum: Daum[]) => {
    const get: Daum[] = daum.map((item) => {
      return {
        ...item,
        blockId: item.blockId,
        title: item.name,
        parent: item.blockParent,
        children: item.children ? getDaum(item.children) : [],
      }
    })
    return get
  }

  const handleChange = (daum: Daum[]) => {
    setUpdateDaum(daum)
    setDaum(daum)
  }
  console.log(updateDaum)

  const handleSave = useCallback(() => {
    if (updateDaum.length > 0) {
      axios
        .put(`http://localhost:7010/data/${updateDaum[0].blockId}`, {
          blockId: updateDaum[0].blockId,
          name: updateDaum[0].name,
          abrv: updateDaum[0].abrv,
          blockParent: updateDaum[0].blockParent,
          leafParent: updateDaum[0].leafParent,
          date: updateDaum[0].date,
          data: updateDaum[0].data,
          children: updateDaum[0].children,
        })
        .then((res) => {
          setUpdateDaum(res.data)
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }, [updateDaum])

  const expandAll = useCallback(() => {
    const expanded = toggleExpandedForAll({
      treeData: daum,
      expanded: true,
    })
    setDaum(expanded as Daum[])
  }, [daum])

  const collapseAll = useCallback(() => {
    const expanded = toggleExpandedForAll({
      treeData: daum,
      expanded: false,
    })
    setDaum(expanded as Daum[])
  }, [daum])

  /// create request post data

  const addNode = useCallback((daum: Daum[], path: number[]) => {
    const newDaum = addNodeUnderParent({
      treeData: daum,
      parentKey: path[path.length - 1],
      // expandParent: true,
      getNodeKey: ({ treeIndex }) => treeIndex,
      newNode: {
        title: 'new node',
        subtitle: 'Novso Bloco',
      },
      addAsFirstChild: true,
    }).treeData as Daum[]
    setDaum(newDaum)
    setUpdateDaum(newDaum)
  }, [])

  const removeNode = useCallback((daum: Daum[], path: number[]) => {
    const newDaum = removeNodeAtPath({
      treeData: daum,
      path,
      getNodeKey: ({ treeIndex }) => treeIndex,
    }) as Daum[]
    setDaum(newDaum as Daum[])
    setUpdateDaum(newDaum)
  }, [])

  const handleEdit = useCallback(
    (daum: Daum[], path: number[], title: string) => {
      const newDaum = daum.map((item, index) => {
        if (index === path[0]) {
          return {
            ...item,
            title,
          }
        }
        return item
      })
      setDaum(newDaum)
    },
    [],
  )

  return (
    <div style={{ height: 800, width: 800 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 10,
        }}
      >
        {daum.length > 0 && (
          <div>
            <Button onClick={expandAll}>Expandir</Button>
            <Button onClick={collapseAll}>Recolher</Button>
            <Button
              onClick={() => {
                handleSave()
              }}
            >
              Save
            </Button>
            ,
          </div>
        )}
      </div>
      <div>
        <input
          type="text"
          value={searchString}
          onChange={handleSearchStringChange}
          placeholder="Pesquisar"
        />
      </div>

      <SortableTree
        searchQuery={searchString}
        searchFocusOffset={searchFocusIndex}
        treeData={getDaum(daum)}
        onChange={handleChange}
        generateNodeProps={({ node, path }) => ({
          buttons: [
            <Button
              key={node.id}
              variant="primary"
              onClick={() => {
                addNode(daum, path)
              }}
            >
              Criar
            </Button>,
            <Button
              key={node.id}
              variant="secondary"
              onClick={() => {
                removeNode(daum, path)
              }}
            >
              Remover
            </Button>,
          ],
          title: (
            <InputGroup>
              <input
                type="text"
                value={node.title}
                onChange={(event) => {
                  handleEdit(daum, path, event.target.value)
                }}
              />
            </InputGroup>
          ),
        })}
      />
    </div>
  )
}

export default CustomNosferatu
