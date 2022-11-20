import SortableTree, {
  addNodeUnderParent,
  changeNodeAtPath,
  getFlatDataFromTree,
  getTreeFromFlatData,
  removeNodeAtPath,
  toggleExpandedForAll,
} from '@nosferatu500/react-sortable-tree'
import '@nosferatu500/react-sortable-tree/style.css'
import axios from 'axios'

import { useCallback, useEffect, useState } from 'react'
import { Button, InputGroup } from 'react-bootstrap'
import { IListBlocks } from '../types'

const CustomOrigin = () => {
  const [blocks, setBlocks] = useState<IListBlocks[]>([])
  const [blocksAux, setBlocksAux] = useState<IListBlocks[]>([])
  const [searchString, setSearchString] = useState<string>('')
  const [searchFocusIndex, setSearchFocusIndex] = useState<number>(0)

  const handleSearchStringChange = useCallback((event: any) => {
    setSearchString(event.target.value)
  }, [])

  useEffect(() => {
    fetch('http://localhost:7010/blocks')
      .then((response) => response.json())
      .then((response) => setBlocks(response))
  }, [])

  const someOnlineAdvice = {
    treeData: getTreeFromFlatData({
      flatData: blocks.map((node) => ({
        ...node,
        title: node.name,
      })),

      getKey: (node) => node.blockId,
      getParentKey: (node) => node.blockParent,
      rootKey: '0',
    }),
  }
  const flatData = getFlatDataFromTree({
    treeData: someOnlineAdvice.treeData,
    getNodeKey: ({ node }) => node.blockId, // This ensures your "id" properties are exported in the path
    ignoreCollapsed: false,
  }).map(({ node, path }) => ({
    blockId: node.blockId,
    name: node.name,
    abrv: node.abrv,
    blockParent: path.length > 1 ? path[path.length - 2] : '0',
    data: node.data,
    date: node.date,
    leafParent: node.leafParent,
  }))

  const expandAll = useCallback(() => {
    const expanded = toggleExpandedForAll({
      treeData: someOnlineAdvice.treeData,
      expanded: true,
    }) as IListBlocks[]
    setBlocks(expanded)
  }, [someOnlineAdvice.treeData])

  const collapseAll = useCallback(() => {
    const expanded = toggleExpandedForAll({
      treeData: someOnlineAdvice.treeData,
      expanded: false,
    }) as IListBlocks[]
    setBlocks(expanded)
  }, [someOnlineAdvice.treeData])

  const handleSave = useCallback(() => {
    if (flatData.length > 0) {
      axios
        .put(`http://localhost:7010/blocks/${flatData[0].blockId}`, flatData)

        .then((res) => {
          setBlocksAux(res.data)
          setBlocks(res.data)
          expandAll()
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }, [expandAll, flatData])

  const onChange = (treeData: IListBlocks[]) => {
    setBlocks(treeData)
    setBlocksAux(treeData)
  }

  const addNode = useCallback(
    (path: number[]) => {
      const newBlocks = addNodeUnderParent({
        treeData: someOnlineAdvice.treeData,
        parentKey: path[path.length - 1],
        expandParent: true,
        getNodeKey: ({ treeIndex }) => treeIndex,
        newNode: {
          blockId: Math.random().toString(36),
          blockParent: path[path.length - 1],
          name: 'Nova Área',
          abrv: 'Editar Abreviação',
        },
        addAsFirstChild: true,
      }).treeData as IListBlocks[]
      setBlocks(newBlocks)
      setBlocksAux(newBlocks)
    },
    [someOnlineAdvice.treeData],
  )
  const removeNode = useCallback(
    (path: number[]) => {
      const newBlocks = removeNodeAtPath({
        treeData: someOnlineAdvice.treeData,
        path,
        getNodeKey: ({ treeIndex }) => treeIndex,
      }) as IListBlocks[]
      setBlocks(newBlocks)
      setBlocksAux(newBlocks)
    },
    [someOnlineAdvice.treeData],
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
        {blocks.length > 0 && (
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
        treeData={someOnlineAdvice.treeData}
        onChange={onChange}
        searchFinishCallback={(matches) =>
          setSearchFocusIndex(
            matches.length > 0 ? searchFocusIndex % matches.length : 0,
          )
        }
        generateNodeProps={({ node, path }) => ({
          buttons: [
            <Button
              key={node.id}
              variant="primary"
              onClick={() => {
                addNode(path)
              }}
            >
              Criar
            </Button>,
            <Button
              key={node.id}
              variant="secondary"
              onClick={() => {
                removeNode(path)
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
                onChange={(e) => {
                  setBlocks((state) => {
                    const newDaum = changeNodeAtPath({
                      treeData: state,
                      path,
                      getNodeKey: ({ treeIndex }) => treeIndex,
                      newNode: {
                        ...node,
                        name: e.target.value,
                      },
                    }) as IListBlocks[]
                    setBlocksAux(newDaum)
                    return newDaum
                  })
                }}
              />
              <input
                type="text"
                value={node.abrv}
                onChange={(e) => {
                  setBlocks((state) => {
                    const newDaum = changeNodeAtPath({
                      treeData: state,
                      path,
                      getNodeKey: ({ treeIndex }) => treeIndex,
                      newNode: {
                        ...node,
                        abrv: e.target.value,
                      },
                    }) as IListBlocks[]
                    setBlocksAux(newDaum)
                    return newDaum
                  })
                }}
              />
            </InputGroup>
          ),
        })}
      />
      <ul>
        {flatData.map(({ blockId, name, blockParent }) => (
          <li key={blockId}>
            id: {blockId}, name: {name}, parent: {blockParent || 'null'}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default CustomOrigin
